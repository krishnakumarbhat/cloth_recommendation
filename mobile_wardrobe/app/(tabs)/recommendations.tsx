import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useWardrobe } from '@/providers/wardrobe-store';

const WEATHER_OPTIONS = ['Warm', 'Rainy', 'Cold'];
const OCCASION_OPTIONS = ['Casual', 'Work', 'Evening'];

export default function RecommendationsScreen() {
  const { userWardrobe } = useWardrobe();
  const [weather, setWeather] = useState('Warm');
  const [occasion, setOccasion] = useState('Casual');

  const recommendations = useMemo(() => {
    if (weather === 'Rainy') {
      return userWardrobe.filter((item) => ['outerwear', 'footwear'].includes(item.category));
    }

    if (occasion === 'Evening') {
      return userWardrobe.filter((item) => ['dress', 'outerwear', 'accessory'].includes(item.category));
    }

    return userWardrobe.filter((item) => ['top', 'bottom', 'dress'].includes(item.category));
  }, [occasion, userWardrobe, weather]);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen} testID="recommendations-screen">
      <Text style={styles.eyebrow} testID="recommendations-screen-label">
        OUTFIT RECOMMENDER
      </Text>
      <Text style={styles.title} testID="recommendations-screen-title">
        Suggestions
      </Text>
      <Text style={styles.subtitle} testID="recommendations-screen-subtitle">
        Pick a weather and occasion to preview the recommendation flow before the ChromaDB connection is added.
      </Text>

      <View style={styles.selectorCard} testID="recommendations-weather-card">
        <Text style={styles.selectorLabel}>Weather</Text>
        <View style={styles.chipRow}>
          {WEATHER_OPTIONS.map((option) => {
            const active = option === weather;

            return (
              <Pressable
                key={option}
                onPress={() => setWeather(option)}
                style={[styles.chip, active && styles.chipActive]}
                testID={`recommendations-weather-${option.toLowerCase()}-button`}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.selectorCard} testID="recommendations-occasion-card">
        <Text style={styles.selectorLabel}>Occasion</Text>
        <View style={styles.chipRow}>
          {OCCASION_OPTIONS.map((option) => {
            const active = option === occasion;

            return (
              <Pressable
                key={option}
                onPress={() => setOccasion(option)}
                style={[styles.chip, active && styles.chipActive]}
                testID={`recommendations-occasion-${option.toLowerCase()}-button`}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.resultCard} testID="recommendations-result-card">
        <Text style={styles.resultTitle}>Starter picks for {weather.toLowerCase()} days</Text>
        <Text style={styles.resultBody} testID="recommendations-context-text">
          Occasion set to {occasion.toLowerCase()}. These are simple local matches that mirror the future recommendation flow.
        </Text>

        {recommendations.length === 0 ? (
          <View style={styles.emptyState} testID="recommendations-empty-state">
            <Text style={styles.emptyTitle}>Add more wardrobe items</Text>
            <Text style={styles.emptyBody}>You’ll see smarter outfit mixes here once you save a few garments.</Text>
            <Link href="/camera" asChild>
              <Pressable style={styles.primaryButton} testID="recommendations-add-item-button">
                <Text style={styles.primaryButtonText}>Go to Add Item</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View style={styles.list} testID="recommendations-list">
            {recommendations.slice(0, 4).map((item) => (
              <View key={item.id} style={styles.listItem} testID={`recommendations-item-${item.id}`}>
                <Image source={{ uri: item.image_url }} style={styles.listImage} />
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>{item.category}</Text>
                  <Text style={styles.listBody}>{item.tags.join(' • ')}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7F7F2', flex: 1 },
  content: { padding: 20, paddingBottom: 120 },
  eyebrow: { color: '#8A5A44', fontSize: 12, fontWeight: '700', letterSpacing: 1.6 },
  title: { color: '#18212F', fontSize: 34, fontWeight: '800', marginTop: 12 },
  subtitle: { color: '#546072', fontSize: 16, lineHeight: 24, marginTop: 12 },
  selectorCard: { backgroundColor: '#FFFFFF', borderRadius: 24, marginTop: 20, padding: 18 },
  selectorLabel: { color: '#18212F', fontSize: 18, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  chip: { backgroundColor: '#F2EEE8', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  chipActive: { backgroundColor: '#18212F' },
  chipText: { color: '#18212F', fontSize: 14, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },
  resultCard: { backgroundColor: '#18212F', borderRadius: 24, marginTop: 20, padding: 18 },
  resultTitle: { color: '#F5C66B', fontSize: 20, fontWeight: '700' },
  resultBody: { color: '#D2D7E0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  emptyState: { backgroundColor: '#101827', borderRadius: 18, marginTop: 18, padding: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  emptyBody: { color: '#D2D7E0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#8A5A44',
    borderRadius: 999,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  list: { gap: 12, marginTop: 18 },
  listItem: { alignItems: 'center', backgroundColor: '#101827', borderRadius: 18, flexDirection: 'row', gap: 12, padding: 10 },
  listImage: { borderRadius: 14, height: 84, width: 84 },
  listContent: { flex: 1 },
  listTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  listBody: { color: '#D2D7E0', fontSize: 13, lineHeight: 18, marginTop: 6, textTransform: 'capitalize' },
});