import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá! 👋</Text>
        <Text style={styles.headerTitle}>Início</Text>
        <Text style={styles.headerSub}>Bem-vindo ao Em Conta</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('@/assets/images/mascote-heroi.png')}
          style={styles.mascote}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Início</Text>
          <Text style={styles.cardText}>
            Aqui você verá o resumo da sua conta.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Em breve</Text>
          </View>
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Use a navegação abaixo para acessar faturas, avisos e seu perfil.
          </Text>
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
    backgroundColor: colors.primaryDark,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.greenAccentLight,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.white,
  },
  headerSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.greenAccentLight,
    marginTop: 2,
    opacity: 0.85,
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 40,
    gap: spacing.base,
  },
  mascote: {
    width: 200,
    height: 200,
    marginBottom: spacing.sm,
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
  hint: {
    width: '100%',
    backgroundColor: colors.greenBgMid,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
  },
  hintText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 22,
  },
});
