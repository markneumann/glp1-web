"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HealthMetric_1 = __importDefault(require("../models/HealthMetric"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.post('/', async (req, res) => {
    try {
        const { metricType, value, unit, date, notes } = req.body;
        if (!metricType || value === undefined || !unit || !date) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        const healthMetric = new HealthMetric_1.default({
            userId: req.user._id,
            metricType,
            value,
            unit,
            date: new Date(date),
            notes
        });
        await healthMetric.save();
        res.status(201).json(healthMetric);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating health metric record' });
    }
});
router.get('/', async (req, res) => {
    try {
        const { metricType, startDate, endDate, limit = 100 } = req.query;
        let query = { userId: req.user._id };
        if (metricType) {
            query.metricType = metricType;
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const healthMetrics = await HealthMetric_1.default.find(query)
            .sort({ date: -1 })
            .limit(Number(limit));
        res.json(healthMetrics);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching health metrics' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const healthMetric = await HealthMetric_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true });
        if (!healthMetric) {
            return res.status(404).json({ error: 'Health metric record not found' });
        }
        res.json(healthMetric);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating health metric record' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const healthMetric = await HealthMetric_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!healthMetric) {
            return res.status(404).json({ error: 'Health metric record not found' });
        }
        res.json({ message: 'Health metric record deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting health metric record' });
    }
});
exports.default = router;
