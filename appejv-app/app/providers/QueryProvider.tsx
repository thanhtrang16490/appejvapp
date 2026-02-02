import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
          gcTime: 1000 * 60 * 60, // Cache is kept for 60 minutes (increased from 30)
          retry: 2, // Retry failed requests 2 times
          refetchOnWindowFocus: false, // Don't refetch when window regains focus
          refetchOnReconnect: 'always', // Always refetch when reconnecting
        },
      },
    });

    // Create a persister for AsyncStorage
    const asyncStoragePersister = createAsyncStoragePersister({
      storage: AsyncStorage,
      key: 'REACT_QUERY_OFFLINE_CACHE',
      throttleTime: 1000, // Throttle persisting to avoid excessive storage writes
      serialize: (data: unknown) => JSON.stringify(data),
      deserialize: (data: string) => JSON.parse(data),
    });

    // Set up persistence of query cache
    persistQueryClient({
      queryClient: client,
      persister: asyncStoragePersister,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      buster: 'v1', // Cache version
      dehydrateOptions: {
        shouldDehydrateQuery: (query: any) => {
          // Only persist queries that were successful
          return query.state.status === 'success';
        },
      },
    });

    return client;
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
