"use client";
import React, { useState, useEffect } from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import ServiceCard from '../../components/mentor/ServiceCard';
import EmptyState from '../../components/mentee/EmptyState';
import { Briefcase, Plus } from 'lucide-react';
import { getServices, createService, deleteService, toggleService } from '../../lib/actions/mentorAreaActions';

export default function MentorServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Load services error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    alert('Hizmet düzenleme özelliği yakında eklenecek');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    
    try {
      await deleteService(id);
      loadServices();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await toggleService(id, active);
      loadServices();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <MentorLayout currentPage="services">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout currentPage="services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hizmetlerim</h2>
            <p className="text-gray-600">Seans paketlerinizi yönetin</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Yeni Hizmet
          </button>
        </div>

        {services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon={Briefcase}
              title="Henüz hizmet yok"
              description="İlk seans paketinizi oluşturun. Mentee'ler size kolayca ulaşsın."
              action={{ label: 'İlk Hizmetini Oluştur', onClick: () => setIsCreating(true) }}
            />
          </div>
        )}
      </div>
    </MentorLayout>
  );
}


