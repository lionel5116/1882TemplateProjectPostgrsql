const { getPool } = require('../db/config');
const { calculateTotalTime, calculateTotalCost } = require('../helpers/timeCalculator');

const VALID_SERVICE_TYPES = ['Direct', 'Indirect', 'On Demand'];

async function createTimeEntry(req, res, next) {
  try {
    const {
      employee_name,
      employee_id,
      campus_name,
      date_of_service,
      service_type,
      service_desc,
      start_time,
      end_time,
    } = req.body;

    if (!employee_name || !employee_id || !campus_name || !date_of_service ||
        !service_type || !service_desc || !start_time || !end_time) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!VALID_SERVICE_TYPES.includes(service_type)) {
      return res.status(400).json({ error: `service_type must be one of: ${VALID_SERVICE_TYPES.join(', ')}.` });
    }

    const total_time = calculateTotalTime(start_time, end_time);
    const total_cost = calculateTotalCost(total_time);

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO time_entries
         (employee_name, employee_id, campus_name, date_of_service,
          service_type, service_desc, start_time, end_time, total_time, total_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        employee_name,
        employee_id,
        campus_name,
        date_of_service,
        service_type,
        service_desc,
        new Date(start_time),
        new Date(end_time),
        total_time,
        total_cost,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function getTimeEntries(req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM time_entries ORDER BY date_of_service DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getDashboardSummary(req, res, next) {
  try {
    const pool = getPool();

    const [totalsResult, byCampusResult, byServiceTypeResult, recentResult] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)        AS total_entries,
          SUM(total_time) AS total_hours,
          SUM(total_cost) AS total_cost
        FROM time_entries
      `),
      pool.query(`
        SELECT
          campus_name,
          COUNT(*)        AS entry_count,
          SUM(total_time) AS total_hours,
          SUM(total_cost) AS total_cost
        FROM time_entries
        GROUP BY campus_name
        ORDER BY total_cost DESC
      `),
      pool.query(`
        SELECT
          service_type,
          COUNT(*)        AS entry_count,
          SUM(total_time) AS total_hours,
          SUM(total_cost) AS total_cost
        FROM time_entries
        GROUP BY service_type
        ORDER BY total_cost DESC
      `),
      pool.query(`
        SELECT * FROM time_entries ORDER BY created_at DESC LIMIT 10
      `),
    ]);

    res.json({
      totals:          totalsResult.rows[0],
      by_campus:       byCampusResult.rows,
      by_service_type: byServiceTypeResult.rows,
      recent_entries:  recentResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTimeEntry, getTimeEntries, getDashboardSummary };
