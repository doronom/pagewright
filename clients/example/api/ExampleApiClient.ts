import { ApiResponse, BaseApiClient } from '@core/api/BaseApiClient';

export interface Post {
  id?: number;
  userId: number;
  title: string;
  body: string;
}

export class ExampleApiClient extends BaseApiClient {
  getPost(id: number): Promise<ApiResponse<Post>> {
    return this.get<Post>(`/posts/${id}`, { withStatus: true });
  }

  createPost(post: Post): Promise<ApiResponse<Post>> {
    return this.post<Post>('/posts', post, { withStatus: true });
  }
}
