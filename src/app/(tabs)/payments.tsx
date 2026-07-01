import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import {
  currentCharge,
  paymentHistory,
  PaymentHistoryItem,
} from '@/mocks/pagamentos.mock';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

function HistoryCard({ item }: { item: PaymentHistoryItem }) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyIcon}>
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyMonth}>{item.month}</Text>
        <Text style={styles.historyPaid}>{item.paidText}</Text>
      </View>
      <View style={styles.historyRight}>
        <Text style={styles.historyAmount} numberOfLines={1}>{item.amount}</Text>
        <Text style={styles.historyStatus}>{item.statusLabel}</Text>
      </View>
    </View>
  );
}

export default function PaymentsScreen() {
  const [copied, setCopied] = useState(false);

  async function handleCopyPix() {
    await Clipboard.setStringAsync(currentCharge.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function handleOpenPdf() {
    Alert.alert('Abrir PDF', 'O PDF da cobrança será aberto em instantes.');
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Cobrança Em Conta · ${currentCharge.month}\nValor: ${currentCharge.amount}\nPix: ${currentCharge.pixCode}`,
      });
    } catch {
      // ação cancelada — nada a fazer nesta etapa
    }
  }

  return (
    <View style={styles.container}>
      {/* Header verde */}
      <GradientHeader variant="title">
        <Text style={styles.headerTitle}>Pagamentos</Text>
        <Text style={styles.headerSub}>Suas cobranças do Em Conta</Text>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de cobrança atual */}
        <View style={styles.chargeCard}>
          <View style={styles.chargeTop}>
            <Text style={styles.chargeLabel}>
              Cobrança atual · {currentCharge.month}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentCharge.statusLabel}</Text>
            </View>
          </View>

          <Text style={styles.chargeAmount} numberOfLines={1} adjustsFontSizeToFit>
            {currentCharge.amount}
          </Text>

          <View style={styles.dueRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.orange} />
            <Text style={styles.dueText}>Vence em {currentCharge.dueDate}</Text>
          </View>

          {copied && (
            <View style={styles.copiedBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              <Text style={styles.copiedText}>Código Pix copiado</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.pixButton}
            onPress={handleCopyPix}
            activeOpacity={0.85}
          >
            <Ionicons name="copy-outline" size={20} color={colors.white} />
            <Text style={styles.pixButtonText}>Copiar código Pix</Text>
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleOpenPdf}
              activeOpacity={0.8}
            >
              <Ionicons name="document-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.secondaryText}>Abrir PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.secondaryText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.detailLink}
            onPress={() => router.push(`/payment/${currentCharge.id}` as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailLinkText}>Ver detalhe do pagamento</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Histórico de pagamentos */}
        <Text style={styles.sectionTitle}>Histórico de pagamentos</Text>
        {paymentHistory.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
    gap: spacing.base,
  },
  // Cobrança atual
  chargeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.orangeBorder,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  chargeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chargeLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.md,
    color: colors.textMedium,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: colors.orangeBg,
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.sm,
    color: colors.orangeDark,
  },
  chargeAmount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.hero,
    color: colors.textDark,
    lineHeight: 50,
    letterSpacing: -1,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
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
  pixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 16,
    minHeight: 58,
    paddingVertical: spacing.base,
  },
  pixButtonText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xxl,
    color: colors.white,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.greenBg,
    borderRadius: 14,
    minHeight: 50,
    paddingVertical: spacing.md,
  },
  secondaryText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.primaryDark,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: spacing.sm,
  },
  detailLinkText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.primary,
  },
  // Histórico
  sectionTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.textDark,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyMonth: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  historyPaid: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  historyStatus: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.primary,
    marginTop: 2,
  },
});
