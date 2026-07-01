import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { currentCharge } from '@/mocks/pagamentos.mock';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { BottomTabBarMock } from '@/components/navigation/BottomTabBarMock';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

function DetailRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {!last && <View style={styles.separator} />}
    </>
  );
}

export default function PaymentDetailScreen() {
  // Etapa mockada: sempre a cobrança atual (Junho 2026).
  const charge = currentCharge;
  const [copied, setCopied] = useState(false);

  async function handleCopyPix() {
    await Clipboard.setStringAsync(charge.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
        <Text style={styles.headerLabel}>Cobrança de {charge.month}</Text>
        <Text style={styles.headerAmount} numberOfLines={1} adjustsFontSizeToFit>
          {charge.amount}
        </Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{charge.statusLabel}</Text>
        </View>
      </GradientHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de informações */}
        <View style={styles.infoCard}>
          <DetailRow label="Mês de referência" value={charge.month} />
          <DetailRow label="Vencimento" value={charge.dueDate} />
          <DetailRow label="Unidade" value={charge.unit} last />
        </View>

        {/* Card código Pix copia e cola */}
        <View style={styles.pixCard}>
          <Text style={styles.pixTitle}>Código Pix Copia e Cola</Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeText} numberOfLines={4} selectable>
              {charge.pixCode}
            </Text>
          </View>

          {copied && (
            <View style={styles.copiedBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              <Text style={styles.copiedText}>Código Pix copiado</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyPix}
            activeOpacity={0.85}
          >
            <Ionicons name="copy-outline" size={20} color={colors.white} />
            <Text style={styles.copyButtonText}>Copiar Pix</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabBarMock active="payments" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
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
  headerLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.greenAccentLight,
  },
  headerAmount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.display,
    color: colors.white,
    lineHeight: 40,
    marginTop: 2,
  },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.orangeBg,
    borderRadius: radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: spacing.sm,
  },
  headerBadgeText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.orangeDark,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.base,
  },
  // Info card
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    gap: spacing.base,
  },
  rowLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
  },
  rowValue: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textDark,
    textAlign: 'right',
    flexShrink: 1,
  },
  separator: { height: 1, backgroundColor: colors.border },
  // Pix card
  pixCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  pixTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.textDark,
  },
  codeBox: {
    backgroundColor: colors.greenBgMid,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.base,
  },
  codeText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMedium,
    lineHeight: 18,
  },
  copiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successBg,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.greenBorder,
  },
  copiedText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.primaryDark,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.base,
  },
  copyButtonText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.white,
  },
});
