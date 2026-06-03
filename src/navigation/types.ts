import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  BiometricLock: undefined;
  Home: undefined;
};

export type RootStackNavProp = NativeStackNavigationProp<RootStackParamList>;

export type BiometricLockScreenProps = NativeStackScreenProps<RootStackParamList, 'BiometricLock'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
