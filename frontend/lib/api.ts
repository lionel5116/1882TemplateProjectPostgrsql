const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface TimeEntry {
  id: number;
  employee_name: string;
  employee_id: string;
  campus_name: string;
  date_of_service: string;
  service_type: 'Direct' | 'Indirect' | 'On Demand';
  service_desc: string;
  start_time: string;
  end_time: string;
  total_time: number;
  total_cost: number;
  created_at: string;
}

export interface TimeEntryPayload {
  employee_name: string;
  employee_id: string;
  campus_name: string;
  date_of_service: string;
  service_type: string;
  service_desc: string;
  start_time: string;
  end_time: string;
}

export interface CampusSummary {
  campus_name: string;
  entry_count: number;
  total_hours: number;
  total_cost: number;
}

export interface ServiceTypeSummary {
  service_type: string;
  entry_count: number;
  total_hours: number;
  total_cost: number;
}

export interface DashboardSummary {
  totals: {
    total_entries: number;
    total_hours: number;
    total_cost: number;
  };
  by_campus: CampusSummary[];
  by_service_type: ServiceTypeSummary[];
  recent_entries: TimeEntry[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/dashboard-summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function fetchTimeEntries(): Promise<TimeEntry[]> {
  const res = await fetch(`${API_BASE}/time-entries`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch time entries');
  return res.json();
}

export async function createTimeEntry(payload: TimeEntryPayload): Promise<TimeEntry> {
  const res = await fetch(`${API_BASE}/time-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create time entry');
  return data;
}
