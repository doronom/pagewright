import { faker } from '@faker-js/faker';
import { BaseFactory } from '@core/data/BaseFactory';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export class UserFactory extends BaseFactory<User> {
  protected defaults(): User {
    return {
      id: faker.number.int({ min: 1, max: 10 }),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
    };
  }
}
