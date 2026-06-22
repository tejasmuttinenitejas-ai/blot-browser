import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { getSettings, updateSettings, resetAllSettings, clearHistory, clearBookmarks } from '../storage';
import { GROQ_API_KEY, GROQ_MODEL } from '../config';

function Row({ title, subtitle, right }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState(null);
  const [homeUrlDraft, setHomeUrlDraft] = useState('');

  useEffect(() => {
    getSettings().then((s) => { setSettings(s); setHomeUrlDraft(s.homeUrl); });
  }, []);

  const persist = async (partial) => {
    const next = await updateSettings(partial);
    setSettings(next);
  };

  if (!settings) return <SafeAreaView style={styles.safe} />;

  const maskedKey = GROQ_API_KEY && GROQ_API_KEY !== 'PASTE_YOUR_GROQ_KEY_HERE'
    ? `${GROQ_API_KEY.slice(0, 6)}${'•'.repeat(20)}` : 'Not set in config.js';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionLabel}>Home page</Text>
        <View style={styles.inputBlock}>
          <Text style={styles.rowTitle}>Home URL</Text>
          <TextInput style={styles.textInput} value={homeUrlDraft} onChangeText={setHomeUrlDraft} onBlur={() => persist({ homeUrl: homeUrlDraft })} autoCapitalize="none" autoCorrect={false} placeholder="https://www.google.com" placeholderTextColor={colors.textTertiary} />
        </View>
        <Text style={styles.sectionLabel}>Becky AI</Text>
        <Row title="Groq API key" subtitle="Set in config.js" right={<Text style={styles.valueText}>{maskedKey}</Text>} />
        <Row title="AI model" right={<Text style={styles.valueText}>{GROQ_MODEL}</Text>} />
        <Text style={styles.sectionLabel}>Privacy</Text>
        <Row title="Save browsing history" subtitle="Keep record of visited pages"
          right={<Switch value={settings.saveHistory} onValueChange={(v) => persist({ saveHistory: v })} trackColor={{ true: colors.accent, false: colors.border }} thumbColor="#fff" />} />
        <Row title="Block ad trackers" subtitle="Basic protection against tracking"
          right={<Switch value={settings.blockTrackers} onValueChange={(v) => persist({ blockTrackers: v })} trackColor={{ true: colors.accent, false: colors.border }} thumbColor="#fff" />} />
        <Text style={styles.sectionLabel}>Data</Text>
        <Row title="Clear browsing history" right={<TouchableOpacity style={styles.dangerBtn} onPress={() => Alert.alert('Clear history', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: clearHistory }])}><Text style={styles.dangerBtnText}>Clear History</Text></TouchableOpacity>} />
        <Row title="Clear all bookmarks" right={<TouchableOpacity style={styles.dangerBtn} onPress={() => Alert.alert('Clear bookmarks', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: clearBookmarks }])}><Text style={styles.dangerBtnText}>Clear Bookmarks</Text></TouchableOpacity>} />
        <Row title="Reset all settings" right={<TouchableOpacity style={styles.dangerBtn} onPress={() => Alert.alert('Reset everything', 'Clears all data.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: async () => { await resetAllSettings(); getSettings().then(s => { setSettings(s); setHomeUrlDraft(s.homeUrl); }); } }])}><Text style={styles.dangerBtnText}>Reset</Text></TouchableOpacity>} />
        <Text style={styles.sectionLabel}>About</Text>
        <Row title="Blot Browser" subtitle="Built with Expo + React Native" right={<Text style={styles.valueText}>v1.0.0</Text>} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  headerBtn: { padding: 8, width: 38 },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: '600' },
  sectionLabel: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 16, paddingTop: 22, paddingBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, gap: 10 },
  rowTitle: { color: colors.text, fontSize: 14, fontWeight: '500' },
  rowSubtitle: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  valueText: { color: colors.textSecondary, fontSize: 12, maxWidth: 150, textAlign: 'right' },
  inputBlock: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  textInput: { marginTop: 8, backgroundColor: colors.surfaceAlt, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: colors.text, fontSize: 13 },
  dangerBtn: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  dangerBtnText: { color: colors.text, fontSize: 12, fontWeight: '500' },
});
