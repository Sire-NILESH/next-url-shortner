import { AuthErrorKey } from "@/lib/auth/errors/auth-error-codes";
import { CredentialsSignin } from "next-auth";

export default class InvalidLoginError extends CredentialsSignin {
  code: AuthErrorKey = "INVALID_CREDENTIALS";
  constructor(message: AuthErrorKey) {
    super(message);
    this.code = message;
  }
}
