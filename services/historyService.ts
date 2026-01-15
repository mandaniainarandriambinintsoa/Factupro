import { supabase } from '../lib/supabase';
import { InvoiceData, QuoteData, SavedInvoice, SavedQuote, LineItem } from '../types';

// Helper to calculate total
const calculateTotal = (items: LineItem[]): number => {
  return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
};

// Save invoice to history
export const saveInvoice = async (
  invoiceData: InvoiceData,
  pdfBase64?: string
): Promise<{ data: SavedInvoice | null; error: string | null }> => {
  if (!supabase) {
    return { data: null, error: 'Supabase non configuré' };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Utilisateur non connecté' };
  }

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      invoice_number: invoiceData.invoiceNumber,
      invoice_date: invoiceData.invoiceDate,
      due_date: invoiceData.dueDate || null,
      company_name: invoiceData.companyName,
      company_email: invoiceData.companyEmail,
      client_name: invoiceData.clientName,
      client_email: invoiceData.clientEmail,
      items: invoiceData.items,
      total: calculateTotal(invoiceData.items),
      currency: invoiceData.currency,
      pdf_base64: pdfBase64 || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving invoice:', error);
    return { data: null, error: error.message };
  }

  return {
    data: mapDbInvoice(data),
    error: null
  };
};

// Save quote to history
export const saveQuote = async (
  quoteData: QuoteData,
  pdfBase64?: string
): Promise<{ data: SavedQuote | null; error: string | null }> => {
  if (!supabase) {
    return { data: null, error: 'Supabase non configuré' };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Utilisateur non connecté' };
  }

  const { data, error } = await supabase
    .from('quotes')
    .insert({
      user_id: user.id,
      quote_number: quoteData.quoteNumber,
      quote_date: quoteData.quoteDate,
      validity_date: quoteData.validityDate,
      company_name: quoteData.companyName,
      company_email: quoteData.companyEmail,
      client_name: quoteData.clientName,
      client_email: quoteData.clientEmail,
      items: quoteData.items,
      total: calculateTotal(quoteData.items),
      currency: quoteData.currency,
      pdf_base64: pdfBase64 || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving quote:', error);
    return { data: null, error: error.message };
  }

  return {
    data: mapDbQuote(data),
    error: null
  };
};

// Get all invoices for current user
export const getInvoices = async (): Promise<{ data: SavedInvoice[]; error: string | null }> => {
  if (!supabase) {
    return { data: [], error: 'Supabase non configuré' };
  }

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return { data: [], error: error.message };
  }

  return {
    data: data.map(mapDbInvoice),
    error: null
  };
};

// Get all quotes for current user
export const getQuotes = async (): Promise<{ data: SavedQuote[]; error: string | null }> => {
  if (!supabase) {
    return { data: [], error: 'Supabase non configuré' };
  }

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quotes:', error);
    return { data: [], error: error.message };
  }

  return {
    data: data.map(mapDbQuote),
    error: null
  };
};

// Delete invoice
export const deleteInvoice = async (id: string): Promise<{ error: string | null }> => {
  if (!supabase) {
    return { error: 'Supabase non configuré' };
  }

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting invoice:', error);
    return { error: error.message };
  }

  return { error: null };
};

// Delete quote
export const deleteQuote = async (id: string): Promise<{ error: string | null }> => {
  if (!supabase) {
    return { error: 'Supabase non configuré' };
  }

  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting quote:', error);
    return { error: error.message };
  }

  return { error: null };
};

// Map database invoice to frontend type
const mapDbInvoice = (dbInvoice: any): SavedInvoice => ({
  id: dbInvoice.id,
  userId: dbInvoice.user_id,
  invoiceNumber: dbInvoice.invoice_number,
  invoiceDate: dbInvoice.invoice_date,
  dueDate: dbInvoice.due_date,
  companyName: dbInvoice.company_name,
  companyEmail: dbInvoice.company_email,
  clientName: dbInvoice.client_name,
  clientEmail: dbInvoice.client_email,
  items: dbInvoice.items,
  total: parseFloat(dbInvoice.total),
  currency: dbInvoice.currency,
  pdfBase64: dbInvoice.pdf_base64,
  createdAt: dbInvoice.created_at,
  updatedAt: dbInvoice.updated_at,
});

// Map database quote to frontend type
const mapDbQuote = (dbQuote: any): SavedQuote => ({
  id: dbQuote.id,
  userId: dbQuote.user_id,
  quoteNumber: dbQuote.quote_number,
  quoteDate: dbQuote.quote_date,
  validityDate: dbQuote.validity_date,
  companyName: dbQuote.company_name,
  companyEmail: dbQuote.company_email,
  clientName: dbQuote.client_name,
  clientEmail: dbQuote.client_email,
  items: dbQuote.items,
  total: parseFloat(dbQuote.total),
  currency: dbQuote.currency,
  pdfBase64: dbQuote.pdf_base64,
  createdAt: dbQuote.created_at,
  updatedAt: dbQuote.updated_at,
});
