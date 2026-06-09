import type { CampusSummary, ServiceTypeSummary } from '@/lib/api';

interface Props {
  byCampus: CampusSummary[];
  byServiceType: ServiceTypeSummary[];
}

const SERVICE_COLORS: Record<string, string> = {
  Direct:     'bg-hisd-blue',
  Indirect:   'bg-purple-500',
  'On Demand':'bg-amber-500',
};

export default function CampusSummaryPanel({ byCampus, byServiceType }: Props) {
  const maxCost = Math.max(...byCampus.map((c) => Number(c.total_cost)), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* By Campus */}
      <div className="bg-white rounded-lg shadow-sm border border-hisd-gray-border p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Hours &amp; Cost by Campus
        </h3>
        {byCampus.length === 0 ? (
          <p className="text-sm text-gray-400">No data yet.</p>
        ) : (
          <ul className="space-y-3">
            {byCampus.map((campus) => (
              <li key={campus.campus_name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 truncate">{campus.campus_name}</span>
                  <span className="text-hisd-navy font-semibold ml-2 shrink-0">
                    ${Number(campus.total_cost).toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-hisd-gray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-hisd-blue rounded-full transition-all duration-500"
                    style={{ width: `${(Number(campus.total_cost) / maxCost) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {Number(campus.total_hours).toFixed(1)} hrs &middot; {campus.entry_count} entries
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* By Service Type */}
      <div className="bg-white rounded-lg shadow-sm border border-hisd-gray-border p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Breakdown by Service Type
        </h3>
        {byServiceType.length === 0 ? (
          <p className="text-sm text-gray-400">No data yet.</p>
        ) : (
          <ul className="space-y-4">
            {byServiceType.map((st) => (
              <li key={st.service_type} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${SERVICE_COLORS[st.service_type] ?? 'bg-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{st.service_type}</span>
                    <span className="text-hisd-navy font-semibold">${Number(st.total_cost).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {Number(st.total_hours).toFixed(1)} hrs &middot; {st.entry_count} entries
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
