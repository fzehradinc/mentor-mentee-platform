"use client";
import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Efe',
      role: 'Girişimci',
      quote: 'Mentor desteğiyle 3 ayda ilk ürünümü çıkardım.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Selin',
      role: 'Yazılım Geliştirici',
      quote: 'Yurt dışı başvurularında yönlendirme bana büyük zaman kazandırdı.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Elif',
      role: 'Mentor',
      quote: 'Mentorluk vermek hem öğretici hem ilham verici.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Gerçek Hikâyeler, Gerçek Sonuçlar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bimentor topluluğumuzdan gerçek başarı hikayeleri
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-blue-500" />
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1.200+</div>
              <div className="text-blue-100">Uzman Mentor</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">20.000+</div>
              <div className="text-blue-100">Başarılı Eşleşme</div>
            </div>
            <div>
              <div className="flex items-center justify-center text-3xl font-bold mb-2">
                <Star className="w-8 h-8 text-yellow-400 fill-current mr-1" />
                4.9
              </div>
              <div className="text-blue-100">Ortalama Puan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
