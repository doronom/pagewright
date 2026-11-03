import { faker } from '@faker-js/faker';
import { BaseFactory } from '@core/data/BaseFactory';

export interface Credentials {
  email: string;
  password: string;
}

/**
 * Credentials for a user that does not exist. Negative login tests use these instead of a wrong password for a
 * demo account: Toolshop locks an account after repeated failed logins, which would break it for everyone.
 */
export class UnknownUserFactory extends BaseFactory<Credentials> {
  protected defaults(): Credentials {
    return {
      email: faker.internet.email({ provider: 'example.test' }).toLowerCase(),
      password: faker.internet.password({ length: 16 }),
    };
  }
}
