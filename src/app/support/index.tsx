import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

interface SupportItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}

function SupportItem({ icon, title, subtitle, onPress }: SupportItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.itemIcon}>
        <Ionicons name={icon} size={26} color={colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </TouchableOpacity>
  );
}

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Como podemos ajudar?</Text>

        <View style={styles.card}>
          <SupportItem
            icon="chatbubble-ellipses-outline"
            title="Chat no WhatsApp"
            subtitle="Atendimento de seg a sex, 8h às 18h"
            onPress={() => Linking.openURL('https://wa.me/5567999990000')}
          />
          <View style={styles.sep} />
          <SupportItem
            icon="mail-outline"
            title="Enviar e-mail"
            subtitle="suporte@emconta.com.br"
            onPress={() => Linking.openURL('mailto:suporte@emconta.com.br')}
          />
          <View style={styles.sep} />
          <SupportItem
            icon="call-outline"
            title="Ligar para o suporte"
            subtitle="(67) 3000-0000"
            onPress={() => Linking.openURL('tel:+55673000000')}
          />
        </View>

        <Text style={styles.sectionTitle}>Dúvidas frequentes</Text>

        <View style={styles.card}>
          {[
            'Como funciona o desconto na conta de luz?',
            'Quando minha fatura fica disponível?',
            'Como pagar via Pix?',
            'O que é energia renovável?',
          ].map((q, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                <Text style={styles.faqText}>{q}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.border} />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.sep} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
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
  content: { padding: spacing.base, gap: spacing.base, paddingBottom: 40 },
  sectionTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
  itemTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  itemSub: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: 64 },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  faqText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textDark,
    flex: 1,
    lineHeight: 22,
  },
});
