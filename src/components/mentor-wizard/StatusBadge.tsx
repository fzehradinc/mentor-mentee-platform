import React from 'react';
import { Clock, Eye, CheckCircle } from 'lucide-react';

type ProfileStatus = 'draft' | 'review' | 'published';

interface StatusBadgeProps {
  status: ProfileStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs = {
    draft: {
      label: 'Taslak',
      icon: Clock,
      colors: {
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        text: 'text-amber-700',
        iconColor: 'text-amber-600'
      },
      description: 'Bazı bilgiler eksik'
    },
    review: {
      label: 'İnceleme Bekliyor',
      icon: Eye,
      colors: {
        bg: 'bg-sky-50',
        border: 'border-sky-600',
        text: 'text-sky-700',
        iconColor: 'text-sky-600'
      },
      description: 'Ekibimiz kontrol ediyor'
    },
    published: {
      label: 'Yayında',
      icon: CheckCircle,
      colors: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-600',
        text: 'text-emerald-700',
        iconColor: 'text-emerald-600'
      },
      description: 'Profilin görünür'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5'
    }
  };

  return (
    <div
      className={`inline-flex items-center space-x-2 ${config.colors.bg} ${config.colors.border} border-2 ${config.colors.text} rounded-full font-medium ${sizeClasses[size].container}`}
      role="status"
      aria-label={`Profil durumu: ${config.label}`}
    >
      <Icon className={`${config.colors.iconColor} ${sizeClasses[size].icon}`} />
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;
