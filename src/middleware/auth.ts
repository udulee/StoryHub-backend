import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

interface JwtPayload { user_id: string; role: string; }

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) { res.status(401).json({ message: 'No token, access denied' }); return; }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') { res.status(403).json({ message: 'Admin only' }); return; }
  next();
};

export const writerOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'writer' && req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Writer only' }); return;
  }
  next();
};
