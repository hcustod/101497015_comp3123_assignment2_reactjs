import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const { Types } = mongoose;

export async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;

    let toCreate = { username, email, password };

    const user = await User.create(toCreate);

    return res.status(201).json({
      message: 'User created successfully.',
      user_id: user._id.toString(),
    });
  } catch (err) {
    // Duplicate email/username
    if (err && err.code === 11000) {
      return res.status(409).json({
        status: false,
        message: 'Username or email already exists',
        fields: Object.keys(err.keyPattern || {}),
      });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, username, password } = req.body;

    const query = email
      ? { email: email.toLowerCase() }
      : { username };

    const user = await User.findOne(query).lean(false);
    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid Username and password',
      });
    }

    let isMatch = false;
    isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: 'Invalid Username and password',
      });
    }

    // JWT token
    let payload = { message: 'Login successful.' };
    if (process.env.JWT_SECRET) {
      const token = jwt.sign(
        { sub: user._id.toString(), username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );
      payload.jwt_token = token;
    }

    return res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
}
