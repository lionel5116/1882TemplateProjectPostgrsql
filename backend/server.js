require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/config');
const timeEntriesRouter = require('./routes/timeEntries');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', timeEntriesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});
