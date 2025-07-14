import * as crypto from "node:crypto";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService, PasswordService } from "@shared/services";
import { CreateUserRequest } from "./dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async findByExternalId(externalId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { externalId },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }

  async create(input: CreateUserRequest): Promise<User> {
    const uuid = crypto.randomUUID();
    const externalId = this.formatExternalId(uuid);
    const hashedPassword = await this.passwordService.hash(input.password);

    return this.prisma.user.create({
      data: {
        id: uuid,
        externalId,
        name: input.name,
        username: input.username,
        password: hashedPassword,
        addressLine1: input.address.line1,
        addressLine2: input.address.line2,
        addressLine3: input.address.line3,
        town: input.address.town,
        county: input.address.county,
        postcode: input.address.postcode,
        phoneNumber: input.phoneNumber,
        email: input.email,
      },
    });
  }

  formatExternalId(internalId: string): string {
    return `usr-${internalId}`;
  }

  parseInternalId(externalId: string): string {
    if (!externalId.startsWith("usr-")) {
      throw new Error(`Invalid external user ID: ${externalId}`);
    }

    return externalId.slice(4);
  }
}
