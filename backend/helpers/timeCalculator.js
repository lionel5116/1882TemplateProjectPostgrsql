const HOURLY_RATE = parseFloat(process.env.HOURLY_RATE) || 50;
const MIN_INCREMENT_MINUTES = 30;

/**
 * Calculates total hours from start/end times, enforcing a 30-minute minimum increment.
 * Raw duration is rounded UP to the nearest 30-minute block.
 * Throws if end is not after start.
 */
function calculateTotalTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start) || isNaN(end)) {
    throw Object.assign(new Error('Invalid start or end time.'), { status: 400 });
  }

  const diffMs = end - start;

  if (diffMs <= 0) {
    throw Object.assign(new Error('End time must be after start time.'), { status: 400 });
  }

  const diffMinutes = diffMs / (1000 * 60);

  if (diffMinutes < MIN_INCREMENT_MINUTES) {
    throw Object.assign(
      new Error(`Minimum time entry is ${MIN_INCREMENT_MINUTES} minutes. Recorded duration was ${Math.round(diffMinutes)} minute(s).`),
      { status: 400 }
    );
  }

  // Round up to the nearest 30-minute block and convert to hours
  const roundedMinutes = Math.ceil(diffMinutes / MIN_INCREMENT_MINUTES) * MIN_INCREMENT_MINUTES;
  return parseFloat((roundedMinutes / 60).toFixed(2));
}

function calculateTotalCost(totalTimeHours) {
  return parseFloat((totalTimeHours * HOURLY_RATE).toFixed(2));
}

module.exports = { calculateTotalTime, calculateTotalCost, HOURLY_RATE };
