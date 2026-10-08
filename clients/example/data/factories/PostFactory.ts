import { faker } from '@faker-js/faker';
import { BaseFactory } from '@core/data/BaseFactory';
import { Post } from '../../api/ExampleApiClient';
import { UserFactory } from './UserFactory';

export class PostFactory extends BaseFactory<Post> {
  protected defaults(): Post {
    return {
      userId: new UserFactory().build().id,
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
    };
  }
}
