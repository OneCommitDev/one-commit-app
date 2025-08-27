// cAppFunctions.ts

import { AcademicMajor } from "~/services/DataModals";
import messaging, { deleteToken, getMessaging, getToken } from '@react-native-firebase/messaging';
import { setItem } from "./storage";
import { PREF_KEYS } from "./Prefs";
import { getApp } from "@react-native-firebase/app";
import { Dimensions } from "react-native";
 

 /**
 * Converts height in inches to a string like `5'7`.
 * @param inches Total inches
 * @returns Formatted height like "5'7"
 */
export function formatInchesToFeetAndInches(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}`;
}

/**
 * Converts feet and inches string like `5'7` into total inches.
 * @param heightStr Format like "5'7" or "6'0"
 * @returns Total inches
 */
export function parseHeightToInches(heightStr: string): number {
  const match = heightStr.match(/(\d+)'(?:\s*(\d+))?/); // e.g. "5'6"
  if (!match) return 0;

  const feet = parseInt(match[1] || '0', 10);
  const inches = parseInt(match[2] || '0', 10);

  return feet * 12 + inches;
}

/**
 * Removes formatting and returns a clean phone number.
 * @param text Phone string
 * @returns Digits only
 */
export function cleanPhoneNumber(text: string): string {
  return text.replace(/\D/g, '');
}

/**
 * Formats a US phone number like (123) 456-7890.
 * @param text Phone number
 * @returns Formatted string
 */
export function formatUSPhoneNumber(text: string): string {
  const cleaned = text.replace(/\D/g, ''); // Remove non-digits
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return cleaned;

  const [, area, prefix, line] = match;
  if (prefix) {
    if (line) {
      return `(${area}) ${prefix}-${line}`;
    }
    return `(${area}) ${prefix}`;
  }
  if (area) return `(${area}`;
  return '';
}

// In AppFunctions.ts
export const autoformatUSPhoneNumber = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return cleaned;

  const [, area, prefix, line] = match;
  if (prefix) {
    if (line) {
      return `(${area}) ${prefix}-${line}`;
    }
    return `(${area}) ${prefix}`;
  }
  if (area) return `(${area}`;
  return '';
};


 
export function isAtLeast13YearsOld(date: Date): boolean {
  const today = new Date();
  const thirteenYearsAgo = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );
  return date <= thirteenYearsAgo;
}

 
 /*
 export const validateGPA = (
  value: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  // Allow numbers from 0 to 4.5 with up to 2 decimal places
  const regex = /^(?:[0-3](?:\.\d{1,2})?|4(?:\.([0-4]\d?|50?))?)?$/;

  if (value === '') {
    setErrors((e) => ({ ...e, unweighted_gpa: '' }));
    return;
  }

  if (!regex.test(value)) {
    setErrors((e) => ({
      ...e,
      unweighted_gpa: 'GPA must be between 0 and 4.5 (up to 2 decimal places)',
    }));
  } else {
    setErrors((e) => ({ ...e, unweighted_gpa: '' }));
  }
};
*/
export const validateGPA = (
  value: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  let fixedValue = value;

  // If user leaves just a trailing dot, auto-fix it
  if (fixedValue && fixedValue.endsWith(".")) {
    fixedValue = fixedValue + "0";
  }

  // Regex: allow 0–4.5 with up to 2 decimals
  const regex = /^(?:[0-3](?:\.\d{1,2})?|4(?:\.(?:[0-4]\d?|50?))?)$/;

  if (fixedValue === "") {
    setErrors((e) => ({ ...e, unweighted_gpa: "" }));
    return fixedValue;
  }

  if (!regex.test(fixedValue)) {
    setErrors((e) => ({
      ...e,
      unweighted_gpa: "GPA must be between 0 and 4.5 (up to 2 decimal places)",
    }));
  } else {
    setErrors((e) => ({ ...e, unweighted_gpa: "" }));
  }

  return fixedValue;
};



// ~/utils/formValidators.ts
/*
 export const validateScore = (
  value: string,
  type: 'SAT' | 'ACT',
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  console.log('value_value', value);
  console.log('type_type', type);

  const score = parseInt(value, 10);
  const isValid =
    type === 'SAT' ? score > 0 && score <= 1600 : score > 0 && score <= 36;

  if (value === '' || !/^\d{1,4}$/.test(value) || !isValid) {
    setErrors((e) => ({
      ...e,
      test_score:
        type === 'SAT'
          ? 'SAT score must be a number ≤ 1600'
          : 'ACT score must be a number ≤ 36',
    }));
  } else {
    setErrors((e) => ({ ...e, test_score: '' }));
  }
};
*/




 // SAT validator
export const validateSATScore = (
  value: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  const score = parseInt(value, 10);
  const isValid = score > 0 && score <= 1600;

  if (value === '' || !/^\d{1,4}$/.test(value) || !isValid) {
    setErrors((e) => ({
      ...e,
      sat_score: 'SAT score must be a number ≤ 1600',
    }));
  } else {
    setErrors((e) => ({ ...e, sat_score: '' }));
  }
};

// ACT validator
export const validateACTScore = (
  value: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  const score = parseInt(value, 10);
  const isValid = score > 0 && score <= 36;

  if (value === '' || !/^\d{1,2}$/.test(value) || !isValid) {
    setErrors((e) => ({
      ...e,
      act_score: 'ACT score must be a number ≤ 36',
    }));
  } else {
    setErrors((e) => ({ ...e, act_score: '' }));
  }
};


// Optional wrapper if you still want a single entry point
export const validateScore = (
  value: string,
  type: 'SAT' | 'ACT',
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  if (type === 'SAT') {
    return validateSATScore(value, setErrors);
  } else {
    return validateACTScore(value, setErrors);
  }
};



  // const validateGPA = (value: string) => {
  //   const regex = /^(?:[0-3](?:\.\d)?|4(?:\.[0-4])?|4\.5)?$/;
  //   if (value === '') {
  //     setErrors((e) => ({ ...e, unweighted_gpa: '' }));
  //     return;
  //   }
  //   if (!regex.test(value)) {
  //     setErrors((e) => ({
  //       ...e,
  //       unweighted_gpa: 'GPA must be between 0 and 4.5 (1 decimal max)',
  //     }));
  //   } else {
  //     setErrors((e) => ({ ...e, unweighted_gpa: '' }));
  //   }
  // };

  // const validateScore = (value: string, type: 'SAT' | 'ACT') => {
  //   const score = parseInt(value, 10);
  //   const isValid = type === 'SAT' ? score <= 1600 : score <= 36;

  //   if (value === '' || !/^\d{1,4}$/.test(value) || !isValid) {
  //     setErrors((e) => ({
  //       ...e,
  //       test_score:
  //         type === 'SAT' ? 'SAT score must be a number ≤ 1600' : 'ACT score must be a number ≤ 36',
  //     }));
  //   } else {
  //     setErrors((e) => ({ ...e, test_score: '' }));
  //   }
  // };


type SetMajorsFn = React.Dispatch<React.SetStateAction<{ search: string; showList: boolean }[]>>;
type HandleChangeFn = (key: string, value: string) => void;

  export const setMajorFromAPI = (
  majorId: string | undefined,
  index: number,
  majorList: AcademicMajor[],
  setMajors: SetMajorsFn,
  handleChange: HandleChangeFn
) => {
  if (!majorId) return;
  const found = majorList.find((m) => m.id === majorId);
  if (found) {
    setMajors((prev) => {
      const updated = [...prev];
      updated[index].search = found.display_name;
      return updated;
    });
    handleChange(`intended_major_${index + 1}`, found.id);
  }
};




 
export async function resetFCMToken() {
  try {
    // 1. Delete current token
        const app = getApp();
        const messaging = getMessaging(app);

        // Delete token
        await deleteToken(messaging);
    console.log('🗑️ FCM token deleted');

    // 2. Re-generate new token
const newToken = await getToken(messaging);
    console.log('🔁 New FCM token:', newToken);
    setItem(PREF_KEYS.fcmToken , newToken);

    // (Optional) Save newToken to your server or local storage
    return newToken;
  } catch (error) {
    console.error('❌ Error resetting FCM token:', error);
  }
}


export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    await setItem(PREF_KEYS.fcmToken, token); // ensure async storage is awaited
    return token; // ✅ Return token on success
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null; // ✅ Return null on failure
  }
}



   
 


 