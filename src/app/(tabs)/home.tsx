import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';
import { useUnitStore } from '@/stores/unitStore';
import { useNoticeStore } from '@/stores/noticeStore';
import { noticeService } from '@/services/noticeService';
import { NoticeCard } from '@/components/notices/NoticeCard';
import { getNextDueSoonInvoice, getDueSoonMessage } from '@/utils/dueSoon';
import { mockInvoices } from '@/mocks/invoices.mock';
import { mockNotices } from '@/mocks/notices.mock';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const SHORTCUTS: { label: string; icon: IconName; route: string; bg: string; iconColor: string }[] = [
  { label: 'Faturas', icon: 'document-text-outline', route: '/(tabs)/invoices', bg: colors.greenBg, iconColor: colors.primary },
  { label: 'Avisos', icon: 'notifications-outline', route: '/(tabs)/notices', bg: colors.orangeBg, iconColor: colors.orange },
  { label: 'Perfil', icon: 'person-outline', route: '/(tabs)/profile', bg: colors.greenBgSubtle, iconColor: colors.primaryDark },
  { label: 'Suporte', icon: 'headset-outline', route: '/support', bg: colors.border, iconColor: colors.textMedium },
];

const STATUS_LABEL: Record<string, string> = {
  pending: 'Em aberto',
  overdue: 'Vencida',
  paid: 'Paga',
  upcoming: 'Próxima',
};

const CARD_LABEL: Record<string, string> = {
  overdue: 'FATURA VENCIDA',
  upcoming: 'VENCIMENTO PRÓXIMO',
  pending: 'EM ABERTO',
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function dueLabel(days: number): string {
  if (days > 1) return `Vence em ${days} dias`;
  if (days === 1) return 'Vence amanhã';
  if (days === 0) return 'Vence hoje';
  if (days === -1) return 'Venceu ontem';
  return `Venceu há ${Math.abs(days)} dias`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function SummaryRow({ icon, color, text }: { icon: IconName; color: string; text: string }) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.summaryText}>{text}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? '';
  const selectedUnit = useUnitStore((s) => s.selectedUnit);
  const readIds = useNoticeStore((s) => s.readIds);

  const unitInvoices = selectedUnit
    ? mockInvoices.filter((inv) => inv.unitId === selectedUnit.id)
    : mockInvoices;

  const nextInvoice =
    unitInvoices.find((inv) => inv.status === 'overdue') ??
    unitInvoices.find((inv) => inv.status === 'upcoming') ??
    unitInvoices.find((inv) => inv.status === 'pending') ??
    null;
  const dueSoonInvoice = getNextDueSoonInvoice(unitInvoices);
  const unitNotices = selectedUnit
    ? mockNotices.filter((n) => n.unitId === selectedUnit.id)
    : mockNotices;
  const urgentNotice =
    unitNotices.find((n) => !n.read && n.type === 'charge') ??
    unitNotices.find((n) => !n.read);

  const pendingCount = unitInvoices.filter((inv) => inv.status === 'pending').length;
  const overdueCount = unitInvoices.filter((inv) => inv.status === 'overdue').length;
  const unreadCount = noticeService
    .listForUnit(selectedUnit?.id)
    .filter((n) => !readIds.includes(n.id)).length;
  const allClear = overdueCount === 0 && pendingCount === 0 && unreadCount === 0;

  const daysLeft = nextInvoice ? daysUntil(nextInvoice.dueDate) : null;
  const isOverdue = nextInvoice?.status === 'overdue';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo-em-conta.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.userName}>{firstName ? `${firstName}!` : 'bem-vindo!'}</Text>
        <Text style={styles.headerSub}>Veja o resumo da sua conta</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {selectedUnit && (
          <TouchableOpacity
            style={styles.unitCard}
            onPress={() => router.push('/units' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.unitIconWrap}>
              <Ionicons name="home" size={22} color={colors.primary} />
            </View>
            <View style={styles.unitInfo}>
              <Text style={styles.unitLabel}>Unidade ativa</Text>
              <Text style={styles.activeUnitName} numberOfLines={1}>{selectedUnit.name}</Text>
            </View>
            <View style={styles.unitSwitch}>
              <Text style={styles.unitSwitchText}>Trocar</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primaryDark} />
            </View>
          </TouchableOpacity>
        )}

        {nextInvoice && (
          <Card style={[styles.invoiceCard, isOverdue && styles.invoiceCardOverdue]}>
            <View style={styles.cardLabelRow}>
              <Text style={styles.cardLabel}>
                {CARD_LABEL[nextInvoice.status] ?? 'PRÓXIMA FATURA'}
              </Text>
              <Badge
                label={STATUS_LABEL[nextInvoice.status] ?? nextInvoice.status}
                color={isOverdue ? colors.error : colors.orangeDark}
                backgroundColor={isOverdue ? colors.errorBg : colors.orangeBg}
              />
            </View>
            <Text style={styles.unitName}>{nextInvoice.unitName}</Text>
            <Text style={[styles.invoiceAmount, isOverdue && styles.invoiceAmountOverdue]}>
              {formatCurrency(nextInvoice.amount)}
            </Text>
            {daysLeft !== null && (
              <Text style={[styles.invoiceDue, isOverdue && styles.invoiceDueOverdue]}>
                {dueLabel(daysLeft)} · {formatDate(nextInvoice.dueDate)}
              </Text>
            )}
            <TouchableOpacity
              style={styles.cardLink}
              onPress={() => router.push('/(tabs)/invoices' as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cardLinkText, isOverdue && styles.cardLinkTextOverdue]}>
                Ver fatura
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={isOverdue ? colors.error : colors.primary}
              />
            </TouchableOpacity>
          </Card>
        )}

        {dueSoonInvoice ? (
          <NoticeCard
            type="due_soon"
            title="Vencimento próximo"
            message={getDueSoonMessage(dueSoonInvoice)}
            date={`Vencimento em ${formatDate(dueSoonInvoice.dueDate)}`}
            unitName={dueSoonInvoice.unitName}
            highlighted
            actionLabel="Ver fatura"
            onPress={() => router.push(`/invoice/${dueSoonInvoice.id}` as any)}
          />
        ) : (
          urgentNotice && (
            <Card style={styles.noticeCard}>
              <View style={styles.noticeHeader}>
                <View style={styles.noticeIconWrap}>
                  <Ionicons name="alert-circle" size={20} color={colors.orange} />
                </View>
                <Text style={styles.noticeHeaderText}>Aviso importante</Text>
                <Badge label="Novo" color={colors.orangeDark} backgroundColor={colors.orangeBg} />
              </View>
              <Text style={styles.noticeTitle}>{urgentNotice.title}</Text>
              <Text style={styles.noticeBody} numberOfLines={3}>
                {urgentNotice.message}
              </Text>
              <TouchableOpacity
                style={styles.cardLink}
                onPress={() => router.push('/(tabs)/notices' as any)}
                activeOpacity={0.7}
              >
                <Text style={[styles.cardLinkText, { color: colors.orange }]}>Ver avisos</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.orange} />
              </TouchableOpacity>
            </Card>
          )
        )}

        <Card>
          <Text style={styles.sectionTitle}>Status da conta</Text>
          <View style={styles.summaryList}>
            {allClear ? (
              <SummaryRow
                icon="checkmark-circle"
                color={colors.primary}
                text="Tudo certo por enquanto"
              />
            ) : (
              <>
                {overdueCount > 0 && (
                  <SummaryRow
                    icon="close-circle"
                    color={colors.error}
                    text={`${overdueCount} fatura${overdueCount > 1 ? 's' : ''} vencida${overdueCount > 1 ? 's' : ''}`}
                  />
                )}
                {pendingCount > 0 && (
                  <SummaryRow
                    icon="time-outline"
                    color={colors.orange}
                    text={`${pendingCount} fatura${pendingCount > 1 ? 's' : ''} em aberto`}
                  />
                )}
                {unreadCount > 0 && (
                  <SummaryRow
                    icon="notifications-outline"
                    color={colors.orange}
                    text={`${unreadCount} aviso${unreadCount > 1 ? 's' : ''} não lido${unreadCount > 1 ? 's' : ''}`}
                  />
                )}
              </>
            )}
          </View>
        </Card>

        <View>
          <Text style={styles.sectionTitle}>Acesso rápido</Text>
          <View style={styles.shortcutsGrid}>
            {SHORTCUTS.map((s) => (
              <TouchableOpacity
                key={s.label}
                style={styles.shortcutBtn}
                onPress={() => router.push(s.route as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.shortcutIcon, { backgroundColor: s.bg }]}>
                  <Ionicons name={s.icon} size={26} color={s.iconColor} />
                </View>
                <Text style={styles.shortcutLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
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
    backgroundColor: colors.primaryDark,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logo: {
    width: 110,
    height: 34,
    marginBottom: spacing.base,
    opacity: 0.9,
  },
  greeting: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.greenAccentLight,
  },
  userName: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.white,
    lineHeight: 38,
  },
  headerSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.greenAccentLight,
    opacity: 0.8,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 40,
    gap: spacing.base,
  },
  // Active unit card
  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  unitIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitInfo: { flex: 1 },
  unitLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  activeUnitName: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: colors.textDark,
    marginTop: 2,
  },
  unitSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  unitSwitchText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.primaryDark,
  },
  // Invoice card
  invoiceCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.orange,
    gap: spacing.sm,
  },
  invoiceCardOverdue: {
    borderLeftColor: colors.error,
  },
  cardLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  unitName: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
  },
  invoiceAmount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.textDark,
    lineHeight: 38,
  },
  invoiceAmountOverdue: {
    color: colors.error,
  },
  invoiceDue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  invoiceDueOverdue: {
    color: colors.error,
  },
  cardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  cardLinkText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.primary,
  },
  cardLinkTextOverdue: {
    color: colors.error,
  },
  // Notice card
  noticeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.orange,
    gap: spacing.sm,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  noticeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.orangeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeHeaderText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.orangeDark,
    flex: 1,
  },
  noticeTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  noticeBody: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
    lineHeight: 22,
  },
  // Summary card
  sectionTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xxl,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  summaryList: {
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
    flex: 1,
  },
  // Shortcuts
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  shortcutBtn: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textDark,
  },
});
