"use client";
import React from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import { User } from 'lucide-react';

export default function MentorProfile() {
  return (
    <MentorLayout currentPage="profile">
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Profil Bilgilerim</h3>
          <p className="text-gray-600">Profil düzenleme özelliği yakında eklenecek.</p>
        </div>
      </div>
    </MentorLayout>
  );
}


