import { useInfiniteQuery } from '@tanstack/react-query';

import { Domain } from '@/store';

interface Todo {
  content: string;
  completed: boolean;
  id: number;
}

interface InfinityScrollData {
  todos: Todo[];
  currentPageNumber: number;
  size: number;
  hasNext: boolean;
}

const getOffsetPaging = async (size = '10', page: string, domain: Domain) => {
  const params = new URLSearchParams({ size, page }).toString();

  return await fetch(`${domain}/offset?${params}`, {
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

export const useGetOffsetPagingAPI = (domain: Domain) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery({
      queryKey: ['offset-paging', domain],
      queryFn: ({ pageParam }) =>
        getOffsetPaging('10', pageParam.toString(), domain),
      initialPageParam: 0,
      getNextPageParam: ({ hasNext, currentPageNumber }) =>
        hasNext ? currentPageNumber + 1 : undefined,
    });

  return {
    todos: data?.pages.map(({ todos }) => todos).flat(),
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
  };
};
