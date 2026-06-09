import type { TimeEntry } from '@/lib/api';

const SERVICE_TYPE_COLORS: Record<string, string> = {
  Direct:     'bg-hisd-blue-light text-hisd-blue',
  Indirect:   'bg-purple-50 text-purple-700',
  'On Demand':'bg-amber-50 text-amber-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(n: number) {
  return `$${Number(n).toFixed(2)}`;
}

interface Props {
  entries: TimeEntry[];
}

export default function EntriesTable({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12 text-sm">
        No time entries recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Employee', 'Campus', 'Date', 'Service Type', 'Hours', 'Cost'].map((h) => (
              <th key={h} className="table-th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-hisd-gray/50 transition-colors">
              <td className="table-td">
                <div className="font-medium text-gray-800">{entry.employee_name}</div>
                <div className="text-xs text-gray-400">{entry.employee_id}</div>
              </td>
              <td className="table-td">{entry.campus_name}</td>
              <td className="table-td">{formatDate(entry.date_of_service)}</td>
              <td className="table-td">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${SERVICE_TYPE_COLORS[entry.service_type] ?? 'bg-gray-100 text-gray-600'}`}>
                  {entry.service_type}
                </span>
              </td>
              <td className="table-td font-medium">{Number(entry.total_time).toFixed(1)} hrs</td>
              <td className="table-td font-semibold text-hisd-navy">{formatCurrency(entry.total_cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
