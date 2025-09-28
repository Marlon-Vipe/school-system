import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { User, UserRole, UserStatus } from './user.entity';
import { AppError } from '../../utils/appError';
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../types/common';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(userData: Partial<User>): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email! },
    });

    if (existingUser) {
      throw AppError.conflict('A user with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      ...userData,
      status: UserStatus.ACTIVE,
    });

    return await this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw AppError.unauthorized('Account is not active');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    // Generate JWT token
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret as string, {
      expiresIn: config.jwt.expiresIn as string,
    } as jwt.SignOptions);

    return { user, token };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    // Update user
    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw AppError.unauthorized('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw AppError.unauthorized('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw AppError.unauthorized('Token has expired');
      }
      throw AppError.unauthorized('Token verification failed');
    }
  }

  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw AppError.unauthorized('Account is not active');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret as string, {
      expiresIn: config.jwt.expiresIn as string,
    } as jwt.SignOptions);

    return { token };
  }
}



