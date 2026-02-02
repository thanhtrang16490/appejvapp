import React from 'react';
import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

interface PullToRefreshViewProps extends Omit<ScrollViewProps, 'refreshControl'> {
  isRefreshing: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyText?: string;
  errorText?: string;
  refreshText?: string;
  onRefresh: () => Promise<any>;
  showEmptyComponent?: boolean;
  showRefreshingIndicator?: boolean;
}

/**
 * Component ScrollView hỗ trợ Pull-to-refresh và hiển thị trạng thái loading, error, và empty
 */
export function PullToRefreshView({
  isRefreshing,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyText = 'Không có dữ liệu',
  errorText,
  refreshText = 'Đang làm mới dữ liệu...',
  onRefresh,
  showEmptyComponent = true,
  showRefreshingIndicator = true,
  children,
  ...scrollViewProps
}: PullToRefreshViewProps) {
  // Render khi không có dữ liệu và showEmptyComponent = true
  const renderEmptyComponent = () => {
    if (!showEmptyComponent) return null;

    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={styles.messageText}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {errorText || error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'}
          </Text>
        </View>
      );
    }

    if (isEmpty) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.messageText}>{emptyText}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        {...scrollViewProps}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.secondary]}
            tintColor={Colors.secondary}
            title={Platform.OS === 'ios' ? refreshText : undefined}
          />
        }
      >
        {renderEmptyComponent() || children}
      </ScrollView>

      {/* Thông báo làm mới ở giữa màn hình (chỉ hiển thị khi isRefreshing=true và showRefreshingIndicator=true) */}
      {isRefreshing && showRefreshingIndicator && (
        <View style={styles.refreshingOverlay}>
          <BlurView intensity={50} style={styles.refreshingBlur} tint="light">
            <View style={styles.refreshingContainer}>
              <ActivityIndicator size="large" color={Colors.secondary} />
              <Text style={styles.refreshingText}>{refreshText}</Text>
            </View>
          </BlurView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 300,
  },
  messageText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.gray[700],
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
  refreshingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -80 }, { translateY: -40 }],
    width: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  refreshingBlur: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshingText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.gray[800],
    textAlign: 'center',
  },
});
