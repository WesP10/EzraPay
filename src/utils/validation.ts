import { PasswordValidationResult, PasswordRequirements } from '../models/index.js';

export function validatePassword(password: string | undefined | null): PasswordValidationResult {
  if (!password) {
    return { 
      isValid: false, 
      requirements: {
        hasLowerCase: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false
      }
    };
  }

  const requirements: PasswordRequirements = {
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasMinLength: password.length >= 8
  };

  const isValid = Object.values(requirements).every(Boolean);
  return { isValid, requirements };
}
