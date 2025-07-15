import { Injectable } from "@nestjs/common";
import { User, Prisma } from "@prisma/client";
import { PrismaService } from "@shared/services";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByExternalId(externalId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { externalId } });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  create(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: userData });
  }
}
