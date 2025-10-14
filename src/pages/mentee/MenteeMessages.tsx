"use client";
import React from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import EmptyState from '../../components/mentee/EmptyState';
import { MessageSquare } from 'lucide-react';

export default function MenteeMessages() {
  return (
    <MenteeLayout currentPage="messages">
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <EmptyState
          icon={MessageSquare}
          title="Henüz mesaj yok"
          description="Bir sohbet başlatın; mentörünüzle iletişime geçin."
          action={{ label: 'Mentörlerimi Gör', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-mentors' })) }}
        />
      </div>
    </MenteeLayout>
  );
}


