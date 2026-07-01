import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { suporteMock } from '@/mocks/perfil.mock';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function ContactCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function SupportScreen() {
  function handleWhatsApp() {
    Alert.alert('WhatsApp', 'Você será direcionado ao nosso WhatsApp.');
  }

  function handlePhone() {
    Alert.alert('Telefone', `Ligar para ${suporteMock.phone}`);
  }

  return (
    <View style={styles.container}>
      {/* Header verde */}
      <GradientHeader variant="detail">
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={colors.white} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Falar com suporte</Text>
        <Text style={styles.headerSub}>Estamos aqui para te ajudar</Text>
      </GradientHeader>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={require('@/assets/images/mascote-suporte-sem-fundo.png')}
          style={styles.mascot}
          resizeMode="contain"
        />

        <ContactCard
          icon="logo-whatsapp"
          title="WhatsApp"
          subtitle={suporteMock.whatsappSubtitle}
          onPress={handleWhatsApp}
        />
        <ContactCard
          icon="call-outline"
          title="Telefone"
          subtitle={suporteMock.phone}
          onPress={handlePhone}
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{suporteMock.hours}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: spacing.base,
  },
  backText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.white,
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
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
    gap: spacing.base,
  },
  mascot: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: colors.textDark,
  },
  cardSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textMedium,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.greenBg,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginTop: spacing.xs,
  },
  infoText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 22,
  },
});
