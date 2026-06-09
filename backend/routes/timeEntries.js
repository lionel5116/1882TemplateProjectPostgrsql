const { Router } = require('express');
const {
  createTimeEntry,
  getTimeEntries,
  getDashboardSummary,
} = require('../controllers/timeEntriesController');

const router = Router();

router.post('/time-entries',       createTimeEntry);
router.get('/time-entries',        getTimeEntries);
router.get('/dashboard-summary',   getDashboardSummary);

module.exports = router;
