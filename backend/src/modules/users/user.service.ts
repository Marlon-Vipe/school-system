import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { User, UserRole, UserStatus } from '../auth/user.entity';
import { PaginationQuery, PaginationResult } from '../../types/common';
import { AppError } from '../../utils/appError';

export class UserService {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async getUsers(pagination: PaginationQuery): Promise<PaginationResult<User>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;

    const queryBuilder = this.repository.createQueryBuilder('user');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    // Check if email already exists
    const existingUser = await this.repository.findOne({
      where: { email: userData.email! },
    });
    
    if (existingUser) {
      throw AppError.conflict('A user with this email already exists');
    }

    // Set default values
    if (!userData.role) {
      userData.role = UserRole.STUDENT;
    }
    if (!userData.status) {
      userData.status = UserStatus.ACTIVE;
    }

    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    // Check if user exists
    const existingUser = await this.repository.findOne({ where: { id } });
    if (!existingUser) {
      throw AppError.notFound('User not found');
    }

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await this.repository.findOne({
        where: { email: updateData.email },
      });
      if (emailExists) {
        throw AppError.conflict('A user with this email already exists');
      }
    }

    await this.repository.update(id, updateData);
    return await this.getUserById(id);
  }

  async deleteUser(id: string, softDelete: boolean = true): Promise<void> {
    const existingUser = await this.repository.findOne({ where: { id } });
    if (!existingUser) {
      throw AppError.notFound('User not found');
    }

    if (softDelete) {
      await this.repository.update(id, { status: UserStatus.INACTIVE });
    } else {
      await this.repository.delete(id);
    }
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: { [key in UserRole]: number };
  }> {
    const [total, active, inactive] = await Promise.all([
      this.repository.count(),
      this.repository.count({ where: { status: UserStatus.ACTIVE } }),
      this.repository.count({ where: { status: UserStatus.INACTIVE } }),
    ]);

    const byRole = {
      [UserRole.ADMIN]: await this.repository.count({ where: { role: UserRole.ADMIN } }),
      [UserRole.TEACHER]: await this.repository.count({ where: { role: UserRole.TEACHER } }),
      [UserRole.STUDENT]: await this.repository.count({ where: { role: UserRole.STUDENT } }),
      [UserRole.STAFF]: await this.repository.count({ where: { role: UserRole.STAFF } }),
    };

    return { total, active, inactive, byRole };
  }
}



