/*
 * At least one uppercase letter ((?=.*[A-Z]))
 * At least one lowercase letter ((?=.*[a-z]))
 * At least one digit ((?=.*\d))
 * At least one special character ((?=.*[!@#$%^&*()\-_=+{};:,<.>/?\\|\[\]]))
 * Does not contain the common word "Denso123" ((?!.*Denso123))
 * Must be at least 8 characters long (implicitly enforced by the .* at the end)
 */

function isPasswordComplex(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?\\|\[\]])(?!.*Denso123).*$/;

  return passwordRegex.test(password);
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
