import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file:\n' +
    '  - EXPO_PUBLIC_SUPABASE_URL\n' +
    '  - EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// 创建平台特定的存储适配器
const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    // Web 平台使用 localStorage
    return {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return Promise.resolve(window.localStorage.getItem(key));
        }
        return Promise.resolve(null);
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return Promise.resolve();
      },
    };
  } else {
    // React Native 平台使用 AsyncStorage
    return AsyncStorage;
  }
};

const authOptions: SupabaseClientOptions<'public'>['auth'] = {
  storage: createStorageAdapter(),
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: Platform.OS === 'web',
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: authOptions,
});

