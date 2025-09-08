"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const medications_1 = __importDefault(require("./routes/medications"));
const health_metrics_1 = __importDefault(require("./routes/health-metrics"));
const side_effects_1 = __importDefault(require("./routes/side-effects"));
const export_1 = __importDefault(require("./routes/export"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
app.use((0, helmet_1.default)());
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glp1', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use('/api/auth', auth_1.default);
app.use('/api/medications', medications_1.default);
app.use('/api/health-metrics', health_metrics_1.default);
app.use('/api/side-effects', side_effects_1.default);
app.use('/api/export', export_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
