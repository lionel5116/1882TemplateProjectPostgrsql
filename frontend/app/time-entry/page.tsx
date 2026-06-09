import TimeEntryForm from '@/components/TimeEntryForm';

export const metadata = {
  title: 'Log Time Entry | HISD 1882 Cost Tracking',
};

export default function TimeEntryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Log Time Entry</h1>
        <p className="text-sm text-hisd-blue mt-0.5">
          Record employee service hours for a 1882 school campus.
        </p>
      </div>

      <div className="bg-hisd-blue-light border border-blue-100 rounded-md px-4 py-3 text-sm text-hisd-navy mb-6 max-w-3xl">
        <strong>Billing Rule:</strong> Time is recorded in 30-minute increments. Durations under 30 minutes
        are not allowed; durations are rounded up to the nearest 30-minute block.
        Rate: <strong>$50.00 / hr</strong>
      </div>

      <TimeEntryForm />
    </div>
  );
}
