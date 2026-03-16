import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useWardrobe } from '@/providers/wardrobe-store';

const CATEGORY_OPTIONS = ['top', 'bottom', 'outerwear', 'dress', 'footwear', 'accessory'];

export default function CameraScreen() {
  const { addWardrobeItem, setBodyProfile, userBodyProfile } = useWardrobe();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [captureMode, setCaptureMode] = useState<'wardrobe' | 'body'>('wardrobe');
  const [sourceMode, setSourceMode] = useState<'camera' | 'library'>('camera');
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const [category, setCategory] = useState('top');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedUri, setLastSavedUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (captureMode === 'body') {
      setCameraFacing('front');
    }
  }, [captureMode]);

  const saveImage = (imageUri: string) => {
    setIsSaving(true);

    if (captureMode === 'body') {
      setBodyProfile(imageUri);
    } else {
      addWardrobeItem({
        category,
        image_url: imageUri,
        tags: [category, 'captured-locally', sourceMode],
      });
    }

    setLastSavedUri(imageUri);
    setTimeout(() => setIsSaving(false), 250);
  };

  const openLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to import wardrobe images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      saveImage(result.assets[0].uri);
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

    if (photo?.uri) {
      saveImage(photo.uri);
    }
  };

  const renderPermissionState = () => {
    if (sourceMode !== 'camera') {
      return null;
    }

    if (!cameraPermission) {
      return (
        <View style={styles.permissionCard} testID="camera-loading-permission-card">
          <Text style={styles.permissionTitle}>Checking camera access…</Text>
        </View>
      );
    }

    if (!cameraPermission.granted) {
      return (
        <View style={styles.permissionCard} testID="camera-permission-card">
          <Text style={styles.permissionTitle}>Camera permission is required</Text>
          <Text style={styles.permissionBody}>
            Enable access to capture new garment photos or a body profile.
          </Text>
          <Pressable
            onPress={requestCameraPermission}
            style={styles.primaryButton}
            testID="camera-request-permission-button">
            <Text style={styles.primaryButtonText}>Allow camera</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.cameraWrap} testID="camera-preview-card">
        <CameraView facing={cameraFacing} mode="picture" ref={cameraRef} style={styles.camera} />
        <View style={styles.cameraToolbar}>
          <Pressable
            onPress={() => setCameraFacing((current) => (current === 'back' ? 'front' : 'back'))}
            style={styles.secondaryButton}
            testID="camera-flip-button">
            <Text style={styles.secondaryButtonText}>Flip</Text>
          </Pressable>
          <Pressable onPress={capturePhoto} style={styles.primaryButton} testID="camera-capture-button">
            <Text style={styles.primaryButtonText}>Capture</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen} testID="camera-screen">
      <Text style={styles.eyebrow} testID="camera-screen-label">
        CAMERA + GALLERY
      </Text>
      <Text style={styles.title} testID="camera-screen-title">
        Add Item
      </Text>
      <Text style={styles.subtitle} testID="camera-screen-subtitle">
        Capture a garment or choose a photo from your gallery. Switch to body profile mode when you want a base image for try-on.
      </Text>

      <View style={styles.segmentRow} testID="camera-capture-mode-group">
        <Pressable
          onPress={() => setCaptureMode('wardrobe')}
          style={[styles.segmentButton, captureMode === 'wardrobe' && styles.segmentButtonActive]}
          testID="camera-wardrobe-mode-button">
          <Text style={[styles.segmentText, captureMode === 'wardrobe' && styles.segmentTextActive]}>
            Clothing item
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCaptureMode('body')}
          style={[styles.segmentButton, captureMode === 'body' && styles.segmentButtonActive]}
          testID="camera-body-mode-button">
          <Text style={[styles.segmentText, captureMode === 'body' && styles.segmentTextActive]}>
            Body profile
          </Text>
        </Pressable>
      </View>

      <View style={styles.segmentRow} testID="camera-source-mode-group">
        <Pressable
          onPress={() => setSourceMode('camera')}
          style={[styles.segmentButton, sourceMode === 'camera' && styles.segmentButtonActive]}
          testID="camera-source-camera-button">
          <Text style={[styles.segmentText, sourceMode === 'camera' && styles.segmentTextActive]}>Use camera</Text>
        </Pressable>
        <Pressable
          onPress={() => setSourceMode('library')}
          style={[styles.segmentButton, sourceMode === 'library' && styles.segmentButtonActive]}
          testID="camera-source-library-button">
          <Text style={[styles.segmentText, sourceMode === 'library' && styles.segmentTextActive]}>
            Choose from library
          </Text>
        </Pressable>
      </View>

      {captureMode === 'wardrobe' ? (
        <View style={styles.categoryRow} testID="camera-category-group">
          {CATEGORY_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setCategory(option)}
              style={[styles.categoryChip, category === option && styles.categoryChipActive]}
              testID={`camera-category-${option}-button`}>
              <Text style={[styles.categoryText, category === option && styles.categoryTextActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.tipCard} testID="camera-body-tip-card">
          <Text style={styles.tipTitle}>Body profile guidance</Text>
          <Text style={styles.tipBody}>Stand centered, wear fitted clothing, and keep your full torso visible.</Text>
        </View>
      )}

      {sourceMode === 'library' ? (
        <View style={styles.permissionCard} testID="camera-library-card">
          <Text style={styles.permissionTitle}>Import from your photo library</Text>
          <Text style={styles.permissionBody}>
            Choose a clean image of a garment or your body profile to save it locally.
          </Text>
          <Pressable onPress={openLibrary} style={styles.primaryButton} testID="camera-open-library-button">
            <Text style={styles.primaryButtonText}>Open gallery</Text>
          </Pressable>
        </View>
      ) : (
        renderPermissionState()
      )}

      <View style={styles.statusCard} testID="camera-status-card">
        <Text style={styles.statusTitle}>{isSaving ? 'Saving locally…' : 'Ready to save'}</Text>
        <Text style={styles.statusBody} testID="camera-status-text">
          {captureMode === 'body'
            ? userBodyProfile
              ? 'Your body profile is updated and ready for the Try-On Studio.'
              : 'No body profile saved yet.'
            : 'Saved clothing items appear immediately in the Digital Wardrobe tab.'}
        </Text>
      </View>

      {lastSavedUri ? (
        <View style={styles.previewCard} testID="camera-last-saved-card">
          <Image source={{ uri: lastSavedUri }} style={styles.previewImage} testID="camera-last-saved-image" />
          <Text style={styles.previewLabel}>Most recent saved image</Text>
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
  segmentRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  segmentButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  segmentButtonActive: { backgroundColor: '#18212F' },
  segmentText: { color: '#18212F', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  segmentTextActive: { color: '#FFFFFF' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryChipActive: { backgroundColor: '#F5C66B' },
  categoryText: { color: '#18212F', fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  categoryTextActive: { color: '#18212F' },
  tipCard: { backgroundColor: '#FFF1D7', borderRadius: 22, marginTop: 18, padding: 16 },
  tipTitle: { color: '#18212F', fontSize: 16, fontWeight: '700' },
  tipBody: { color: '#546072', fontSize: 14, lineHeight: 20, marginTop: 8 },
  permissionCard: { backgroundColor: '#FFFFFF', borderRadius: 24, marginTop: 18, padding: 18 },
  permissionTitle: { color: '#18212F', fontSize: 18, fontWeight: '700' },
  permissionBody: { color: '#546072', fontSize: 14, lineHeight: 21, marginTop: 8 },
  cameraWrap: { backgroundColor: '#FFFFFF', borderRadius: 24, marginTop: 18, overflow: 'hidden', padding: 12 },
  camera: { borderRadius: 18, height: 320, overflow: 'hidden' },
  cameraToolbar: { flexDirection: 'row', gap: 10, marginTop: 12 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#8A5A44',
    borderRadius: 999,
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#E8E1D6',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryButtonText: { color: '#18212F', fontSize: 15, fontWeight: '700' },
  statusCard: { backgroundColor: '#18212F', borderRadius: 24, marginTop: 20, padding: 18 },
  statusTitle: { color: '#F5C66B', fontSize: 18, fontWeight: '700' },
  statusBody: { color: '#D2D7E0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  previewCard: { backgroundColor: '#FFFFFF', borderRadius: 24, marginTop: 18, padding: 12 },
  previewImage: { borderRadius: 18, height: 260, width: '100%' },
  previewLabel: { color: '#18212F', fontSize: 14, fontWeight: '600', marginTop: 12 },
});