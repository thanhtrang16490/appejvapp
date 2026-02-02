import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSectors } from '../hooks/useSector';
import { PullToRefreshList } from './PullToRefreshList';
import { Sector } from '../models/sector';
import { Colors } from '../constants/Colors';

interface SectorWithCombos extends Sector {
  combos?: Array<{ id: number; name: string }>;
}

export function SectorsList() {
  const { data: sectors, isLoading, isError, error, isRefreshing, refresh } = useSectors();

  const renderSectorItem = ({ item }: { item: SectorWithCombos }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description || 'Không có mô tả'}
      </Text>
      <View style={styles.comboCount}>
        <Text style={styles.comboCountText}>{item.combos?.length || 0} gói</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <PullToRefreshList
        data={sectors}
        keyExtractor={item => item.id.toString()}
        renderItem={renderSectorItem}
        contentContainerStyle={styles.listContent}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        isEmpty={sectors?.length === 0}
        onRefresh={refresh}
        emptyText="Không có dữ liệu lĩnh vực. Kéo xuống để tải lại."
        errorText="Không thể tải dữ liệu lĩnh vực. Kéo xuống để thử lại."
        refreshText="Đang làm mới danh sách lĩnh vực..."
        showRefreshingIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.gray[800],
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 8,
  },
  comboCount: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comboCountText: {
    fontSize: 12,
    color: Colors.primary,
  },
});
