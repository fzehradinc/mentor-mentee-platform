"use client";
import React from 'react';
import { Clock, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  price_cents: number;
  currency: string;
  is_active: boolean;
  first_session_discount_percent?: number;
}

interface ServiceCardProps {
  service: Service;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}

export default function ServiceCard({ service, onEdit, onDelete, onToggle }: ServiceCardProps) {
  return (
    <div className={`bg-white rounded-xl border-2 p-6 transition-all ${
      service.is_active ? 'border-green-200 bg-green-50/50' : 'border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.title}</h3>
          {service.description && (
            <p className="text-sm text-gray-600">{service.description}</p>
          )}
        </div>
        <button
          onClick={() => onToggle(service.id, !service.is_active)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={service.is_active ? 'Devre dışı bırak' : 'Aktif et'}
        >
          {service.is_active ? (
            <ToggleRight className="w-5 h-5 text-green-600" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{service.duration_minutes} dk</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          {(service.price_cents / 100).toFixed(0)} {service.currency}
        </div>
      </div>

      {service.first_session_discount_percent && service.first_session_discount_percent > 0 && (
        <div className="mb-4 inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
          İlk seans %{service.first_session_discount_percent} indirim
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(service.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Düzenle
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="px-3 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


