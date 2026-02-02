import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSector } from '../hooks/useSector';
import { PullToRefreshView } from './PullToRefreshView';
import { Colors } from '../constants/Colors';

interface SectorWithCombos {
  id: number;
  name: string;
  description?: string;
  combos?: Array<{ id: number; name: string }>;
}

interface SectorDetailProps {
  sectorId: number;
}

export function SectorDetail({ sectorId }: SectorDetailProps) {
  const { data: sector, isLoading, isError, error, isRefreshing, refresh } = useSector(sectorId);

  return (
    <View style={styles.container}>
      <PullToRefreshView
        isRefreshing={isRefreshing}
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        isEmpty={!sector}
        onRefresh={refresh}
        emptyText="Không có dữ liệu lĩnh vực. Kéo xuống để tải lại."
        errorText="Không thể tải dữ liệu lĩnh vực. Kéo xuống để thử lại."
        refreshText="Đang làm mới thông tin lĩnh vực..."
        showRefreshingIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {sector && (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{sector.name}</Text>
              <Text style={styles.subtitle}>{sector.id}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mô tả</Text>
              <Text style={styles.description}>{sector.description || 'Không có mô tả'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin khác</Text>
              <Text style={styles.infoText}>
                Các gói trong lĩnh vực: {(sector as SectorWithCombos).combos?.length || 0}
              </Text>
            </View>

            <Text style={styles.footerText}>Kéo xuống để làm mới dữ liệu</Text>
          </>
        )}
      </PullToRefreshView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[500],
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.gray[800],
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray[700],
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.gray[700],
  },
  footerText: {
    textAlign: 'center',
    color: Colors.gray[500],
    marginVertical: 20,
    fontSize: 14,
  },
});
