import * as crypto from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PasswordService } from "@shared/services";
import { CreateUserRequest, UserResponse } from "./dto";
import { UserRepository } from "./user.repository";
import { formatExternalId } from "./utils";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(input: CreateUserRequest): Promise<UserResponse> {
    const uuid = crypto.randomUUID();
    const externalId = formatExternalId(uuid);
    const hashedPassword = await this.passwordService.hash(input.password);

    const user = await this.userRepository.create({
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

    return UserResponse.fromEntity(user);
  }

  async findByExternalId(externalId: string): Promise<UserResponse> {
    const user = await this.userRepository.findByExternalId(externalId);

    if (!user) {
      throw new NotFoundException();
    }

    return UserResponse.fromEntity(user);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }
}
