'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createTimeEntry, type TimeEntryPayload } from '@/lib/api';

const SERVICE_TYPES = ['Direct', 'Indirect', 'On Demand'] as const;
const MIN_MINUTES = 30;

function validateClientSide(start: string, end: string): string | null {
  if (!start || !end) return null;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  if (diffMs <= 0) return 'End time must be after start time.';
  if (diffMs / 60000 < MIN_MINUTES) return `Minimum duration is ${MIN_MINUTES} minutes.`;
  return null;
}

const EMPTY: TimeEntryPayload = {
  employee_name: '',
  employee_id: '',
  campus_name: '',
  date_of_service: '',
  service_type: '',
  service_desc: '',
  start_time: '',
  end_time: '',
};

export default function TimeEntryForm() {
  const router = useRouter();
  const [form, setForm] = useState<TimeEntryPayload>(EMPTY);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'start_time' || name === 'end_time') {
      const start = name === 'start_time' ? value : form.start_time;
      const end   = name === 'end_time'   ? value : form.end_time;
      setTimeError(validateClientSide(start, end));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clientErr = validateClientSide(form.start_time, form.end_time);
    if (clientErr) { setTimeError(clientErr); return; }

    setLoading(true);
    setSubmitError(null);

    try {
      await createTimeEntry(form);
      setSuccess(true);
      setForm(EMPTY);
      setTimeout(() => router.push('/'), 1500);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-hisd-gray-border p-6 max-w-3xl">

      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 text-sm">
          Time entry saved successfully! Redirecting to dashboard…
        </div>
      )}

      {submitError && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Employee Name */}
        <div>
          <label className="form-label">Employee Name <span className="text-red-500">*</span></label>
          <input
            type="text" name="employee_name" value={form.employee_name}
            onChange={handleChange} required className="form-input"
            placeholder="Jane Doe"
          />
        </div>

        {/* Employee ID */}
        <div>
          <label className="form-label">Employee ID <span className="text-red-500">*</span></label>
          <input
            type="text" name="employee_id" value={form.employee_id}
            onChange={handleChange} required className="form-input"
            placeholder="EMP-12345"
          />
        </div>

        {/* Campus Name */}
        <div>
          <label className="form-label">Campus Name <span className="text-red-500">*</span></label>
          <input
            type="text" name="campus_name" value={form.campus_name}
            onChange={handleChange} required className="form-input"
            placeholder="Reagan High School"
          />
        </div>

        {/* Date of Service */}
        <div>
          <label className="form-label">Date of Service <span className="text-red-500">*</span></label>
          <input
            type="date" name="date_of_service" value={form.date_of_service}
            onChange={handleChange} required className="form-input"
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="form-label">Service Type <span className="text-red-500">*</span></label>
          <select
            name="service_type" value={form.service_type}
            onChange={handleChange} required className="form-input"
          >
            <option value="" disabled>Select type…</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="form-label">Start Time <span className="text-red-500">*</span></label>
          <input
            type="datetime-local" name="start_time" value={form.start_time}
            onChange={handleChange} required className="form-input"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="form-label">End Time <span className="text-red-500">*</span></label>
          <input
            type="datetime-local" name="end_time" value={form.end_time}
            onChange={handleChange} required className="form-input"
          />
          {timeError && <p className="text-red-500 text-xs mt-1">{timeError}</p>}
          {!timeError && form.start_time && form.end_time && (
            <p className="text-gray-400 text-xs mt-1">
              Duration rounds up to the nearest 30-minute increment.
            </p>
          )}
        </div>

        {/* Service Description — full width */}
        <div className="sm:col-span-2">
          <label className="form-label">Service Description <span className="text-red-500">*</span></label>
          <textarea
            name="service_desc" value={form.service_desc}
            onChange={handleChange} required rows={4} className="form-input resize-none"
            placeholder="Describe the services provided…"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading || !!timeError}
          className="btn-primary"
        >
          {loading ? 'Saving…' : 'Save Time Entry'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
