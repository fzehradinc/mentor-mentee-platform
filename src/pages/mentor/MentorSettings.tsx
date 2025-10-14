"use client";
import React from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import { Settings } from 'lucide-react';

export default function MentorSettings() {
  return (
    <MentorLayout currentPage="settings">
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ayarlar</h3>
          <p className="text-gray-600">Bildirim ve tercih ayarları yakında eklenecek.</p>
        </div>
      </div>
    </MentorLayout>
  );
}


