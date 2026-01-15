/**
 * Service d'envoi d'emails via Edge Function Supabase (sécurisé)
 *
 * La clé API Brevo est stockée côté serveur dans les secrets Supabase.
 *
 * Configuration requise:
 * 1. Créer un compte sur https://www.brevo.com (gratuit, sans carte bancaire)
 * 2. Générer une clé API: https://app.brevo.com/settings/keys/api
 * 3. Ajouter la clé comme secret Supabase: BREVO_API_KEY
 *    - Via CLI: supabase secrets set BREVO_API_KEY=your-api-key
 *    - Via Dashboard: Project Settings > Edge Functions > Secrets
 */

import { InvoiceData, QuoteData } from '../types';
import { supabase } from '../lib/supabase';

// Edge Function URL
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`
  : null;

/**
 * Vérifie si le service email est configuré
 */
export const isBrevoConfigured = (): boolean => {
  // L'email est disponible si Supabase est configuré (Edge Function)
  return !!supabase && !!EDGE_FUNCTION_URL;
};

/**
 * Envoie un email via l'Edge Function Supabase
 */
const sendEmailViaEdgeFunction = async (
  type: 'invoice' | 'quote',
  data: {
    companyName: string;
    companyEmail: string;
    companyPhone?: string;
    clientName: string;
    clientEmail: string;
    documentNumber: string;
    documentDate: string;
    dueDate?: string;
    validityDate?: string;
    currency: string;
    paymentMethod?: string;
    items: { id: string; name: string; quantity: number; unitPrice: number }[];
  },
  pdfBase64: string
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase || !EDGE_FUNCTION_URL) {
    return {
      success: false,
      error: 'Service email non configuré. Veuillez configurer Supabase.',
    };
  }

  try {
    // Get the current session for authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      return {
        success: false,
        error: 'Vous devez être connecté pour envoyer des emails.',
      };
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        type,
        data,
        pdfBase64,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `Erreur HTTP ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur réseau',
    };
  }
};

/**
 * Envoie une facture par email avec PDF en pièce jointe
 */
export const sendInvoiceEmail = async (
  data: InvoiceData,
  pdfBase64: string
): Promise<{ success: boolean; error?: string }> => {
  return sendEmailViaEdgeFunction(
    'invoice',
    {
      companyName: data.companyName,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      documentNumber: data.invoiceNumber,
      documentDate: data.invoiceDate,
      dueDate: data.dueDate,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      items: data.items,
    },
    pdfBase64
  );
};

/**
 * Envoie un devis par email avec PDF en pièce jointe
 */
export const sendQuoteEmail = async (
  data: QuoteData,
  pdfBase64: string
): Promise<{ success: boolean; error?: string }> => {
  return sendEmailViaEdgeFunction(
    'quote',
    {
      companyName: data.companyName,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      documentNumber: data.quoteNumber,
      documentDate: data.quoteDate,
      validityDate: data.validityDate,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      items: data.items,
    },
    pdfBase64
  );
};
