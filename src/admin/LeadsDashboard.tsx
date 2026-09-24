import { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  AlertCircle,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Database,
  Download,
  Eye,
  FileText,
  Inbox,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  AdminDateRange,
  AdminLead,
  AdminLeadFilters,
  AdminLeadQueryResult,
  AdminSortOrder,
} from '../../shared/adminTypes';
import { AdminApiError, deleteLead, exportLeadsCsv, queryLeads } from './adminApi';

const PAGE_SIZE = 10;

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  dateStyle: 'medium',
  timeStyle: 'short',
});

interface LeadsDashboardProps {
  user: User;
  authorizedEmail: string | null;
  onSignOut: () => Promise<void>;
  onSessionError: (error: unknown) => Promise<void>;
}

function formattedPhone(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return mobile || 'Not provided';
}

function initials(email: string | null): string {
  if (!email) return 'AD';
  const localPart = email.split('@')[0] ?? '';
  const parts = localPart.split(/[._-]/).filter(Boolean);
  const value = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : localPart.slice(0, 2);
  return value.toUpperCase() || 'AD';
}

function shortId(id: string): string {
  return id.length > 12 ? `…${id.slice(-10)}` : id;
}

function statusLabel(status: string): string {
  return status ? status.replace(/(^|[-_\s])\w/g, (value) => value.toUpperCase()) : 'Not set';
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'team4-aria-enquiries.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid gap-1 border-b border-[#e9e1dd] py-3 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-5">
      <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[#807666]">{label}</dt>
      <dd className="break-words text-sm text-[#1e1b19]">{value || 'Not provided'}</dd>
    </div>
  );
}

export function LeadsDashboard({ user, authorizedEmail, onSignOut, onSessionError }: LeadsDashboardProps) {
  const [filters, setFilters] = useState<AdminLeadFilters>({ search: '', dateRange: 'all', sort: 'newest' });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AdminLeadQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailLead, setDetailLead] = useState<AdminLead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminLead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [exportMode, setExportMode] = useState<'matching' | 'selected' | null>(null);
  const [exportError, setExportError] = useState('');
  const [copiedId, setCopiedId] = useState('');

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setRequestError('');
      try {
        const nextResult = await queryLeads(user, { ...filters, page, pageSize: PAGE_SIZE });
        if (!active) return;
        setResult(nextResult);
        if (nextResult.page !== page) setPage(nextResult.page);
      } catch (error) {
        if (!active) return;
        if (error instanceof AdminApiError && ['session-expired', 'unauthorized', 'configuration-error'].includes(error.code)) {
          await onSessionError(error);
          return;
        }
        setRequestError('The enquiries could not be loaded. Please retry.');
      } finally {
        if (active) setIsLoading(false);
      }
    }, filters.search ? 300 : 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [filters, onSessionError, page, refreshKey, user]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetailLead(null);
        if (!isDeleting) setDeleteTarget(null);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isDeleting]);

  const currentIds = useMemo(() => result?.leads.map((lead) => lead.id) ?? [], [result]);
  const allCurrentSelected = currentIds.length > 0 && currentIds.every((id) => selectedIds.has(id));

  const updateFilters = (nextFilters: Partial<AdminLeadFilters>) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
    setPage(1);
    setSelectedIds(new Set());
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCurrentPage = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allCurrentSelected) currentIds.forEach((id) => next.delete(id));
      else currentIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleCopyPhone = async (lead: AdminLead) => {
    try {
      await navigator.clipboard.writeText(lead.mobile);
      setCopiedId(lead.id);
      window.setTimeout(() => setCopiedId((current) => current === lead.id ? '' : current), 1800);
    } catch {
      setRequestError('The phone number could not be copied on this device.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteLead(user, deleteTarget.id);
      setSelectedIds((current) => {
        const next = new Set(current);
        next.delete(deleteTarget.id);
        return next;
      });
      setDeleteTarget(null);
      setDetailLead((current) => current?.id === deleteTarget.id ? null : current);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      if (error instanceof AdminApiError && ['session-expired', 'unauthorized', 'configuration-error'].includes(error.code)) {
        await onSessionError(error);
        return;
      }
      setDeleteError('The lead was not deleted. Please retry.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async (mode: 'matching' | 'selected') => {
    if (mode === 'selected' && !selectedIds.size) return;
    setExportMode(mode);
    setExportError('');
    try {
      const blob = await exportLeadsCsv(user, filters, mode === 'selected' ? Array.from(selectedIds) : []);
      downloadBlob(blob);
    } catch (error) {
      if (error instanceof AdminApiError && ['session-expired', 'unauthorized', 'configuration-error'].includes(error.code)) {
        await onSessionError(error);
        return;
      }
      setExportError('The CSV export could not be generated. Please retry.');
    } finally {
      setExportMode(null);
    }
  };

  const hasFilters = Boolean(filters.search) || filters.dateRange !== 'all';

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b19]">
      <header className="sticky top-0 z-30 border-b border-[#d2c5b3]/60 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#775610] text-white">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-serif text-xl font-semibold">Team4 Aria</span>
                <span className="hidden text-[11px] font-bold uppercase tracking-[0.12em] text-[#775610] sm:inline">Admin</span>
              </div>
              <p className="truncate text-xs text-[#635d5c]">Private enquiry management</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded border border-[#186a22]/20 bg-[#a3f69c]/25 px-3 py-2 text-xs font-semibold text-[#186a22] md:inline-flex">
              <span className="h-2 w-2 rounded-full bg-[#186a22]" /> Authorized session
            </span>
            <div className="hidden max-w-60 text-right sm:block">
              <p className="truncate text-xs font-semibold">{authorizedEmail || user.email || 'Approved administrator'}</p>
              <p className="text-[11px] text-[#807666]">UID allowlist verified</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded border border-[#d2c5b3] bg-[#ffdea7] text-xs font-bold text-[#5e4200]">
              {initials(authorizedEmail || user.email)}
            </span>
            <button onClick={onSignOut} className="rounded p-2 text-[#635d5c] hover:bg-[#ffdad6] hover:text-[#ba1a1a]" aria-label="Sign out">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6 sm:py-7">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4" aria-label="Enquiry metrics">
          <div className="rounded-lg border border-[#d2c5b3]/65 bg-white p-4 shadow-[0_1px_3px_rgba(28,25,23,0.04)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#635d5c]">Total enquiries</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{result?.totalCount ?? '—'}</p>
                <p className="mt-1 text-xs text-[#807666]">Saved Firestore records</p>
              </div>
              <span className="rounded bg-[#f4ece8] p-2.5 text-[#775610]"><Database className="h-5 w-5" /></span>
            </div>
          </div>
          <div className="rounded-lg border border-[#d2c5b3]/65 bg-white p-4 shadow-[0_1px_3px_rgba(28,25,23,0.04)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#635d5c]">New today</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-[#775610]">{result?.todayCount ?? '—'}</p>
                <p className="mt-1 text-xs text-[#807666]">Asia/Kolkata calendar day</p>
              </div>
              <span className="rounded bg-[#ffdea7]/45 p-2.5 text-[#775610]"><Inbox className="h-5 w-5" /></span>
            </div>
          </div>
          <div className="col-span-2 rounded-lg border border-[#d2c5b3]/65 bg-white p-4 shadow-[0_1px_3px_rgba(28,25,23,0.04)] sm:p-5 lg:col-span-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#635d5c]">Matching results</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{result?.matchingCount ?? '—'}</p>
                <p className="mt-1 text-xs text-[#807666]">Current search and date range</p>
              </div>
              <span className="rounded bg-[#f4ece8] p-2.5 text-[#775610]"><FileText className="h-5 w-5" /></span>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#d2c5b3]/65 bg-white p-4 shadow-[0_1px_3px_rgba(28,25,23,0.04)]">
          <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_180px_180px_auto]">
            <label className="relative block">
              <span className="sr-only">Search enquiries</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#807666]" aria-hidden="true" />
              <input
                type="search"
                value={filters.search}
                onChange={(event) => updateFilters({ search: event.target.value })}
                placeholder="Search name, phone, email, enquiry ID…"
                className="w-full rounded border border-[#d2c5b3] bg-[#faf2ee] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#775610] focus:bg-white"
              />
            </label>
            <label>
              <span className="sr-only">Date range</span>
              <select
                value={filters.dateRange}
                onChange={(event) => updateFilters({ dateRange: event.target.value as AdminDateRange })}
                className="w-full rounded border border-[#d2c5b3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#775610]"
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Sort order</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value as AdminSortOrder })}
                className="w-full rounded border border-[#d2c5b3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#775610]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded border border-[#d2c5b3] bg-[#f4ece8] px-4 py-2.5 text-sm font-semibold hover:bg-[#e9e1dd] disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#e9e1dd] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-[#4e4638]">
              <input type="checkbox" checked={allCurrentSelected} onChange={toggleCurrentPage} className="h-4 w-4 accent-[#775610]" />
              Select current page
              {selectedIds.size > 0 && <span className="rounded-full bg-[#292524] px-2 py-0.5 text-xs text-white">{selectedIds.size} selected</span>}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => handleExport('selected')}
                disabled={!selectedIds.size || exportMode !== null}
                className="inline-flex items-center justify-center gap-2 rounded border border-[#775610] px-4 py-2 text-xs font-semibold text-[#775610] hover:bg-[#faf2ee] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Download className="h-4 w-4" /> {exportMode === 'selected' ? 'Preparing…' : `Export selected (${selectedIds.size})`}
              </button>
              <button
                type="button"
                onClick={() => handleExport('matching')}
                disabled={exportMode !== null || !result?.matchingCount}
                className="inline-flex items-center justify-center gap-2 rounded bg-[#775610] px-4 py-2 text-xs font-semibold text-white hover:bg-[#926f28] disabled:cursor-not-allowed disabled:bg-[#807666]"
              >
                <Download className="h-4 w-4" /> {exportMode === 'matching' ? 'Preparing…' : 'Export matching CSV'}
              </button>
            </div>
          </div>
          {exportError && <p role="alert" className="mt-3 text-sm text-[#ba1a1a]">{exportError}</p>}
        </section>

        {requestError && (
          <div role="alert" className="flex items-center justify-between gap-4 rounded border border-[#ba1a1a]/35 bg-[#ffdad6]/55 p-4 text-sm text-[#93000a]">
            <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" /> {requestError}</span>
            <button onClick={() => setRefreshKey((current) => current + 1)} className="font-semibold underline">Retry</button>
          </div>
        )}

        <section aria-label="Enquiry records">
          {isLoading && !result ? (
            <div className="rounded-lg border border-[#d2c5b3]/65 bg-white px-5 py-16 text-center text-sm text-[#635d5c]">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#d2c5b3] border-t-[#775610]" />
              <p className="mt-4">Loading saved enquiries…</p>
            </div>
          ) : result && result.leads.length === 0 ? (
            <div className="rounded-lg border border-[#d2c5b3]/65 bg-white px-5 py-16 text-center">
              <Inbox className="mx-auto h-9 w-9 text-[#a37e36]" />
              <h2 className="mt-4 font-serif text-2xl font-semibold">{hasFilters ? 'No matching enquiries' : 'No enquiries yet'}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#635d5c]">
                {hasFilters ? 'Try changing the search or date range.' : 'New records will appear here after the public form confirms a Firestore save.'}
              </p>
            </div>
          ) : result ? (
            <>
              <div className="hidden overflow-hidden rounded-lg border border-[#d2c5b3]/65 bg-white shadow-[0_1px_3px_rgba(28,25,23,0.04)] lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] border-collapse text-left">
                    <thead className="bg-[#f4ece8] text-[11px] font-bold uppercase tracking-[0.08em] text-[#4e4638]">
                      <tr>
                        <th className="w-12 px-4 py-3"><span className="sr-only">Select</span></th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Enquiry</th>
                        <th className="px-4 py-3">Context</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e9e1dd]">
                      {result.leads.map((lead) => (
                        <tr key={lead.id} className="align-top hover:bg-[#fff8f5]">
                          <td className="px-4 py-5"><input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => toggleSelected(lead.id)} aria-label={`Select ${lead.name || lead.id}`} className="h-4 w-4 accent-[#775610]" /></td>
                          <td className="px-4 py-5">
                            <p className="font-mono text-xs font-semibold text-[#775610]" title={lead.id}>{shortId(lead.id)}</p>
                            <p className="mt-1 text-xs text-[#635d5c]">{dateFormatter.format(new Date(lead.createdAt))}</p>
                          </td>
                          <td className="px-4 py-5">
                            <p className="font-serif text-lg font-semibold">{lead.name || 'Name unavailable'}</p>
                            <span className="mt-1 inline-flex rounded bg-[#ffdea7]/45 px-2 py-1 text-[11px] font-semibold text-[#5e4200]">{statusLabel(lead.status)}</span>
                          </td>
                          <td className="px-4 py-5 text-sm">
                            <p className="font-medium">{formattedPhone(lead.mobile)}</p>
                            <p className="mt-1 max-w-60 break-all text-xs text-[#635d5c]">{lead.email || 'Email not provided'}</p>
                          </td>
                          <td className="px-4 py-5 text-sm">
                            <p className="font-semibold">{lead.intent || 'Not specified'}</p>
                            <p className="mt-1 text-xs text-[#635d5c]">{lead.projectName || 'Project not specified'}</p>
                          </td>
                          <td className="max-w-xs px-4 py-5 text-sm leading-6 text-[#4e4638]">{lead.context || 'No additional context'}</td>
                          <td className="px-4 py-5">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => setDetailLead(lead)} className="rounded border border-[#d2c5b3] p-2 text-[#4e4638] hover:bg-[#f4ece8]" aria-label={`View ${lead.name || lead.id}`}><Eye className="h-4 w-4" /></button>
                              <button onClick={() => handleCopyPhone(lead)} className="rounded border border-[#d2c5b3] p-2 text-[#4e4638] hover:bg-[#f4ece8]" aria-label={`Copy phone for ${lead.name || lead.id}`}>{copiedId === lead.id ? <Check className="h-4 w-4 text-[#186a22]" /> : <Clipboard className="h-4 w-4" />}</button>
                              <button onClick={() => { setDeleteError(''); setDeleteTarget(lead); }} className="rounded p-2 text-[#635d5c] hover:bg-[#ffdad6] hover:text-[#ba1a1a]" aria-label={`Delete ${lead.name || lead.id}`}><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3 lg:hidden">
                {result.leads.map((lead) => (
                  <article key={lead.id} className="overflow-hidden rounded-xl border border-[#d2c5b3]/70 bg-white shadow-[0_1px_3px_rgba(28,25,23,0.04),0_6px_16px_rgba(28,25,23,0.02)]">
                    <div className="flex items-center justify-between border-b border-[#e9e1dd] bg-[#faf2ee] px-4 py-3">
                      <label className="flex min-w-0 items-center gap-2">
                        <input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => toggleSelected(lead.id)} className="h-4 w-4 shrink-0 accent-[#775610]" />
                        <span className="truncate font-mono text-xs font-semibold text-[#775610]">{shortId(lead.id)}</span>
                      </label>
                      <span className="ml-3 shrink-0 text-xs text-[#635d5c]">{dateFormatter.format(new Date(lead.createdAt))}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-serif text-2xl font-semibold leading-8">{lead.name || 'Name unavailable'}</h2>
                          <p className="mt-1 text-sm font-semibold text-[#775610]">{lead.intent || 'Not specified'}</p>
                        </div>
                        <span className="shrink-0 rounded bg-[#ffdea7]/45 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5e4200]">{statusLabel(lead.status)}</span>
                      </div>

                      {lead.context && <p className="mt-4 rounded border border-[#e9e1dd] bg-[#fff8f5] p-3 text-sm italic leading-6 text-[#4e4638]">{lead.context}</p>}

                      <div className="mt-4 grid gap-2 text-sm">
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#775610]" /> {formattedPhone(lead.mobile)}</p>
                        <p className="flex items-start gap-2 break-all text-[#635d5c]"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#775610]" /> {lead.email || 'Email not provided'}</p>
                        <p className="flex items-center gap-2 text-[#635d5c]"><Building2 className="h-4 w-4 text-[#775610]" /> {lead.projectName || 'Project not specified'}</p>
                      </div>

                      <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-[#e9e1dd] pt-4">
                        <button onClick={() => setDetailLead(lead)} className="inline-flex items-center justify-center gap-2 rounded bg-[#292524] px-4 py-2.5 text-sm font-semibold text-white"><Eye className="h-4 w-4" /> Details</button>
                        <button onClick={() => handleCopyPhone(lead)} className="rounded border border-[#d2c5b3] p-2.5 text-[#4e4638]" aria-label={`Copy phone for ${lead.name || lead.id}`}>{copiedId === lead.id ? <Check className="h-5 w-5 text-[#186a22]" /> : <Clipboard className="h-5 w-5" />}</button>
                        <button onClick={() => { setDeleteError(''); setDeleteTarget(lead); }} className="rounded border border-[#d2c5b3] p-2.5 text-[#635d5c]" aria-label={`Delete ${lead.name || lead.id}`}><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </section>

        {result && result.matchingCount > 0 && (
          <nav className="flex flex-col items-center justify-between gap-3 rounded-lg border border-[#d2c5b3]/65 bg-white px-4 py-3 sm:flex-row" aria-label="Enquiry pagination">
            <p className="text-xs text-[#635d5c]">
              Showing {(result.page - 1) * result.pageSize + 1}–{Math.min(result.page * result.pageSize, result.matchingCount)} of {result.matchingCount} matching enquiries
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={result.page <= 1 || isLoading} className="inline-flex items-center gap-1 rounded border border-[#d2c5b3] px-3 py-2 text-xs font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
              <span className="px-2 text-xs font-semibold">Page {result.page} of {result.pageCount}</span>
              <button onClick={() => setPage((current) => Math.min(result.pageCount, current + 1))} disabled={result.page >= result.pageCount || isLoading} className="inline-flex items-center gap-1 rounded border border-[#d2c5b3] px-3 py-2 text-xs font-semibold disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
            </div>
          </nav>
        )}
      </main>

      {detailLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1b19]/65 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailLead(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="lead-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e9e1dd] px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#775610]">Enquiry details</p>
                <h2 id="lead-detail-title" className="mt-1 font-serif text-2xl font-semibold">{detailLead.name || 'Name unavailable'}</h2>
              </div>
              <button onClick={() => setDetailLead(null)} className="rounded p-2 text-[#635d5c] hover:bg-[#f4ece8]" aria-label="Close lead details"><X className="h-5 w-5" /></button>
            </div>
            <dl className="px-5 py-3 sm:px-6">
              <DetailRow label="Enquiry ID" value={detailLead.id} />
              <DetailRow label="Submitted" value={dateFormatter.format(new Date(detailLead.createdAt))} />
              <DetailRow label="Name" value={detailLead.name} />
              <DetailRow label="Phone" value={formattedPhone(detailLead.mobile)} />
              <DetailRow label="Email" value={detailLead.email} />
              <DetailRow label="Project" value={detailLead.projectName} />
              <DetailRow label="Enquiry type" value={detailLead.intent} />
              <DetailRow label="Context" value={detailLead.context} />
              <DetailRow label="Status" value={statusLabel(detailLead.status)} />
              <DetailRow label="Source page" value={detailLead.source.pagePath} />
              <DetailRow label="Referrer host" value={detailLead.source.referrerHost} />
            </dl>
            <div className="flex flex-col gap-2 border-t border-[#e9e1dd] bg-[#faf2ee] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button onClick={() => handleCopyPhone(detailLead)} className="inline-flex items-center justify-center gap-2 rounded border border-[#d2c5b3] bg-white px-4 py-2.5 text-sm font-semibold"><Clipboard className="h-4 w-4" /> Copy phone</button>
              <button onClick={() => { setDeleteError(''); setDeleteTarget(detailLead); }} className="inline-flex items-center justify-center gap-2 rounded border border-[#ba1a1a]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#ba1a1a]"><Trash2 className="h-4 w-4" /> Delete lead</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1e1b19]/65 p-4 backdrop-blur-sm">
          <div role="alertdialog" aria-modal="true" aria-labelledby="delete-lead-title" aria-describedby="delete-lead-description" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#ba1a1a]"><Trash2 className="h-5 w-5" /></span>
            <h2 id="delete-lead-title" className="mt-4 font-serif text-2xl font-semibold">Delete {deleteTarget.name || 'this lead'}?</h2>
            <p id="delete-lead-description" className="mt-3 text-sm leading-6 text-[#635d5c]">This permanently removes enquiry <span className="font-mono font-semibold text-[#1e1b19]">{deleteTarget.id}</span> from Firestore. This action cannot be undone.</p>
            {deleteError && <p role="alert" className="mt-3 text-sm text-[#ba1a1a]">{deleteError}</p>}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => { if (!isDeleting) setDeleteTarget(null); }} disabled={isDeleting} className="rounded border border-[#d2c5b3] px-4 py-2.5 text-sm font-semibold disabled:opacity-50">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center justify-center gap-2 rounded bg-[#ba1a1a] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-[#807666]"><Trash2 className="h-4 w-4" /> {isDeleting ? 'Deleting…' : 'Delete permanently'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
