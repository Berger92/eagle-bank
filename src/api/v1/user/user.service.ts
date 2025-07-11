import * as crypto from "node:crypto";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService, PasswordService } from "@common/services";
import { CreateUserDto } from "./dto/create-user.dto";

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

  async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
    const hashedPassword = await this.passwordService.hash(password);

    return this.prisma.user.findFirst({
      where: {
        username,
        password: hashedPassword,
      },
    });
  }

  async create(input: CreateUserDto): Promise<User> {
    const uuid = crypto.randomUUID();
    const externalId = `usr-${uuid}`;
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
}
