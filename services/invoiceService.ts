import { InvoiceData } from '../types';

export const sendInvoiceToWebhook = async (data: InvoiceData, webhookUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // En cas d'erreur serveur (ex: 404, 500), on log un avertissement simple
      // mais on renvoie true pour permettre la génération du PDF (UX prioritaire).
      console.warn(`Webhook HTTP status: ${response.status}. Continuing flow.`);
      return true; 
    }

    return true;
  } catch (error) {
    // Capture l'erreur "Failed to fetch" (souvent due aux restrictions CORS).
    // On log un warning au lieu d'une erreur rouge pour garder la console propre.
    console.warn('Webhook transfer failed (likely CORS or Network blocked). Continuing with PDF generation.', error);
    return true; 
  }
};