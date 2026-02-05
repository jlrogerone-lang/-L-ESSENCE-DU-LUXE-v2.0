// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Le Nez (AI Scanner)
// Expo Router v4 - Perfume recognition via Gemini Vision
// ============================================================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { geminiService } from '@services/GeminiService';
import { useInventory } from '@hooks/useInventory';

type ScanResult = {
  name: string;
  brand: string;
  confidence: number;
  notes?: string[];
  description?: string;
};

export default function LeNezScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const { addPerfume } = useInventory();

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsScanning(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      if (photo?.base64) {
        setCapturedImage(photo.uri);
        await analyzeImage(photo.base64);
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      Alert.alert('Error', 'No se pudo capturar la imagen');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setIsScanning(true);
        setCapturedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setIsScanning(false);
    }
  };

  const analyzeImage = async (base64: string) => {
    try {
      const result = await geminiService.detectPerfumeFromImage(base64);

      if (result) {
        setScanResult(result);
      } else {
        Alert.alert(
          'No detectado',
          'No se pudo identificar un perfume en la imagen. Intenta con una foto más clara del frasco o etiqueta.'
        );
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Error de análisis',
        'No se pudo analizar la imagen. Verifica tu conexión a internet.'
      );
    }
  };

  const handleAddToCollection = () => {
    if (!scanResult) return;

    Alert.prompt(
      'Agregar a tu Cava',
      `¿Cuánto pagaste por "${scanResult.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar',
          onPress: (price) => {
            const pricePaid = parseFloat(price || '0');
            addPerfume({
              name: scanResult.name,
              brand: scanResult.brand,
              pricePaid: pricePaid || undefined,
              notes: scanResult.notes,
            });
            Alert.alert('Agregado', `"${scanResult.name}" ha sido agregado a tu Cava`);
            handleReset();
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const handleReset = () => {
    setScanResult(null);
    setCapturedImage(null);
  };

  // Permission not granted
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-oled-black items-center justify-center">
        <ActivityIndicator color="#D4AF37" size="large" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-oled-black">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 bg-dark-charcoal rounded-full items-center justify-center mb-6">
            <Ionicons name="camera-outline" size={48} color="#D4AF37" />
          </View>
          <Text className="text-white text-xl font-semibold text-center mb-2">
            Permiso de Cámara
          </Text>
          <Text className="text-text-secondary text-center mb-6">
            Le Nez necesita acceso a la cámara para escanear y reconocer perfumes
            mediante inteligencia artificial.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-luxe-gold px-6 py-3 rounded-full"
          >
            <Text className="text-black font-semibold">Permitir Acceso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show scan result
  if (scanResult) {
    return (
      <SafeAreaView className="flex-1 bg-oled-black">
        <View className="px-6 pt-4 pb-4">
          <Text className="text-luxe-gold text-3xl font-bold tracking-wider">
            Le Nez
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            Perfume detectado
          </Text>
        </View>

        <View className="flex-1 px-4">
          {/* Captured Image */}
          {capturedImage && (
            <View className="h-48 rounded-2xl overflow-hidden mb-4">
              <Image
                source={{ uri: capturedImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Result Card */}
          <LinearGradient
            colors={['#1A1A1A', '#0D0D0D']}
            className="rounded-2xl p-6 border border-luxe-gold/30"
          >
            <View className="flex-row items-center mb-4">
              <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
              <Text className="text-success text-sm font-semibold ml-2">
                DETECTADO ({Math.round(scanResult.confidence * 100)}% confianza)
              </Text>
            </View>

            <Text className="text-white text-2xl font-bold mb-1">
              {scanResult.name}
            </Text>
            <Text className="text-luxe-gold text-lg mb-4">
              {scanResult.brand}
            </Text>

            {scanResult.description && (
              <Text className="text-text-secondary mb-4">
                {scanResult.description}
              </Text>
            )}

            {scanResult.notes && scanResult.notes.length > 0 && (
              <View>
                <Text className="text-text-muted text-sm mb-2">NOTAS</Text>
                <View className="flex-row flex-wrap gap-2">
                  {scanResult.notes.map((note, index) => (
                    <View
                      key={index}
                      className="bg-dark-gray px-3 py-1.5 rounded-full"
                    >
                      <Text className="text-text-secondary text-sm">{note}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </LinearGradient>

          {/* Actions */}
          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 bg-dark-charcoal border border-dark-border py-4 rounded-xl items-center"
            >
              <Text className="text-text-secondary font-semibold">
                Escanear otro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddToCollection}
              className="flex-1 bg-luxe-gold py-4 rounded-xl items-center"
            >
              <Text className="text-black font-semibold">Agregar a Cava</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Camera view
  return (
    <SafeAreaView className="flex-1 bg-oled-black">
      <View className="px-6 pt-4 pb-4">
        <Text className="text-luxe-gold text-3xl font-bold tracking-wider">
          Le Nez
        </Text>
        <Text className="text-text-secondary text-sm mt-1">
          Escanea un perfume para identificarlo
        </Text>
      </View>

      <View className="flex-1 mx-4 rounded-2xl overflow-hidden">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        >
          {/* Scanning Overlay */}
          <View className="flex-1 items-center justify-center">
            <View className="w-64 h-64 border-2 border-luxe-gold/50 rounded-2xl">
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-luxe-gold rounded-tl-xl" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-luxe-gold rounded-tr-xl" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-luxe-gold rounded-bl-xl" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-luxe-gold rounded-br-xl" />
            </View>

            {isScanning && (
              <View className="absolute items-center">
                <ActivityIndicator color="#D4AF37" size="large" />
                <Text className="text-luxe-gold mt-3 font-semibold">
                  Analizando con Gemini AI...
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Controls */}
          <View className="absolute bottom-8 left-0 right-0 flex-row items-center justify-center gap-8">
            <TouchableOpacity
              onPress={handlePickImage}
              className="w-14 h-14 bg-dark-charcoal/80 rounded-full items-center justify-center"
              disabled={isScanning}
            >
              <Ionicons name="images" size={24} color="#E5E4E2" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCapture}
              className="w-20 h-20 bg-luxe-gold rounded-full items-center justify-center border-4 border-white"
              disabled={isScanning}
              activeOpacity={0.8}
            >
              <Ionicons name="scan" size={32} color="#000000" />
            </TouchableOpacity>

            <View className="w-14 h-14" />
          </View>
        </CameraView>
      </View>

      <View className="px-4 py-4">
        <Text className="text-text-muted text-center text-sm">
          Apunta la cámara al frasco o etiqueta del perfume
        </Text>
      </View>
    </SafeAreaView>
  );
}
