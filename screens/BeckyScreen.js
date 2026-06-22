import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { askBecky } from '../becky';

export default function BeckyScreen({ navigation }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hi, I'm Becky. Ask me anything." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    const result = await askBecky(nextMessages.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({ role: m.role, content: m.content })));
    setLoading(false);
    setMessages(prev => [...prev, { role: 'assistant', content: result.text, error: result.error }]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="robot-happy-outline" size={18} color={colors.accent} />
          <Text style={styles.headerTitle}>Becky AI</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
              <Text style={[styles.bubbleText, item.role === 'user' && styles.bubbleTextUser]}>{item.content}</Text>
            </View>
          )}
        />
        {loading && <View style={styles.typingRow}><ActivityIndicator size="small" color={colors.accent} /><Text style={styles.typingText}>Becky is thinking…</Text></View>}
        <View style={styles.inputRow}>
          <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Message Becky AI" placeholderTextColor={colors.textTertiary} multiline />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
            <Ionicons name="arrow-up" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  headerBtn: { padding: 8, width: 38 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: '600' },
  bubble: { maxWidth: '85%', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleAssistant: { backgroundColor: colors.surfaceAlt, alignSelf: 'flex-start', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  bubbleUser: { backgroundColor: colors.accent, alignSelf: 'flex-end' },
  bubbleText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 6 },
  typingText: { color: colors.textTertiary, fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.surfaceAlt, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, color: colors.text, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
