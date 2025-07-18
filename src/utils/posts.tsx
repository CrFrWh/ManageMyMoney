import { queryOptions } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import axios from 'redaxios';

export type PostType = {
  id: string;
  title: string;
  body: string;
};

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const response = await axios.get<PostType[]>(
      'https://jsonplaceholder.typicode.com/posts'
    );
    return response.data.slice(0, 10);
  }
);

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    const post = await axios
      .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => r.data)
      .catch((err) => {
        if (err.status === 404) {
          throw notFound();
        }
        throw err;
      });

    return post;
  });

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: () => fetchPost({ data: postId }),
  });
