interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  accentColor?: 'blue' | 'green' | 'red' | 'amber';
}

const accentMap = {
  blue:  'bg-hisd-blue',
  green: 'bg-hisd-green',
  red:   'bg-hisd-red',
  amber: 'bg-hisd-amber',
};

export default function MetricCard({ label, value, sub, accentColor = 'blue' }: MetricCardProps) {
  return (
    <div className="metric-card">
      <p className="metric-card-label">{label}</p>
      <p className="metric-card-value">{value}</p>
      {sub && <p className="metric-card-sub">{sub}</p>}
      <div className={`metric-bar ${accentMap[accentColor]}`} />
    </div>
  );
}
