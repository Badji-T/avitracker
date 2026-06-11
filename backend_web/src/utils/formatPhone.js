function formatPhone(raw) {
  const cleaned = raw.replace(/\s+/g, '').replace(/^00/, '+');
  if (cleaned.startsWith('+')) return cleaned;
  // Ajouter l'indicatif Mali par défaut si absent
  return `+223${cleaned.replace(/^0/, '')}`;
}

function isValidPhone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

module.exports = { formatPhone, isValidPhone };