function validatePassword(password) {
  if (!password || String(password).length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Password must include a letter and a number";
  return null;
}

module.exports = { validatePassword };
