// Define the structure for individual error entries
export type AuthErrorCode = {
  code: string;
  message: string;
};

// Define all valid error code keys (for autocompletion + type safety)
export type AuthErrorKey =
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_SUSPENDED"
  | "ACCOUNT_INACTIVE"
  | "INVALID_INPUT"
  | "EMAIL_ALREADY_EXISTS"
  | "OAUTH_SIGNUP_NOT_ALLOWED"
  | "TOO_MANY_REQUESTS"
  | "ERROR";

// Final object with strong typing
export const AuthErrorCodes: Record<AuthErrorKey, AuthErrorCode> = {
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password combination.",
  },
  ACCOUNT_SUSPENDED: {
    code: "ACCOUNT_SUSPENDED",
    message:
      "Your account is suspended until further notice because of engaging in abuse/suspicious activities.",
  },
  ACCOUNT_INACTIVE: {
    code: "ACCOUNT_INACTIVE",
    message:
      "Your account is currently inactive. Please contact support to reactivate it.",
  },
  INVALID_INPUT: {
    code: "INVALID_INPUT",
    message: "Invalid input. Please check your email and password.",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    message: "This email is already registered. Try logging in instead.",
  },
  OAUTH_SIGNUP_NOT_ALLOWED: {
    code: "OAUTH_SIGNUP_NOT_ALLOWED",
    message: "You are not allowed to sign up using this method.",
  },
  TOO_MANY_REQUESTS: {
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests, please try again later.",
  },
  ERROR: {
    code: "ERROR",
    message: "Something went wrong, please try again later.",
  },
};
