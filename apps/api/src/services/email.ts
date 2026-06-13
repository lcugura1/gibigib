export async function sendPasswordResetEmail(email: string, code: string) {
  console.log(`[email] Password reset code for ${email}: ${code}`);
}
