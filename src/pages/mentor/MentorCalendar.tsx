"use client";
import React from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import EmptyState from '../../components/mentee/EmptyState';
import { Calendar } from 'lucide-react';

export default function MentorCalendar() {
  return (
    <MentorLayout currentPage="calendar">
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <EmptyState
          icon={Calendar}
          title="Takvim ve Uygunluk Yönetimi"
          description="Uygunluk saatlerinizi ekleyin, randevularınızı görüntüleyin."
          action={{ label: 'Uygunluk Ekle', onClick: () => alert('Uygunluk ekleme özelliği yakında') }}
        />
      </div>
    </MentorLayout>
  );
}


