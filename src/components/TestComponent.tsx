"use client";
import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          🚨 TEST COMPONENT ÇALIŞIYOR!
        </h1>
        <p className="text-gray-700 mb-4">
          Eğer bu mesajı görüyorsanız, React render ediliyor demektir.
        </p>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800 font-semibold">
            ✅ Beyaz ekran sorunu çözüldü!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;



