import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useWardrobe } from '@/providers/wardrobe-store';

export default function TryOnScreen() {
  const { currentOutfit, setCurrentOutfit, userBodyProfile, userWardrobe } = useWardrobe();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedItem = useMemo(
    () => userWardrobe.find((item) => item.id === selectedItemId) ?? null,
    [selectedItemId, userWardrobe],
  );

  useEffect(() => {
    if (!selectedItemId && userWardrobe[0]) {
      setSelectedItemId(userWardrobe[0].id);
    }
  }, [selectedItemId, userWardrobe]);

  const generatePreview = () => {
    if (!userBodyProfile || !selectedItem) {
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setCurrentOutfit(userBodyProfile);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen} testID="try-on-screen">
      <Text style={styles.eyebrow} testID="try-on-screen-label">
        VIRTUAL TRY-ON STUDIO
      </Text>
      <Text style={styles.title} testID="try-on-screen-title">
        Studio
      </Text>
      <Text style={styles.subtitle} testID="try-on-screen-subtitle">
        This split workflow is ready for the VTON pipeline. For now, it lets you choose a base photo and garment before the backend connection is added.
      </Text>

      <View style={styles.previewPanel} testID="try-on-base-panel">
        <Text style={styles.panelLabel}>Top half · body profile</Text>
        {userBodyProfile ? (
          <Image source={{ uri: userBodyProfile }} style={styles.previewImage} testID="try-on-base-image" />
        ) : (
          <View style={styles.emptyPanel} testID="try-on-empty-base-state">
            <Text style={styles.emptyTitle}>No base photo yet</Text>
            <Text style={styles.emptyBody}>Save a body profile inside Add Item to prepare the try-on flow.</Text>
          </View>
        )}
      </View>

      <View style={styles.previewPanel} testID="try-on-wardrobe-panel">
        <Text style={styles.panelLabel}>Bottom half · wardrobe strip</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          <View style={styles.carouselTrack}>
            {userWardrobe.map((item) => {
              const active = item.id === selectedItemId;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedItemId(item.id)}
                  style={[styles.wardrobeTile, active && styles.wardrobeTileActive]}
                  testID={`try-on-wardrobe-item-${item.id}`}>
                  <Image source={{ uri: item.image_url }} style={styles.wardrobeImage} />
                  <Text style={styles.wardrobeLabel}>{item.category}</Text>
                </Pressable>
              );
            })}
            {userWardrobe.length === 0 ? (
              <View style={styles.emptyCarousel} testID="try-on-empty-wardrobe-state">
                <Text style={styles.emptyTitle}>Wardrobe is empty</Text>
                <Text style={styles.emptyBody}>Add a few clothing items to activate the lower selection strip.</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>

      <Pressable
        disabled={!selectedItem || !userBodyProfile || isGenerating}
        onPress={generatePreview}
        style={[styles.primaryButton, (!selectedItem || !userBodyProfile || isGenerating) && styles.primaryButtonDisabled]}
        testID="try-on-generate-button">
        <Text style={styles.primaryButtonText}>{isGenerating ? 'Generating preview…' : 'Generate local preview'}</Text>
      </Pressable>

      <View style={styles.statusCard} testID="try-on-status-card">
        <Text style={styles.statusTitle}>Selected garment</Text>
        <Text style={styles.statusBody} testID="try-on-selected-item-text">
          {selectedItem ? `${selectedItem.category} · ${selectedItem.tags.join(' • ')}` : 'Choose an item from the wardrobe strip.'}
        </Text>
      </View>

      {currentOutfit ? (
        <View style={styles.outputCard} testID="try-on-output-card">
          <Image source={{ uri: currentOutfit }} style={styles.outputImage} testID="try-on-output-image" />
          <Text style={styles.outputTitle}>Starter output ready</Text>
          <Text style={styles.outputBody}>The UI flow is ready. The next step will replace this local preview with the real VTON model response.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7F7F2', flex: 1 },
  content: { padding: 20, paddingBottom: 120 },
  eyebrow: { color: '#8A5A44', fontSize: 12, fontWeight: '700', letterSpacing: 1.6 },
  title: { color: '#18212F', fontSize: 34, fontWeight: '800', marginTop: 12 },
  subtitle: { color: '#546072', fontSize: 16, lineHeight: 24, marginTop: 12 },
  previewPanel: { backgroundColor: '#FFFFFF', borderRadius: 24, marginTop: 20, padding: 14 },
  panelLabel: { color: '#8A5A44', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: 12 },
  previewImage: { borderRadius: 18, height: 260, width: '100%' },
  emptyPanel: { alignItems: 'center', backgroundColor: '#F2EEE8', borderRadius: 18, minHeight: 220, justifyContent: 'center', padding: 24 },
  emptyTitle: { color: '#18212F', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyBody: { color: '#546072', fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  carousel: { marginTop: 4 },
  carouselTrack: { flexDirection: 'row', gap: 12 },
  wardrobeTile: { backgroundColor: '#F2EEE8', borderRadius: 18, padding: 10, width: 132 },
  wardrobeTileActive: { backgroundColor: '#F5C66B' },
  wardrobeImage: { borderRadius: 14, height: 150, width: '100%' },
  wardrobeLabel: { color: '#18212F', fontSize: 14, fontWeight: '700', marginTop: 10, textTransform: 'capitalize' },
  emptyCarousel: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, width: 280 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#8A5A44',
    borderRadius: 999,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonDisabled: { backgroundColor: '#C8B9AC' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  statusCard: { backgroundColor: '#18212F', borderRadius: 24, marginTop: 18, padding: 18 },
  statusTitle: { color: '#F5C66B', fontSize: 18, fontWeight: '700' },
  statusBody: { color: '#D2D7E0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  outputCard: { backgroundColor: '#FFFFFF', borderRadius: 24, marginTop: 18, padding: 14 },
  outputImage: { borderRadius: 18, height: 260, width: '100%' },
  outputTitle: { color: '#18212F', fontSize: 18, fontWeight: '700', marginTop: 12 },
  outputBody: { color: '#546072', fontSize: 14, lineHeight: 21, marginTop: 8 },
});