import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Invoice } from '@/types/invoice';
import { PixPayment } from '@/types/payment';
import { invoiceService } from '@/services/invoiceService';
import { paymentService } from '@/services/paymentService';
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, formatMonth } from '@/utils/formatDate';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

export default function PaymentScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [pix, setPix] = useState<PixPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      invoiceService.getById(invoiceId),
      paymentService.getPixByInvoiceId(invoiceId),
    ])
      .then(([inv, pixData]) => {
        setInvoice(inv);
        setPix(pixData);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [invoiceId]);

  async function handleCopy() {
    if (!pix?.pixCode) return;
    await Clipboard.setStringAsync(pix.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  }

  if (loading) return <Loading message="Carregando pagamento..." />;

  const header = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Pagamento</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  if (notFound || !invoice || !pix) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <View style={styles.centeredIcon}>
            <Ionicons name="document-outline" size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.centeredTitle}>Fatura não encontrada</Text>
          <Text style={styles.centeredSub}>
            Volte para a lista de faturas e tente novamente.
          </Text>
          <Button
            label="Voltar para faturas"
            onPress={() => router.replace('/(tabs)/invoices' as any)}
            variant="secondary"
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    );
  }

  if (pix.status === 'paid') {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <View style={[styles.centeredIcon, styles.centeredIconGreen]}>
            <Ionicons name="checkmark-circle" size={40} color={colors.primary} />
          </View>
          <Text style={styles.centeredTitle}>Fatura já paga</Text>
          <Text style={styles.centeredSub}>
            Esta fatura já foi paga. Obrigado por estar em dia!
          </Text>
          <Button
            label="Voltar para faturas"
            onPress={() => router.replace('/(tabs)/invoices' as any)}
            variant="secondary"
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    );
  }

  if (pix.status === 'unavailable' || !pix.pixCode) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <View style={styles.centeredIcon}>
            <Ionicons name="warning-outline" size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.centeredTitle}>Pix não disponível</Text>
          <Text style={styles.centeredSub}>
            No momento, não encontramos um código Pix para esta fatura.
          </Text>
          <Button
            label="Voltar para fatura"
            onPress={() => router.back()}
            variant="secondary"
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo da fatura */}
        <Card>
          <View style={styles.summaryRow}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryMonth}>{formatMonth(invoice.referenceMonth)}</Text>
              <Text style={styles.summaryUnit}>{invoice.unitName}</Text>
              <Text style={styles.summaryDue}>
                {invoice.status === 'overdue' ? 'Venceu em' : 'Vence em'}{' '}
                {formatDate(invoice.dueDate)}
              </Text>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.summaryAmount}>{formatCurrency(invoice.amount)}</Text>
              <InvoiceStatusBadge status={invoice.status} />
            </View>
          </View>
        </Card>

        {/* Área Pix */}
        <Card style={styles.pixCard}>
          <View style={styles.pixHeader}>
            <View style={styles.pixIconWrap}>
              <Ionicons name="qr-code-outline" size={28} color={colors.primary} />
            </View>
            <View style={styles.pixHeaderText}>
              <Text style={styles.pixTitle}>Pagamento via Pix</Text>
              <Text style={styles.pixSub}>
                Copie o código Pix e cole no aplicativo do seu banco.
              </Text>
            </View>
          </View>

          {/* Área QR Code */}
          <View style={styles.qrArea}>
            <Ionicons name="qr-code-outline" size={72} color={colors.border} />
            <Text style={styles.qrMsg}>
              QR Code não disponível no momento. Use o código abaixo para pagamento.
            </Text>
          </View>

          {/* Código Pix */}
          <View style={styles.codeBox}>
            <Text style={styles.codeText} numberOfLines={4} selectable>
              {pix.pixCode}
            </Text>
          </View>

          {/* Confirmação visual após copiar */}
          {copied && (
            <View style={styles.copiedBanner}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.copiedText}>Código Pix copiado com sucesso.</Text>
            </View>
          )}

          <Button
            label={copied ? 'Copiado!' : 'Copiar código Pix'}
            onPress={handleCopy}
            variant={copied ? 'secondary' : 'primary'}
          />
        </Card>

        {/* Como pagar */}
        <Card style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Como pagar</Text>
          {([
            'Copie o código acima',
            'Abra o app do seu banco',
            'Escolha Pix → Copia e Cola',
            'Cole o código e confirme o pagamento',
          ] as const).map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>

        {/* Aviso importante */}
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textLight} />
          <Text style={styles.noticeText}>
            Copiar o código Pix não confirma o pagamento. Após pagar no banco, a confirmação pode levar alguns minutos.
          </Text>
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
    backgroundColor: colors.primary,
    paddingTop: 48,
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
  content: { padding: spacing.base, gap: spacing.md, paddingBottom: 40 },

  // Centered states
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  centeredIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredIconGreen: {
    backgroundColor: colors.greenBg,
    borderColor: colors.greenBorder,
  },
  centeredTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  centeredSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Summary card
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryInfo: { flex: 1 },
  summaryMonth: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  summaryUnit: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.textDark,
    marginTop: 2,
  },
  summaryDue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  summaryRight: { alignItems: 'flex-end', gap: 6 },
  summaryAmount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.textDark,
    letterSpacing: -0.5,
  },

  // Pix card
  pixCard: { gap: spacing.base },
  pixHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  pixIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pixHeaderText: { flex: 1 },
  pixTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  pixSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
    lineHeight: 18,
  },
  qrArea: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  qrMsg: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  codeBox: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
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
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.greenBorder,
  },
  copiedText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.primaryDark,
  },

  // Steps card
  stepsCard: { gap: spacing.md },
  stepsTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.base,
    color: colors.primary,
  },
  stepText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textDark,
    flex: 1,
  },

  // Notice
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeText: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    lineHeight: 18,
  },
});
