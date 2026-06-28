import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SupportItemProps {
  icon: IconName;
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
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const FAQ = [
  'Como funciona o desconto na conta de luz?',
  'Quando minha fatura fica disponível?',
  'Como pagar via Pix?',
  'O que é energia renovável?',
];

export default function SupportScreen() {
  function handleTalk() {
    Alert.alert('Falar com atendimento', 'Em breve você poderá falar com o atendimento por aqui.');
  }

  function handleSendQuestion() {
    Alert.alert('Enviar dúvida', 'Em breve você poderá enviar sua dúvida por aqui.');
  }

  function handleFaq(question: string) {
    Alert.alert(question, 'Em breve a resposta completa estará disponível por aqui.');
  }

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
        <Text style={styles.intro}>Precisa de ajuda? Escolha uma opção abaixo.</Text>

        <View style={styles.card}>
          <SupportItem
            icon="chatbubble-ellipses-outline"
            title="Falar com atendimento"
            subtitle="Tire suas dúvidas com a nossa equipe"
            onPress={handleTalk}
          />
          <View style={styles.sep} />
          <SupportItem
            icon="mail-outline"
            title="Enviar dúvida"
            subtitle="Mande sua mensagem para a gente"
            onPress={handleSendQuestion}
          />
          <View style={styles.sep} />
          <SupportItem
            icon="help-circle-outline"
            title="Ver dúvidas frequentes"
            subtitle="Respostas para as perguntas mais comuns"
            onPress={() => handleFaq(FAQ[0])}
          />
        </View>

        {/* Canal de atendimento */}
        <View style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <Ionicons name="headset-outline" size={20} color={colors.primary} />
            <Text style={styles.contactTitle}>Canal de atendimento</Text>
          </View>
          <Text style={styles.contactText}>
            Atendimento de segunda a sexta, das 8h às 18h.
          </Text>
          <Text style={styles.contactText}>
            Em breve novos canais estarão disponíveis direto pelo app.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Dúvidas frequentes</Text>

        <View style={styles.card}>
          {FAQ.map((q, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.faqItem} activeOpacity={0.7} onPress={() => handleFaq(q)}>
                <Text style={styles.faqText}>{q}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
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
  intro: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
    lineHeight: 24,
  },
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
    fontSize: fontSize.lg,
    color: colors.textDark,
  },
  itemSub: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: 64 },
  contactCard: {
    backgroundColor: colors.greenBgSubtle,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.greenBorder,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  contactTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.primaryDark,
  },
  contactText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    color: colors.textMedium,
    lineHeight: 21,
  },
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
