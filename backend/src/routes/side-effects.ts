import express from 'express';
import SideEffect from '../models/SideEffect';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { effectType, severity, date, notes } = req.body;

    if (!effectType || !severity || !date) {
      return res.status(400).json({ error: 'Effect type, severity, and date are required' });
    }

    const sideEffect = new SideEffect({
      userId: req.user._id,
      effectType,
      severity,
      date: new Date(date),
      notes
    });

    await sideEffect.save();
    res.status(201).json(sideEffect);
  } catch (error) {
    res.status(500).json({ error: 'Error creating side effect record' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { effectType, startDate, endDate, limit = 100 } = req.query;
    
    let query: any = { userId: req.user._id };
    
    if (effectType) {
      query.effectType = effectType;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const sideEffects = await SideEffect.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json(sideEffects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching side effects' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const sideEffect = await SideEffect.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!sideEffect) {
      return res.status(404).json({ error: 'Side effect record not found' });
    }

    res.json(sideEffect);
  } catch (error) {
    res.status(500).json({ error: 'Error updating side effect record' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const sideEffect = await SideEffect.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!sideEffect) {
      return res.status(404).json({ error: 'Side effect record not found' });
    }

    res.json({ message: 'Side effect record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting side effect record' });
  }
});

export default router;