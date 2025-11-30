import { Router } from 'express';
import * as controller from '../controllers/employeeController.js';
import { createEmployeeValidator, updateEmployeeValidator } from '../validators/employeeValidator.js';
import { validate } from '../validators/validate.js';

const router = Router();

router.get('/employees', controller.list);
router.post('/employees', createEmployeeValidator, validate, controller.create);
router.get('/employees/:eid', controller.getById);
router.put('/employees/:eid', updateEmployeeValidator, validate, controller.update);
router.delete('/employees', controller.removeByQuery);

export default router;
