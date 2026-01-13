import React from 'react';
import { Mail, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} FactuPro. Tous droits réservés.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-primary-900 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-primary-900 transition-colors">
              <Github size={20} />
            </a>
            <a href="/contact" className="text-slate-400 hover:text-primary-900 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;