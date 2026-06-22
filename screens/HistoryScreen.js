import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { getHistory, clearHistory, removeHistoryEntry } from '../storage';

function groupByDay(history) {
  const groups = {};
  history.forEach((item) => {
    const d = new Date(item.timestamp);
    const key = d.toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setHistory);
    }, [])
  );

  const handleClear = () => {
    Alert.alert('Clear history', 'This will remove all browsing history. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const handleRemove = async (url) => {
    await removeHistoryEntry(url);
    setHistory((prev) => prev.filter((h) => h.url !== url));
  };

  const sections = groupByDay(history);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity onPress={handleClear} style={styles.headerBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={40} color={colors.textTertiary} />
          <Text style={styles.emptyText}>No browsing history yet</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(s) => s.date}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item: section }) => (
            <View>
              <Text style={styles.sectionHeader}>{section.date}</Text>
              {section.items.map((entry) => (
                <TouchableOpacity
                  key={`${entry.url}-${entry.timestamp}`}
                  style={styles.row}
                  onPress={() => navigation.navigate('Browser', { url: entry.url })}
                  onLongPress={() => handleRemove(entry.url)}
                >
                  <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {entry.title || entry.url}
                    </Text>
                    <Text style={styles.rowUrl} numberOfLines={1}>
                      {entry.url}
                    </Text>
                  </View>
                  <Text style={styles.rowTime}>{formatTime(entry.timestamp)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
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
  headerBtn: { padding: 8 },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: '600' },
  clearText: { color: colors.accent, fontSize: 14, fontWeight: '500' },
  sectionHeader: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  rowText: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 14, fontWeight: '500' },
  rowUrl: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  rowTime: { color: colors.textTertiary, fontSize: 11 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyText: { color: colors.textTertiary, fontSize: 14 },
});
