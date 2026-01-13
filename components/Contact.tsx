import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { DEFAULT_CONTACT_WEBHOOK_URL } from '../constants';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  // Note: webhook URL is now hardcoded from constants for security/usability
  const webhookUrl = DEFAULT_CONTACT_WEBHOOK_URL;
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    console.log("Tentative d'envoi vers:", webhookUrl);
    console.log("Données:", formData);

    try {
      // Envoi des données au Webhook en POST
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 'Accept': 'application/json' // Parfois nécessaire, parfois cause des erreurs CORS
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur n8n: ${response.status} ${response.statusText}`);
      }

      console.log("Succès:", response);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error: any) {
      console.error('Erreur d\'envoi:', error);
      
      // Gestion spécifique pour les URLs de test n8n
      if (webhookUrl.includes('webhook-test')) {
        setErrorMessage("Erreur : Pour une URL de test n8n, assurez-vous d'avoir cliqué sur 'Listen for Event' dans n8n avant d'envoyer.");
      } else if (error.message.includes('Failed to fetch')) {
        setErrorMessage("Erreur de connexion (CORS ou Réseau). Vérifiez que n8n est actif et accessible.");
      } else {
        setErrorMessage(error.message || "Une erreur est survenue lors de l'envoi.");
      }
      
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border-slate-300 border px-4 py-3 focus:border-primary-500 focus:ring-primary-500 transition-shadow outline-none";
  const labelClass = "block text-sm font-medium text-slate-700 mb-2";

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-slate-600">
            Une question sur l'outil ou une suggestion ? Notre équipe (ou notre robot) vous répondra dans les plus brefs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Contact Info Card */}
          <div className="bg-primary-900 rounded-2xl p-8 text-white shadow-xl h-fit">
            <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
            <p className="text-primary-100 mb-8 leading-relaxed">
              Remplissez le formulaire et votre demande sera traitée automatiquement par nos workflows n8n.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-primary-300 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-primary-100 text-sm mt-1 break-all">mandaniaina.randriambinitsoa@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-primary-300 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-white">Téléphone</h3>
                  <p className="text-primary-100 text-sm mt-1">+261 34 65 186 95</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary-300 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-white">Bureau</h3>
                  <p className="text-primary-100 text-sm mt-1">
                    Tananarive,<br />
                    Madagascar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-10">
              
              {status === 'success' ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
                  <p className="text-slate-600 max-w-md mx-auto mb-8">
                    Merci de nous avoir contactés. Votre message a bien été transmis à notre système d'automatisation.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-primary-600 font-medium hover:text-primary-800 underline underline-offset-4"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                  
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Échec de l'envoi</p>
                        <p>{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelClass}>Nom complet</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="jean@exemple.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelClass}>Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Demande d'information..."
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Comment pouvons-nous vous aider ?"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`
                        w-full md:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-primary-900 
                        shadow-md hover:bg-primary-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                        ${loading ? 'opacity-75 cursor-wait' : ''}
                      `}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="-ml-1 mr-2 h-5 w-5" />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;