// storage.ts (new)
import * as SecureStore from 'expo-secure-store';

export const setItem = async (key: string, value: string | number | boolean | object) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  await SecureStore.setItemAsync(key, stringValue);
};


export const getItem = async (key: string): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};
export const removeItem = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
