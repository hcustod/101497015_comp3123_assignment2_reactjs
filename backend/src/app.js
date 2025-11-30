// backend/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

const app = express();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS: allow React dev client
app.use(
  cors({
    origin: 'http://localhost:3000', // React dev URL
    credentials: true,
  })
);

// JSON body parsing (still needed for non-multipart routes)
app.use(express.json());

// Serve uploaded files (profile pictures) statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
