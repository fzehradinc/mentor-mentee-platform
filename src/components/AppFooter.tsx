"use client";
import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center relative">
                <span className="text-white font-bold text-sm">B</span>
                {/* Küçük arı çizimi */}
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <svg viewBox="0 0 12 12" className="w-full h-full">
                    <circle cx="6" cy="4" r="2" fill="#FFD700" />
                    <circle cx="4" cy="3" r="1" fill="#FFD700" />
                    <circle cx="8" cy="3" r="1" fill="#FFD700" />
                    <path d="M6 6 L4 8 L6 10 L8 8 Z" fill="#FFD700" />
                    <path d="M2 4 L4 6" stroke="#FFA500" strokeWidth="0.5" />
                    <path d="M10 4 L8 6" stroke="#FFA500" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold">Bimentor</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Kariyer gelişiminde güvenilir rehberlik. Profesyonellerle bağlantı kur, 
              hedeflerine ulaş.
            </p>
            <div className="flex items-center text-gray-300">
              <Heart className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm">Türkiye'de güvenle</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Biz Kimiz
                </a>
              </li>
              <li>
                <a href="/mentors" className="text-gray-300 hover:text-white transition-colors">
                  Mentorlar
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  Nasıl Çalışır?
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Destek</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  İletişim
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  SSS
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Yardım Merkezi
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Yasal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  KVKK & Gizlilik
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Kullanım Koşulları
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Çerez Politikası
                </a>
              </li>
              <li>
                <a href="/security" className="text-gray-300 hover:text-white transition-colors">
                  Güvenlik
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center text-gray-300">
              <Mail className="w-5 h-5 mr-3" />
              <span>info@dimentor.com</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Phone className="w-5 h-5 mr-3" />
              <span>+90 (212) 555 0123</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-5 h-5 mr-3" />
              <span>İstanbul, Türkiye</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Bimentor. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
