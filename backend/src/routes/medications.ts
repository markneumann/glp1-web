import express from 'express';
import Medication from '../models/Medication';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { medicationName, dosage, dosageUnit, injectionSite, date, time, notes } = req.body;

    if (!medicationName || !dosage || !dosageUnit || !injectionSite || !date || !time) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const medication = new Medication({
      userId: req.user._id,
      medicationName,
      dosage,
      dosageUnit,
      injectionSite,
      date: new Date(date),
      time,
      notes
    });

    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Error creating medication record' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    
    let query: any = { userId: req.user._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const medications = await Medication.find(query)
      .sort({ date: -1, time: -1 })
      .limit(Number(limit));

    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching medications' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({ error: 'Medication record not found' });
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Error updating medication record' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!medication) {
      return res.status(404).json({ error: 'Medication record not found' });
    }

    res.json({ message: 'Medication record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting medication record' });
  }
});

export default router;