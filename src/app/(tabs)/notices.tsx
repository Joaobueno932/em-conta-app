import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

export default function NoticesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
        <Text style={styles.headerSub}>Vencimentos, cobranças e recados</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="notifications-outline" size={64} color={colors.primary} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Avisos</Text>
          <Text style={styles.cardText}>
            Aqui você verá vencimentos, cobranças e recados.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Em breve</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.textDark,
  },
  headerSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
    marginTop: 2,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: 40,
    gap: spacing.base,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.greenBorder,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h2,
    color: colors.textDark,
  },
  cardText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },
  badge: {
    marginTop: spacing.xs,
    backgroundColor: colors.greenBg,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
  },
  badgeText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
