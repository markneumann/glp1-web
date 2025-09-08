"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SideEffect_1 = __importDefault(require("../models/SideEffect"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.post('/', async (req, res) => {
    try {
        const { effectType, severity, date, notes } = req.body;
        if (!effectType || !severity || !date) {
            return res.status(400).json({ error: 'Effect type, severity, and date are required' });
        }
        const sideEffect = new SideEffect_1.default({
            userId: req.user._id,
            effectType,
            severity,
            date: new Date(date),
            notes
        });
        await sideEffect.save();
        res.status(201).json(sideEffect);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating side effect record' });
    }
});
router.get('/', async (req, res) => {
    try {
        const { effectType, startDate, endDate, limit = 100 } = req.query;
        let query = { userId: req.user._id };
        if (effectType) {
            query.effectType = effectType;
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const sideEffects = await SideEffect_1.default.find(query)
            .sort({ date: -1 })
            .limit(Number(limit));
        res.json(sideEffects);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching side effects' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const sideEffect = await SideEffect_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true });
        if (!sideEffect) {
            return res.status(404).json({ error: 'Side effect record not found' });
        }
        res.json(sideEffect);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating side effect record' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const sideEffect = await SideEffect_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!sideEffect) {
            return res.status(404).json({ error: 'Side effect record not found' });
        }
        res.json({ message: 'Side effect record deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting side effect record' });
    }
});
exports.default = router;
