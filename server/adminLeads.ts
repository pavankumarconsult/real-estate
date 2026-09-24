import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
import {
  AdminDateRange,
  AdminLead,
  AdminLeadFilters,
  AdminLeadQuery,
  AdminLeadQueryResult,
} from '../shared/adminTypes.js';
import {
  ENQUIRIES_COLLECTION,
  ENQUIRY_IDEMPOTENCY_COLLECTION,
} from './firestoreEnquiryStore.js';

const IST_OFFSET_MILLISECONDS = 330 * 60 * 1000;
const FIRESTORE_BATCH_SIZE = 500;

function indiaDayStart(daysAgo = 0): Date {
  const shiftedNow = new Date(Date.now() + IST_OFFSET_MILLISECONDS);
  const utcStart = Date.UTC(
    shiftedNow.getUTCFullYear(),
    shiftedNow.getUTCMonth(),
    shiftedNow.getUTCDate() - daysAgo,
  ) - IST_OFFSET_MILLISECONDS;
  return new Date(utcStart);
}

function rangeStart(range: AdminDateRange): Date | null {
  if (range === 'today') return indiaDayStart();
  if (range === '7d') return indiaDayStart(6);
  if (range === '30d') return indiaDayStart(29);
  return null;
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function nullableStringValue(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null;
}

function timestampToIso(value: unknown): string | null {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date && Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }
  return null;
}

function leadFromDocument(document: QueryDocumentSnapshot<DocumentData>): AdminLead | null {
  const data = document.data();
  const createdAt = timestampToIso(data.createdAt);
  if (!createdAt) return null;
  const source = data.source && typeof data.source === 'object'
    ? data.source as Record<string, unknown>
    : {};

  return {
    id: document.id,
    createdAt,
    name: stringValue(data.name),
    mobile: stringValue(data.mobile),
    email: nullableStringValue(data.email),
    projectId: stringValue(data.projectId),
    projectName: stringValue(data.projectName),
    intent: stringValue(data.intent),
    context: nullableStringValue(data.context),
    status: stringValue(data.status),
    source: {
      channel: stringValue(source.channel),
      pagePath: stringValue(source.pagePath),
      referrerHost: nullableStringValue(source.referrerHost),
    },
  };
}

function matchesSearch(lead: AdminLead, search: string): boolean {
  if (!search) return true;
  const normalizedSearch = search.trim().toLocaleLowerCase('en-IN');
  const compactSearch = normalizedSearch.replace(/[^a-z0-9]/g, '');
  const values = [
    lead.id,
    lead.name,
    lead.mobile,
    lead.email ?? '',
    lead.projectName,
    lead.intent,
    lead.context ?? '',
  ];

  return values.some((value) => {
    const normalizedValue = value.toLocaleLowerCase('en-IN');
    return normalizedValue.includes(normalizedSearch) || (
      compactSearch.length > 1 && normalizedValue.replace(/[^a-z0-9]/g, '').includes(compactSearch)
    );
  });
}

async function scanLeads(
  database: Firestore,
  filters: AdminLeadFilters,
): Promise<AdminLead[]> {
  const direction = filters.sort === 'oldest' ? 'asc' : 'desc';
  let baseQuery: Query<DocumentData> = database
    .collection(ENQUIRIES_COLLECTION)
    .orderBy('createdAt', direction);
  const start = rangeStart(filters.dateRange);
  if (start) {
    baseQuery = baseQuery.where('createdAt', '>=', Timestamp.fromDate(start));
  }

  const leads: AdminLead[] = [];
  let cursor: QueryDocumentSnapshot<DocumentData> | null = null;

  while (true) {
    const pageQuery: Query<DocumentData> = cursor
      ? baseQuery.startAfter(cursor).limit(FIRESTORE_BATCH_SIZE)
      : baseQuery.limit(FIRESTORE_BATCH_SIZE);
    const snapshot: QuerySnapshot<DocumentData> = await pageQuery.get();
    for (const document of snapshot.docs) {
      const lead = leadFromDocument(document);
      if (lead && matchesSearch(lead, filters.search)) leads.push(lead);
    }
    if (snapshot.size < FIRESTORE_BATCH_SIZE) break;
    cursor = snapshot.docs[snapshot.docs.length - 1];
  }

  return leads;
}

export async function queryAdminLeads(
  database: Firestore,
  query: AdminLeadQuery,
): Promise<AdminLeadQueryResult> {
  const collection = database.collection(ENQUIRIES_COLLECTION);
  const [matchingLeads, totalSnapshot, todaySnapshot] = await Promise.all([
    scanLeads(database, query),
    collection.count().get(),
    collection.where('createdAt', '>=', Timestamp.fromDate(indiaDayStart())).count().get(),
  ]);

  const matchingCount = matchingLeads.length;
  const pageCount = Math.max(1, Math.ceil(matchingCount / query.pageSize));
  const page = Math.min(query.page, pageCount);
  const offset = (page - 1) * query.pageSize;

  return {
    leads: matchingLeads.slice(offset, offset + query.pageSize),
    page,
    pageSize: query.pageSize,
    pageCount,
    matchingCount,
    totalCount: totalSnapshot.data().count,
    todayCount: todaySnapshot.data().count,
  };
}

export async function deleteAdminLead(database: Firestore, leadId: string): Promise<boolean> {
  const leadReference = database.collection(ENQUIRIES_COLLECTION).doc(leadId);
  const leadSnapshot = await leadReference.get();
  if (!leadSnapshot.exists) return false;

  const markerSnapshot = await database
    .collection(ENQUIRY_IDEMPOTENCY_COLLECTION)
    .where('leadId', '==', leadId)
    .get();
  const batch = database.batch();
  batch.delete(leadReference);
  for (const marker of markerSnapshot.docs) batch.delete(marker.ref);
  await batch.commit();
  return true;
}

export async function getLeadsForExport(
  database: Firestore,
  filters: AdminLeadFilters,
  selectedIds: string[],
): Promise<AdminLead[]> {
  if (!selectedIds.length) return scanLeads(database, filters);

  const references = selectedIds.map((id) => database.collection(ENQUIRIES_COLLECTION).doc(id));
  const snapshots = await database.getAll(...references);
  return snapshots
    .filter((snapshot): snapshot is QueryDocumentSnapshot<DocumentData> => snapshot.exists)
    .map(leadFromDocument)
    .filter((lead): lead is AdminLead => Boolean(lead))
    .sort((left, right) => {
      const difference = Date.parse(right.createdAt) - Date.parse(left.createdAt);
      return filters.sort === 'oldest' ? -difference : difference;
    });
}

function safeSpreadsheetValue(value: string): string {
  return /^\s*[=+\-@]/.test(value) || /^[\t\r]/.test(value) ? `'${value}` : value;
}

function csvCell(value: string | null): string {
  const safeValue = safeSpreadsheetValue(value ?? '');
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export function createLeadsCsv(leads: AdminLead[]): string {
  const headings = [
    'Enquiry ID',
    'Submitted At (ISO)',
    'Customer Name',
    'Mobile',
    'Email',
    'Project',
    'Enquiry Type',
    'Context',
    'Status',
    'Source Page',
    'Referrer Host',
  ];
  const rows = leads.map((lead) => [
    lead.id,
    lead.createdAt,
    lead.name,
    lead.mobile,
    lead.email,
    lead.projectName,
    lead.intent,
    lead.context,
    lead.status,
    lead.source.pagePath,
    lead.source.referrerHost,
  ].map(csvCell).join(','));

  return `\uFEFF${headings.map(csvCell).join(',')}\r\n${rows.join('\r\n')}\r\n`;
}
