import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

const { Types } = mongoose;

function toEmployeeDTO(doc) {
  if (!doc) return null;
  return {
    employee_id: doc._id.toString(),
    first_name: doc.first_name,
    last_name: doc.last_name,
    email: doc.email,
    position: doc.position,
    salary: doc.salary,
    date_of_joining: doc.date_of_joining,
    department: doc.department,
  };
}

export async function list(req, res, next) {
  try {
    const employees = await Employee.find({}).lean();
    const out = employees.map((e) => ({
      employee_id: e._id.toString(),
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email,
      position: e.position,
      salary: e.salary,
      date_of_joining: e.date_of_joining,
      department: e.department,
    }));
    return res.status(200).json(out);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
    } = req.body;

    const created = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining: new Date(date_of_joining),
      department,
    });

    return res.status(201).json({
      message: 'Employee created successfully.',
      employee_id: created._id.toString(),
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        status: false,
        message: 'Employee email already exists',
      });
    }
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const { eid } = req.params;
    if (!Types.ObjectId.isValid(eid)) {
      return res.status(400).json({ status: false, message: 'Invalid employee id' });
    }
    const emp = await Employee.findById(eid);
    if (!emp) {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }
    return res.status(200).json(toEmployeeDTO(emp));
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { eid } = req.params;
    if (!Types.ObjectId.isValid(eid)) {
      return res.status(400).json({ status: false, message: 'Invalid employee id' });
    }

    const updates = {};
    const allowed = [
      'first_name',
      'last_name',
      'email',
      'position',
      'salary',
      'date_of_joining',
      'department',
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = key === 'date_of_joining'
          ? new Date(req.body[key])
          : req.body[key];
      }
    }

    const result = await Employee.findByIdAndUpdate(eid, updates, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }

    return res.status(200).json({ message: 'Employee details updated successfully.' });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ status: false, message: 'Email already in use' });
    }
    next(err);
  }
}

export async function removeByQuery(req, res, next) {
  try {
    const { eid } = req.query;
    if (!eid) {
      return res.status(400).json({ status: false, message: 'Missing eid query param' });
    }
    if (!Types.ObjectId.isValid(eid)) {
      return res.status(400).json({ status: false, message: 'Invalid employee id' });
    }

    const del = await Employee.findByIdAndDelete(eid);
    if (!del) {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
