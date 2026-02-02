import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  QueryKey,
  QueryObserverResult,
} from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// Định nghĩa lại type để loại bỏ các thuộc tính không cần thiết
type PickedQueryOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

interface UseOfflineQueryOptions<TData, TError> extends PickedQueryOptions<TData, TError> {
  offlineData?: TData;
}

interface UseOfflineQueryResult<TData, TError>
  extends Omit<QueryObserverResult<TData, TError>, 'refetch'> {
  isOffline: boolean;
  isRefreshing: boolean;
  refetch: () => Promise<QueryObserverResult<TData, TError>>;
  refresh: () => Promise<QueryObserverResult<TData, TError>>;
}

/**
 * Enhanced useQuery hook that supports offline mode.
 * This hook will use cached data when offline, and will fetch fresh data when online.
 * Also supports pull-to-refresh functionality.
 *
 * @param queryKey - The query key for React Query
 * @param queryFn - The query function to fetch data
 * @param options - Standard React Query options with additional offlineData option
 * @returns The query result with isOffline flag and refresh function
 */
export function useOfflineQuery<TData, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: UseOfflineQueryOptions<TData, TError>
): UseOfflineQueryResult<TData, TError> {
  const queryClient = useQueryClient();
  const [isOffline, setIsOffline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOffline(!state.isConnected);

      // If we're back online, refetch data
      if (state.isConnected) {
        queryClient.invalidateQueries({ queryKey });
      }
    });

    return () => unsubscribe();
  }, [queryKey, queryClient]);

  // Use React Query with modified options for offline support
  const result = useQuery<TData, TError>({
    queryKey,
    queryFn,
    // Don't try to fetch if we're offline (use cached data)
    enabled: options?.enabled !== false && !isOffline,
    // Retry more times in case of flaky network
    retry: options?.retry ?? 3,
    // Keep the data fresh for 5 minutes (default)
    staleTime: options?.staleTime ?? 1000 * 60 * 5,
    // Keep the data for 24 hours in the cache (default)
    gcTime: options?.gcTime ?? 1000 * 60 * 60 * 24,
    // Other options
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchOnReconnect: options?.refetchOnReconnect ?? true,
    ...options,
  });

  // Refresh function for pull-to-refresh
  const refresh = useCallback(async () => {
    if (isOffline) {
      return Promise.resolve(result);
    }

    setIsRefreshing(true);
    try {
      // Xóa cache và fetch lại data từ server
      await queryClient.resetQueries({ queryKey, exact: true });
      return await result.refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [isOffline, queryClient, queryKey, result]);

  return {
    ...result,
    isOffline,
    isRefreshing,
    refresh,
    // If we're offline and the query failed, use the provided offline data
    data: result.data ?? (isOffline ? options?.offlineData : undefined),
  };
}
