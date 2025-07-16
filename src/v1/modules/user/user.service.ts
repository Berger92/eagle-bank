import * as crypto from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PasswordService } from "@shared/services";
import { CreateUserRequest } from "./dto";
import { UserRepository } from "./user.repository";
import { UserMapper } from "./user.mapper";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
    private readonly passwordService: PasswordService,
  ) {}

  async create(input: CreateUserRequest): Promise<User> {
    const uuid = crypto.randomUUID();
    const externalId = this.userMapper.formatExternalId(uuid);
    const hashedPassword = await this.passwordService.hash(input.password);

    return this.userRepository.create({
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
    });
  }

  async findByExternalId(externalId: string): Promise<User> {
    const user = await this.userRepository.findByExternalId(externalId);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }
}
