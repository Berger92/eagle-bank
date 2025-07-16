import { faker } from "@faker-js/faker";
import { CreateUserRequest } from "../../src/v1/modules/user/dto/create-user.dto";

export const makeUserDto = (overrides: Partial<CreateUserRequest> = {}): CreateUserRequest => {
  return {
    name: faker.person.fullName(),
    username: faker.internet.username().toLowerCase(),
    password: faker.internet.password({ length: 12, memorable: true }),
    email: faker.internet.email().toLowerCase(),
    phoneNumber: makePhoneNumber(),
    address: {
      line1: faker.location.streetAddress(),
      town: faker.location.city(),
      county: faker.location.state(),
      postcode: faker.location.zipCode(),
    },
    ...overrides,
  };
};

const makePhoneNumber = (): string => {
  const length = faker.number.int({ min: 9, max: 15 });
  const digits = faker.string.numeric({ length, allowLeadingZeros: false });
  return "+" + digits;
};
