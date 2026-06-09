import Link from 'next/link';
import { fetchDashboardSummary } from '@/lib/api';
import MetricCard from '@/components/MetricCard';
import EntriesTable from '@/components/EntriesTable';
import CampusSummaryPanel from '@/components/CampusSummary';

export const revalidate = 0;

export default async function DashboardPage() {
  let summary;
  let error: string | null = null;

  try {
    summary = await fetchDashboardSummary();
  } catch {
    error = 'Could not connect to the API. Make sure the backend is running on port 4000.';
  }

  const totals = summary?.totals;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Time Tracking Dashboard</h1>
          <p className="text-sm text-hisd-blue mt-0.5">Innovation &amp; Development · 1882 Schools</p>
        </div>
        <Link href="/time-entry" className="btn-primary">
          + Log Time Entry
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total Hours Logged"
          value={totals ? `${Number(totals.total_hours || 0).toFixed(1)}` : '—'}
          sub="All time entries"
          accentColor="blue"
        />
        <MetricCard
          label="Total Amount to Bill HISD"
          value={totals ? `$${Number(totals.total_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          sub="Based on $50/hr rate"
          accentColor="green"
        />
        <MetricCard
          label="Total Entries"
          value={totals ? String(totals.total_entries ?? 0) : '—'}
          sub="Logged service records"
          accentColor="amber"
        />
        <MetricCard
          label="Campuses Served"
          value={summary ? String(summary.by_campus.length) : '—'}
          sub="Distinct 1882 schools"
          accentColor="red"
        />
      </div>

      {/* Campus & Service Type breakdown */}
      {summary && (
        <div className="mb-8">
          <CampusSummaryPanel
            byCampus={summary.by_campus}
            byServiceType={summary.by_service_type}
          />
        </div>
      )}

      {/* Recent entries table */}
      <div className="bg-white rounded-lg shadow-sm border border-hisd-gray-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hisd-gray-border">
          <h2 className="font-semibold text-gray-800">Recent Time Entries</h2>
          {summary && (
            <span className="text-xs text-gray-400">
              Showing {summary.recent_entries.length} of {totals?.total_entries ?? 0}
            </span>
          )}
        </div>
        <EntriesTable entries={summary?.recent_entries ?? []} />
      </div>
    </div>
  );
}
