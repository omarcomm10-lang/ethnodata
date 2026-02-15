import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users.query';
import { UpdateUserDto } from './dto/update-user.dto';

export type ListUsersResponse = {
  total: number;
  skip: number;
  take: number;
  data: User[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: dto });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { id };
  }

  async findAll(query: ListUsersQueryDto): Promise<ListUsersResponse> {
    const skip = query.skip ?? 0;
    const take = query.take ?? 20;
    const search = query.search?.trim();

    const sortBy: 'createdAt' | 'email' | 'name' = query.sortBy ?? 'createdAt';
    const order: Prisma.SortOrder = query.order ?? 'desc';

    const where: Prisma.UserWhereInput =
      search && search.length > 0
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: order },
      }),
    ]);

    return { total, skip, take, data };
  }
}
