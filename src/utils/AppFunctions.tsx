// cAppFunctions.ts

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

 
