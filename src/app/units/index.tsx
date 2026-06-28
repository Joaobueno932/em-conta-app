import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUnitStore } from '@/stores/unitStore';
import { UnitCard } from '@/components/units/UnitCard';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function UnitsScreen() {
  const { units, selectedUnitId, loading, loadUnits, setSelectedUnit } = useUnitStore();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      await loadUnits();
    } catch {
      setError('Não foi possível carregar suas unidades.');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading && units.length === 0) return <Loading message="Carregando unidades..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas unidades</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={units}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UnitCard
            unit={item}
            isActive={item.id === selectedUnitId}
            onSelect={() => setSelectedUnit(item.id)}
          />
        )}
        ListHeaderComponent={
          units.length > 0 ? (
            <Text style={styles.subtitle}>Escolha a unidade que deseja acompanhar.</Text>
          ) : null
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="home-outline" size={40} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma unidade encontrada</Text>
            <Text style={styles.emptySubtitle}>
              Quando uma unidade for vinculada à sua conta, ela aparecerá aqui.
            </Text>
            <Button label="Voltar" variant="secondary" onPress={() => router.back()} style={styles.emptyBtn} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
    paddingTop: 56,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.white,
  },
  list: { padding: spacing.base, paddingBottom: 32 },
  subtitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
    marginBottom: spacing.base,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textDark,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyBtn: {
    marginTop: spacing.base,
    alignSelf: 'stretch',
  },
});
