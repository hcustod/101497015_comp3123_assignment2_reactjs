// src/routes/employeeRoutes.js
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import * as controller from '../controllers/employeeController.js';
import {
  createEmployeeValidator,
  updateEmployeeValidator,
} from '../validators/employeeValidator.js';
import { validate } from '../validators/validate.js';

const router = Router();

// --- New: Multer setup --------------------------------------

// resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads folder: src/uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// --- Routes --------------------------------------------------

// GET /employees (list all)
router.get('/employees', controller.list);

// NEW: GET /employees/search?department=&position=
router.get('/employees/search', controller.search);

// POST /employees (with optional profile_picture)
router.post(
  '/employees',
  upload.single('profile_picture'),
  createEmployeeValidator,
  validate,
  controller.create
);

// GET /employees/:eid
router.get('/employees/:eid', controller.getById);

// PUT /employees/:eid (with optional profile_picture)
router.put(
  '/employees/:eid',
  upload.single('profile_picture'),
  updateEmployeeValidator,
  validate,
  controller.update
);

// DELETE /employees?eid=...
router.delete('/employees', controller.removeByQuery);

export default router;
