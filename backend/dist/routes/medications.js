"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Medication_1 = __importDefault(require("../models/Medication"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.post('/', async (req, res) => {
    try {
        const { medicationName, dosage, dosageUnit, injectionSite, date, time, notes } = req.body;
        if (!medicationName || !dosage || !dosageUnit || !injectionSite || !date || !time) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        const medication = new Medication_1.default({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating medication record' });
    }
});
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, limit = 50 } = req.query;
        let query = { userId: req.user._id };
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const medications = await Medication_1.default.find(query)
            .sort({ date: -1, time: -1 })
            .limit(Number(limit));
        res.json(medications);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching medications' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const medication = await Medication_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true });
        if (!medication) {
            return res.status(404).json({ error: 'Medication record not found' });
        }
        res.json(medication);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating medication record' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const medication = await Medication_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!medication) {
            return res.status(404).json({ error: 'Medication record not found' });
        }
        res.json({ message: 'Medication record deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting medication record' });
    }
});
exports.default = router;
