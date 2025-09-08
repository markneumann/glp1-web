import express from 'express';
import HealthMetric from '../models/HealthMetric';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { metricType, value, unit, date, notes } = req.body;

    if (!metricType || value === undefined || !unit || !date) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const healthMetric = new HealthMetric({
      userId: req.user._id,
      metricType,
      value,
      unit,
      date: new Date(date),
      notes
    });

    await healthMetric.save();
    res.status(201).json(healthMetric);
  } catch (error) {
    res.status(500).json({ error: 'Error creating health metric record' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { metricType, startDate, endDate, limit = 100 } = req.query;
    
    let query: any = { userId: req.user._id };
    
    if (metricType) {
      query.metricType = metricType;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const healthMetrics = await HealthMetric.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json(healthMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching health metrics' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const healthMetric = await HealthMetric.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!healthMetric) {
      return res.status(404).json({ error: 'Health metric record not found' });
    }

    res.json(healthMetric);
  } catch (error) {
    res.status(500).json({ error: 'Error updating health metric record' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const healthMetric = await HealthMetric.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!healthMetric) {
      return res.status(404).json({ error: 'Health metric record not found' });
    }

    res.json({ message: 'Health metric record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting health metric record' });
  }
});

export default router;