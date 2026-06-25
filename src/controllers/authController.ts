import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';

const generateToken = (user_id: string, role: string): string =>
  jwt.sign({ user_id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) { res.status(400).json({ message: 'Email or username already exists' }); return; }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed, role: role || 'reader' });
    const token = generateToken(user._id.toString(), user.role);
    res.status(201).json({ token, user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) { res.status(401).json({ message: 'Invalid email or password' }); return; }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { res.status(401).json({ message: 'Invalid email or password' }); return; }
    const token = generateToken(user._id.toString(), user.role);
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.user_id).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(user);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { username, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user?.user_id, { username, bio }, { new: true }).select('-password');
    res.json(user);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};
