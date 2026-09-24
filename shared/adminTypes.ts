export type AdminDateRange = 'all' | 'today' | '7d' | '30d';
export type AdminSortOrder = 'newest' | 'oldest';

export interface AdminLead {
  id: string;
  createdAt: string;
  name: string;
  mobile: string;
  email: string | null;
  projectId: string;
  projectName: string;
  intent: string;
  context: string | null;
  status: string;
  source: {
    channel: string;
    pagePath: string;
    referrerHost: string | null;
  };
}

export interface AdminLeadFilters {
  search: string;
  dateRange: AdminDateRange;
  sort: AdminSortOrder;
}

export interface AdminLeadQuery extends AdminLeadFilters {
  page: number;
  pageSize: number;
}

export interface AdminLeadQueryResult {
  leads: AdminLead[];
  page: number;
  pageSize: number;
  pageCount: number;
  matchingCount: number;
  totalCount: number;
  todayCount: number;
}

export interface AdminSessionResult {
  authorized: true;
  email: string | null;
}
