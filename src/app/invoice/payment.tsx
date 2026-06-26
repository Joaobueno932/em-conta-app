import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { paymentService } from '@/services/paymentService';
import { Payment } from '@/types/payment';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

export default function PaymentScreen() {
  const { invoiceId, amount } = useLocalSearchParams<{ invoiceId: string; amount: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    paymentService.getPixCode(invoiceId).then((p) => {
      setPayment(p);
      setLoading(false);
    });
  }, [invoiceId]);

  async function handleCopy() {
    if (!payment?.pixCode) return;
    await Clipboard.setStringAsync(payment.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    Alert.alert('Código copiado!', 'Cole o código no app do seu banco para pagar.');
  }

  if (loading) return <Loading message="Gerando código Pix..." />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagar com Pix</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.amountCard}>
          <Text style={styles.amountLabel}>Valor a pagar</Text>
          <Text style={styles.amountValue}>{formatCurrency(parseFloat(amount ?? '0'))}</Text>
        </Card>

        <Card style={styles.pixCard}>
          <View style={styles.pixHeader}>
            <View style={styles.pixIcon}>
              <Ionicons name="qr-code-outline" size={28} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.pixTitle}>Pix Copia e Cola</Text>
              <Text style={styles.pixSub}>Abra o banco e cole o código</Text>
            </View>
          </View>

          <View style={styles.codeBox}>
            <Text style={styles.codeText} numberOfLines={3}>{payment?.pixCode}</Text>
          </View>

          <Button
            label={copied ? 'Copiado! ✓' : 'Copiar código Pix'}
            onPress={handleCopy}
            variant={copied ? 'secondary' : 'primary'}
          />
        </Card>

        <View style={styles.steps}>
          {[
            'Copie o código acima',
            'Abra o app do seu banco',
            'Escolha Pix → Copia e Cola',
            'Cole o código e confirme',
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
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
  closeBtn: {
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
  amountCard: { alignItems: 'center' },
  amountLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textLight,
  },
  amountValue: {
    fontFamily: fontFamily.black,
    fontSize: 40,
    color: colors.textDark,
    letterSpacing: -1,
    marginTop: 4,
  },
  pixCard: { gap: spacing.base },
  pixHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pixIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  steps: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
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
  },
});
