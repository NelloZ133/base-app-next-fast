function isPasswordComplex(password: string): boolean {
  // Check if password is at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Check if password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check if password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check if password contains at least one digit
  if (!/\d/.test(password)) {
    return false;
  }

  // Check if password contains at least one special character
  if (!/[!@#$%^&*()\-_=+{};:,<.>/?\\|\[\]]/.test(password)) {
    return false;
  }

  // Check if password does not contain any common words or patterns
  const commonWords: string[] = ["Denso123"];
  for (const word of commonWords) {
    if (password.toLowerCase().includes(word)) {
      return false;
    }
  }

  return true;
}

export function validatePassword(
  password: string,
  confirmPassword: string
): { isValid: boolean; errorMessage?: string } {
  if (!password || !confirmPassword) {
    return { isValid: false, errorMessage: "Password and confirm password are required" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, errorMessage: "Password and confirm password do not match" };
  }

  if (!isPasswordComplex(password)) {
    return {
      isValid: false,
      errorMessage:
        "Password must contains at least 1 upper, 1 lower, 1 symbol, 1 number and must more than 8 characters",
    };
  }

  return { isValid: true };
}
