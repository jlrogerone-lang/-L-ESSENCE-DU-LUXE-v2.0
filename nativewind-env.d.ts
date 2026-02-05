/// <reference types="nativewind/types" />

// NativeWind v4 type declarations for L'Essence du Luxe
// This file enables TypeScript support for className prop on React Native components

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface FlatListProps<T> {
    className?: string;
    contentContainerClassName?: string;
  }
  interface SectionListProps<T, S> {
    className?: string;
    contentContainerClassName?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
}
