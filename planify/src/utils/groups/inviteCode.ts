
// Generate an invite code of a given length (default length is 6).
// This function will choose from the 26 letters and 10 digits to
// create an invite code by using random number generation.
export function generateInviteCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}