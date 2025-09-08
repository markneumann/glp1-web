import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import Medication from '../models/Medication';
import HealthMetric from '../models/HealthMetric';
import SideEffect from '../models/SideEffect';

const router = express.Router();

router.use(authenticateToken);

router.get('/csv', async (req: AuthRequest, res) => {
  try {
    const [medications, healthMetrics, sideEffects] = await Promise.all([
      Medication.find({ userId: req.user._id }).sort({ date: -1 }),
      HealthMetric.find({ userId: req.user._id }).sort({ date: -1 }),
      SideEffect.find({ userId: req.user._id }).sort({ date: -1 })
    ]);

    let csv = 'Type,Date,Time,Medication,Dosage,Unit,Site,Metric Type,Value,Effect Type,Severity,Notes\n';

    medications.forEach(med => {
      csv += `Medication,${med.date.toISOString().split('T')[0]},${med.time},${med.medicationName},${med.dosage},${med.dosageUnit},${med.injectionSite},,,,,"${med.notes || ''}"\n`;
    });

    healthMetrics.forEach(metric => {
      csv += `Health Metric,${metric.date.toISOString().split('T')[0]},,,,,,${metric.metricType},${metric.value} ${metric.unit},,,"${metric.notes || ''}"\n`;
    });

    sideEffects.forEach(effect => {
      csv += `Side Effect,${effect.date.toISOString().split('T')[0]},,,,,,,,${effect.effectType},${effect.severity},"${effect.notes || ''}"\n`;
    });

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="glp1-data-${new Date().toISOString().split('T')[0]}.csv"`
    });

    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Error exporting data' });
  }
});

router.get('/json', async (req: AuthRequest, res) => {
  try {
    const [medications, healthMetrics, sideEffects] = await Promise.all([
      Medication.find({ userId: req.user._id }).sort({ date: -1 }),
      HealthMetric.find({ userId: req.user._id }).sort({ date: -1 }),
      SideEffect.find({ userId: req.user._id }).sort({ date: -1 })
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      userId: req.user._id,
      data: {
        medications,
        healthMetrics,
        sideEffects
      }
    };

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="glp1-data-${new Date().toISOString().split('T')[0]}.json"`
    });

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Error exporting data' });
  }
});

export default router;