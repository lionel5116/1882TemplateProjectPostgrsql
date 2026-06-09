const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function connectDB() {
  const client = await pool.connect();
  client.release();
  console.log('Connected to PostgreSQL');
}

function getPool() {
  return pool;
}

module.exports = { connectDB, getPool };
