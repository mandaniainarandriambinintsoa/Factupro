/**
 * Utilitaires de validation pour Factumation
 */

// Résultat de validation
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valide une adresse email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'L\'email est requis' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Format d\'email invalide' };
  }

  return { isValid: true };
};

/**
 * Valide un numéro de téléphone (format international ou local)
 */
export const validatePhone = (phone: string | undefined): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: true }; // Le téléphone est optionnel
  }

  // Accepte les formats: +33612345678, 0612345678, 06 12 34 56 78, etc.
  const phoneRegex = /^\+?[\d\s\-().]{8,20}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Format de téléphone invalide' };
  }

  return { isValid: true };
};

/**
 * Valide un numéro SIRET (14 chiffres pour la France)
 */
export const validateSiret = (siret: string | undefined): ValidationResult => {
  if (!siret || siret.trim() === '') {
    return { isValid: true }; // Le SIRET est optionnel
  }

  // Supprimer les espaces
  const cleanSiret = siret.replace(/\s/g, '');

  if (!/^\d{14}$/.test(cleanSiret)) {
    return { isValid: false, error: 'Le SIRET doit contenir 14 chiffres' };
  }

  // Vérification de la clé Luhn (algorithme de validation SIRET)
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleanSiret[i], 10);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Numéro SIRET invalide' };
  }

  return { isValid: true };
};

/**
 * Valide un numéro de TVA intracommunautaire (format FR)
 */
export const validateVatNumber = (vatNumber: string | undefined): ValidationResult => {
  if (!vatNumber || vatNumber.trim() === '') {
    return { isValid: true }; // Le numéro TVA est optionnel
  }

  // Format français: FR + 2 caractères + 9 chiffres (SIREN)
  const vatRegex = /^FR[0-9A-Z]{2}\d{9}$/i;
  if (!vatRegex.test(vatNumber.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Format de N° TVA invalide (ex: FR12345678901)' };
  }

  return { isValid: true };
};

/**
 * Valide un NIF (Numéro d'Identification Fiscale - Madagascar)
 */
export const validateNif = (nif: string | undefined): ValidationResult => {
  if (!nif || nif.trim() === '') {
    return { isValid: true }; // Le NIF est optionnel
  }

  // Le NIF malgache est généralement composé de chiffres
  if (!/^[\d\s-]{5,20}$/.test(nif)) {
    return { isValid: false, error: 'Format de NIF invalide' };
  }

  return { isValid: true };
};

/**
 * Valide un numéro STAT (Madagascar)
 */
export const validateStat = (stat: string | undefined): ValidationResult => {
  if (!stat || stat.trim() === '') {
    return { isValid: true }; // Le STAT est optionnel
  }

  // Le numéro STAT est généralement alphanumérique
  if (!/^[\w\s-]{5,30}$/.test(stat)) {
    return { isValid: false, error: 'Format de STAT invalide' };
  }

  return { isValid: true };
};

/**
 * Valide un nombre positif
 */
export const validatePositiveNumber = (
  value: number,
  fieldName: string
): ValidationResult => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: `${fieldName} doit être un nombre` };
  }

  if (value < 0) {
    return { isValid: false, error: `${fieldName} doit être positif` };
  }

  return { isValid: true };
};

/**
 * Valide qu'une chaîne n'est pas vide
 */
export const validateRequired = (
  value: string | undefined,
  fieldName: string
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} est requis` };
  }

  return { isValid: true };
};

/**
 * Valide une date (format ISO ou Date object)
 */
export const validateDate = (
  date: string | Date | undefined,
  fieldName: string
): ValidationResult => {
  if (!date) {
    return { isValid: false, error: `${fieldName} est requise` };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} invalide` };
  }

  return { isValid: true };
};

/**
 * Valide un IBAN (format basique)
 */
export const validateIban = (iban: string | undefined): ValidationResult => {
  if (!iban || iban.trim() === '') {
    return { isValid: true }; // L'IBAN est optionnel
  }

  // Supprimer les espaces et mettre en majuscules
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Vérifier le format de base (2 lettres + 2 chiffres + 11-30 caractères alphanumériques)
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(cleanIban)) {
    return { isValid: false, error: 'Format d\'IBAN invalide' };
  }

  return { isValid: true };
};

/**
 * Valide un BIC/SWIFT
 */
export const validateBic = (bic: string | undefined): ValidationResult => {
  if (!bic || bic.trim() === '') {
    return { isValid: true }; // Le BIC est optionnel
  }

  // Format BIC: 8 ou 11 caractères
  const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i;
  if (!bicRegex.test(bic.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Format de BIC invalide' };
  }

  return { isValid: true };
};

/**
 * Valide les éléments d'une facture/devis
 */
export const validateLineItems = (
  items: { quantity: number; unitPrice: number; name: string }[]
): ValidationResult => {
  if (!items || items.length === 0) {
    return { isValid: false, error: 'Au moins un article est requis' };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.name || item.name.trim() === '') {
      return { isValid: false, error: `Article ${i + 1}: le nom est requis` };
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return { isValid: false, error: `Article ${i + 1}: la quantité doit être positive` };
    }

    if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
      return { isValid: false, error: `Article ${i + 1}: le prix unitaire doit être positif ou nul` };
    }
  }

  return { isValid: true };
};

/**
 * Combine plusieurs résultats de validation
 */
export const combineValidations = (...results: ValidationResult[]): ValidationResult => {
  for (const result of results) {
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};
