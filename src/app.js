import express from 'express';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;
