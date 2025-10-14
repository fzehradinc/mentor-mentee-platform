"use client";
import React from 'react';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';

interface BookingBadgeProps {
  status: BookingStatus;
}

export default function BookingBadge({ status }: BookingBadgeProps) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    canceled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const labels = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    completed: 'Tamamlandı',
    canceled: 'İptal'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}


