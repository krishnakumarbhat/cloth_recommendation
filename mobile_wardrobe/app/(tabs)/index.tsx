import { Link } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useWardrobe } from '@/providers/wardrobe-store';

export default function WardrobeScreen() {
  const { userBodyProfile, userWardrobe } = useWardrobe();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
      testID="wardrobe-screen">
      <Text style={styles.eyebrow} testID="wardrobe-screen-label">
        AI STYLING STARTER
      </Text>
      <Text style={styles.title} testID="wardrobe-screen-title">
        Digital Wardrobe
      </Text>
      <Text style={styles.subtitle} testID="wardrobe-screen-subtitle">
        Save clothing photos, keep a body profile ready, and build toward virtual try-on.
      </Text>

      <View style={styles.heroCard} testID="wardrobe-status-card">
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue} testID="wardrobe-item-count">
            {userWardrobe.length}
          </Text>
          <Text style={styles.metricLabel}>Items captured</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue} testID="body-profile-status">
            {userBodyProfile ? 'Ready' : 'Missing'}
          </Text>
          <Text style={styles.metricLabel}>Body profile</Text>
        </View>
      </View>

      <Link href="/camera" asChild>
        <Pressable style={styles.primaryButton} testID="wardrobe-add-item-button">
          <Text style={styles.primaryButtonText}>Capture or upload</Text>
        </Pressable>
      </Link>

      {userBodyProfile ? (
        <View style={styles.profileCard} testID="wardrobe-body-profile-card">
          <Image source={{ uri: userBodyProfile }} style={styles.profileImage} testID="wardrobe-body-profile-image" />
          <View style={styles.profileContent}>
            <Text style={styles.sectionTitle}>Body profile on file</Text>
            <Text style={styles.sectionBody}>Use this image as the base photo inside the Try-On Studio.</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} testID="wardrobe-grid-title">
          Garment library
        </Text>
        <Text style={styles.sectionCaption}>Grid view of your uploaded pieces.</Text>
      </View>

      {userWardrobe.length === 0 ? (
        <View style={styles.emptyState} testID="wardrobe-empty-state">
          <Text style={styles.emptyTitle}>No clothing items yet</Text>
          <Text style={styles.emptyBody}>
            Open Add Item to capture tops, bottoms, shoes, or a body profile.
          </Text>
        </View>
      ) : (
        <View style={styles.grid} testID="wardrobe-grid">
          {userWardrobe.map((item) => (
            <View key={item.id} style={styles.card} testID={`wardrobe-item-${item.id}`}>
              <Image source={{ uri: item.image_url }} style={styles.cardImage} testID={`wardrobe-image-${item.id}`} />
              <Text style={styles.cardTitle}>{item.category}</Text>
              <Text style={styles.cardTags} numberOfLines={2}>
                {item.tags.join(' • ')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7F7F2', flex: 1 },
  content: { padding: 20, paddingBottom: 120 },
  eyebrow: { color: '#8A5A44', fontSize: 12, fontWeight: '700', letterSpacing: 1.6 },
  title: { color: '#18212F', fontSize: 34, fontWeight: '800', marginTop: 12 },
  subtitle: { color: '#546072', fontSize: 16, lineHeight: 24, marginTop: 12 },
  heroCard: {
    backgroundColor: '#18212F',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 24,
    padding: 18,
  },
  metricBlock: { flex: 1 },
  metricValue: { color: '#F5C66B', fontSize: 30, fontWeight: '800' },
  metricLabel: { color: '#D2D7E0', fontSize: 13, marginTop: 6 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#8A5A44',
    borderRadius: 999,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 14,
    marginTop: 22,
    padding: 14,
  },
  profileImage: { borderRadius: 18, height: 96, width: 96 },
  profileContent: { flex: 1 },
  sectionHeader: { marginTop: 28 },
  sectionTitle: { color: '#18212F', fontSize: 20, fontWeight: '700' },
  sectionBody: { color: '#546072', fontSize: 14, lineHeight: 20, marginTop: 6 },
  sectionCaption: { color: '#546072', fontSize: 14, marginTop: 6 },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7DCD0',
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 14,
    padding: 24,
  },
  emptyTitle: { color: '#18212F', fontSize: 18, fontWeight: '700' },
  emptyBody: { color: '#546072', fontSize: 14, lineHeight: 21, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    width: '48%',
  },
  cardImage: { borderRadius: 18, height: 180, width: '100%' },
  cardTitle: { color: '#18212F', fontSize: 16, fontWeight: '700', marginTop: 10, textTransform: 'capitalize' },
  cardTags: { color: '#546072', fontSize: 13, lineHeight: 18, marginTop: 4, textTransform: 'capitalize' },
});
