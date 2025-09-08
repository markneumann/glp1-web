const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Registration request received:', req.body);
  res.json({ message: 'Test registration endpoint working' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});