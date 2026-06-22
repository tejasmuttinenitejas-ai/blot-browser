import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme';

const SHORTCUTS = [
  { name: 'Google', url: 'https://www.google.com', icon: <FontAwesome5 name="google" size={20} color="#fff" /> },
  { name: 'YouTube', url: 'https://www.youtube.com', icon: <Ionicons name="logo-youtube" size={22} color="#fff" /> },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: <FontAwesome5 name="wikipedia-w" size={18} color="#fff" /> },
  { name: 'GitHub', url: 'https://www.github.com', icon: <Ionicons name="logo-github" size={20} color="#fff" /> },
  { name: 'Reddit', url: 'https://www.reddit.com', icon: <Ionicons name="logo-reddit" size={20} color="#fff" /> },
  { name: 'X', url: 'https://www.x.com', icon: <FontAwesome5 name="twitter" size={18} color="#fff" /> },
];

export default function TabsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New tab</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoMark}>
          <Text style={styles.logoB}>B</Text>
        </View>
        <Text style={styles.title}>
          Blot <Text style={{ color: colors.accent }}>Browser</Text>
        </Text>
        <Text style={styles.subtitle}>Your powerful private browser</Text>

        <View style={styles.grid}>
          {SHORTCUTS.map((s) => (
            <TouchableOpacity
              key={s.name}
              style={styles.tile}
              onPress={() => navigation.navigate('Browser', { url: s.url })}
            >
              <View style={styles.tileIcon}>{s.icon}</View>
              <Text style={styles.tileLabel}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.beckyCard}
          onPress={() => navigation.navigate('Becky')}
        >
          <MaterialCommunityIcons name="robot-happy-outline" size={20} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.beckyTitle}>Ask Becky AI</Text>
            <Text style={styles.beckySubtitle}>Chat with your built-in AI assistant</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerBtn: { padding: 8, width: 38 },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: '600' },
  content: { alignItems: 'center', paddingTop: 36, paddingHorizontal: 20, paddingBottom: 40 },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoB: { color: '#fff', fontSize: 26, fontWeight: '700' },
  title: { color: colors.text, fontSize: 22, fontWeight: '600' },
  subtitle: { color: colors.textTertiary, fontSize: 13, marginTop: 4, marginBottom: 28 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    width: '100%',
  },
  tile: {
    width: '28%',
    alignItems: 'center',
    gap: 8,
  },
  tileIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { color: colors.textSecondary, fontSize: 11 },
  beckyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginTop: 36,
    backgroundColor: colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
  },
  beckyTitle: { color: colors.text, fontSize: 14, fontWeight: '500' },
  beckySubtitle: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
});
