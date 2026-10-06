export function mapAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/missing-email":
      return "Please enter your email address.";
    case "auth/operation-not-allowed":
      return "This sign-in method is disabled in Firebase. Enable Email/Password and Google under Authentication → Sign-in method.";
    case "auth/unauthorized-domain":
      return "This site URL is not allowed. Add your Vercel domain under Authentication → Settings → Authorized domains.";
    default:
      return "Something went wrong. Please try again.";
  }
}
