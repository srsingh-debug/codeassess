import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

const generateAccessToken = (userId: string, email: string, role: string) => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};


const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { message: 'User already exists', code: 'USER_EXISTS' },
        });
      }

      // Create user
      const user = await User.create({
        email,
        password,
        name,
        role: role || 'candidate',
      });

      // Generate tokens
      const accessToken = generateAccessToken(user._id.toString(), user.email, user.role);
      const refreshToken = generateRefreshToken(user._id.toString());

      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      await RefreshToken.create({
        userId: user._id.toString(),
        token: refreshToken,
        expiresAt,
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
console.log("email", email, "password", password);
      // Find user with password
      const user = await User.findOne({ email }).select('+password');
      console.log(user);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: { message: 'Account is deactivated', code: 'ACCOUNT_DEACTIVATED' },
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken(user._id.toString(), user.email, user.role);
      const refreshToken = generateRefreshToken(user._id.toString());

      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      await RefreshToken.create({
        userId: user._id.toString(),
        token: refreshToken,
        expiresAt,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: { message: 'Refresh token is required', code: 'TOKEN_REQUIRED' },
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };

      // Check if refresh token exists and is not revoked
      const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        userId: decoded.userId,
        isRevoked: false,
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid or expired refresh token', code: 'INVALID_TOKEN' },
        });
      }

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found', code: 'USER_NOT_FOUND' },
        });
      }

      // Generate new access token
      const accessToken = generateAccessToken(user._id.toString(), user.email, user.role);

      res.json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Revoke refresh token
        await RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true });
      }

      res.json({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify token (for inter-service communication)
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', code: 'TOKEN_REQUIRED' },
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid token', code: 'INVALID_TOKEN' },
        });
      }

      res.json({
        success: true,
        data: {
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid token', code: 'INVALID_TOKEN' },
      });
    }
  }

  // Get current user
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found', code: 'USER_NOT_FOUND' },
        });
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

