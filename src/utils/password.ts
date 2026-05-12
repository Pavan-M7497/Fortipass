/**
 * Secure password generation utility
 */

export function generatePassword(length: number = 16, options: {
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
} = {
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
}): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let chars = lowercase;
  if (options.includeUppercase) chars += uppercase;
  if (options.includeNumbers) chars += numbers;
  if (options.includeSymbols) chars += symbols;

  let password = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}
