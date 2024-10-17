import { useInfiniteQuery } from '@tanstack/react-query';

import { Domain } from '@/store';

interface Todo {
  content: string;
  completed: boolean;
  id: number;
}

interface InfinityScrollData {
  todos: Todo[];
  lastId: number;
  size: number;
  hasNext: boolean;
}

const getCursorPaging = async (size = '10', cursorId = '0', domain: Domain) => {
  const params = new URLSearchParams({ size, cursorId }).toString();

  return await fetch(`${domain}/cursor?${params}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => data as InfinityScrollData);
};

export const useGetCursorPagingAPI = (domain: Domain) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery({
      queryKey: ['cursor-paging', domain],
      queryFn: ({ pageParam }) =>
        getCursorPaging('10', pageParam.toString(), domain),
      initialPageParam: 0,
      getNextPageParam: ({ hasNext, lastId }) => (hasNext ? lastId : undefined),
    });

  return {
    todos: data?.pages.map(({ todos }) => todos).flat(),
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
  };
};
