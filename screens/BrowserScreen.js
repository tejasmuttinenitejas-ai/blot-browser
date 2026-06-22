import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { addHistoryEntry, getSettings, addBookmark, removeBookmark, getBookmarks } from '../storage';
import { SEARCH_ENGINE_URL, HOME_URL } from '../config';

function isLikelyUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/i.test(trimmed) && !trimmed.includes(' ')) return true;
  return false;
}

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function BrowserScreen({ navigation, route }) {
  const webviewRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(route.params?.url || HOME_URL);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [homeUrl, setHomeUrl] = useState(HOME_URL);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (route.params?.url) {
      setCurrentUrl(route.params.url);
    }
  }, [route.params?.url]);

  useEffect(() => {
    getSettings().then((s) => {
      if (s.homeUrl) setHomeUrl(s.homeUrl);
    });
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  const handleSubmit = useCallback(() => {
    const value = inputValue.trim();
    if (!value) {
      setEditingUrl(false);
      return;
    }
    const target = isLikelyUrl(value)
      ? normalizeUrl(value)
      : `${SEARCH_ENGINE_URL}${encodeURIComponent(value)}`;
    setCurrentUrl(target);
    setEditingUrl(false);
  }, [inputValue]);

  const handleNavChange = useCallback((navState) => {
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setLoading(navState.loading);
    setPageTitle(navState.title || '');
    if (!navState.loading && navState.url) {
      addHistoryEntry({ url: navState.url, title: navState.title || navState.url });
      getBookmarks().then((bms) => setIsBookmarked(bms.some((b) => b.url === navState.url)));
    }
  }, []);

  const toggleBookmark = useCallback(async () => {
    if (isBookmarked) {
      await removeBookmark(currentUrl);
      setIsBookmarked(false);
    } else {
      await addBookmark({ url: currentUrl, title: pageTitle || currentUrl });
      setIsBookmarked(true);
    }
  }, [isBookmarked, currentUrl, pageTitle]);

  const displayValue = editingUrl ? inputValue : currentUrl;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.addressBarRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Tabs')}
          >
            <MaterialCommunityIcons name="apps" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.addressBar}>
            <Ionicons
              name="lock-closed"
              size={13}
              color={colors.textTertiary}
              style={{ marginRight: 6 }}
            />
            <TextInput
              style={styles.addressInput}
              value={displayValue}
              onFocus={() => {
                setEditingUrl(true);
                setInputValue(currentUrl);
              }}
              onChangeText={setInputValue}
              onSubmitEditing={handleSubmit}
              onBlur={() => setEditingUrl(false)}
              placeholder="Search or enter address"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              selectTextOnFocus
              returnKeyType="go"
            />
            {loading && <ActivityIndicator size="small" color={colors.accent} />}
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Becky')}
          >
            <MaterialCommunityIcons name="robot-happy-outline" size={20} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleBookmark}>
            <Ionicons
              name={isBookmarked ? 'star' : 'star-outline'}
              size={20}
              color={isBookmarked ? colors.accent : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(progress, 15)}%` }]} />
          </View>
        )}
      </View>

      <WebView
        ref={webviewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavChange}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress * 100)}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}
        pullToRefreshEnabled
        allowsBackForwardNavigationGestures
        javaScriptEnabled
        domStorageEnabled
        decelerationRate="normal"
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBtn}
          disabled={!canGoBack}
          onPress={() => webviewRef.current?.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={canGoBack ? colors.text : colors.textTertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          disabled={!canGoForward}
          onPress={() => webviewRef.current?.goForward()}
        >
          <Ionicons
            name="arrow-forward"
            size={22}
            color={canGoForward ? colors.text : colors.textTertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setCurrentUrl(homeUrl)}
        >
          <Ionicons name="home-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation.navigate('Bookmarks')}
        >
          <Ionicons name="bookmark-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  addressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  addressInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 0,
  },
  progressTrack: {
    height: 2,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: 2,
    backgroundColor: colors.accent,
  },
  webview: { flex: 1, backgroundColor: colors.bg },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 8 : 10,
  },
  bottomBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
