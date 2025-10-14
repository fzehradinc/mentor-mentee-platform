"use client";
import React from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import EmptyState from '../../components/mentee/EmptyState';
import { MessageSquare } from 'lucide-react';

export default function MentorMessages() {
  return (
    <MentorLayout currentPage="messages">
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <EmptyState
          icon={MessageSquare}
          title="Henüz mesaj yok"
          description="Mentee'lerinizle iletişime geçin, seans teklifleri gönderin."
        />
      </div>
    </MentorLayout>
  );
}


