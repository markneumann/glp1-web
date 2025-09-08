"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Medication_1 = __importDefault(require("../models/Medication"));
const HealthMetric_1 = __importDefault(require("../models/HealthMetric"));
const SideEffect_1 = __importDefault(require("../models/SideEffect"));
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/csv', async (req, res) => {
    try {
        const [medications, healthMetrics, sideEffects] = await Promise.all([
            Medication_1.default.find({ userId: req.user._id }).sort({ date: -1 }),
            HealthMetric_1.default.find({ userId: req.user._id }).sort({ date: -1 }),
            SideEffect_1.default.find({ userId: req.user._id }).sort({ date: -1 })
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error exporting data' });
    }
});
router.get('/json', async (req, res) => {
    try {
        const [medications, healthMetrics, sideEffects] = await Promise.all([
            Medication_1.default.find({ userId: req.user._id }).sort({ date: -1 }),
            HealthMetric_1.default.find({ userId: req.user._id }).sort({ date: -1 }),
            SideEffect_1.default.find({ userId: req.user._id }).sort({ date: -1 })
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error exporting data' });
    }
});
exports.default = router;
