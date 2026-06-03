import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabParamList = {
  Home:     undefined;
  Expenses: { category?: string } | undefined;
};

export type RootStackParamList = {
  BiometricLock: undefined;
  Main:          NavigatorScreenParams<TabParamList> | undefined;
  Settings:      undefined;
};

export type RootStackNavProp = NativeStackNavigationProp<RootStackParamList>;

export type BiometricLockScreenProps = NativeStackScreenProps<RootStackParamList, 'BiometricLock'>;
export type HomeScreenProps          = BottomTabScreenProps<TabParamList, 'Home'>;
export type ExpensesScreenProps      = BottomTabScreenProps<TabParamList, 'Expenses'>;
