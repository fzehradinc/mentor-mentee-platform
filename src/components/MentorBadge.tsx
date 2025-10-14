import React from 'react';
import { Check, Star, Award, BookOpen, TrendingUp } from 'lucide-react';

interface MentorBadgeProps {
  badgeSlug: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const BADGE_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  'top-mentor': {
    label: 'Top Mentor',
    icon: <Star className="h-3 w-3" />,
    color: '#FFD700',
    bgColor: '#FFD700/10',
    description: 'En yüksek puanlı ve deneyimli mentorlardan biri',
  },
  'verified': {
    label: 'Doğrulanmış',
    icon: <Check className="h-3 w-3" />,
    color: '#008C83',
    bgColor: '#008C83/10',
    description: 'Kimlik ve çalışma bilgileri doğrulandı',
  },
  'kurumsal-deneyim': {
    label: 'Kurumsal Deneyim',
    icon: <Award className="h-3 w-3" />,
    color: '#9333EA',
    bgColor: '#9333EA/10',
    description: 'Fortune 500 veya büyük kurumsal şirketlerde çalıştı',
  },
  'akademik-yayin': {
    label: 'Akademik Yayın',
    icon: <BookOpen className="h-3 w-3" />,
    color: '#2563EB',
    bgColor: '#2563EB/10',
    description: 'Q1/Q2 dergilerde yayınlanmış makaleleri var',
  },
  'yuksek-kabul': {
    label: 'Yüksek Kabul Oranı',
    icon: <TrendingUp className="h-3 w-3" />,
    color: '#10B981',
    bgColor: '#10B981/10',
    description: 'Danışanlarının %80+ hedeflerine ulaştı',
  },
};

export default function MentorBadge({ badgeSlug, size = 'md', showLabel = true }: MentorBadgeProps) {
  const config = BADGE_CONFIG[badgeSlug];

  if (!config) return null;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-2.5 py-1.5 text-xs gap-1.5',
    lg: 'px-3 py-2 text-sm gap-2',
  };

  return (
    <div
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizeClasses[size]}
      `}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
      title={config.description}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

// Çoklu badge gösterimi için yardımcı bileşen
interface MentorBadgesProps {
  badges: string[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MentorBadges({ badges, maxVisible = 3, size = 'sm' }: MentorBadgesProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleBadges.map((badge) => (
        <MentorBadge key={badge} badgeSlug={badge} size={size} />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-[#F6F3EB]/60 ml-1">+{remainingCount} daha</span>
      )}
    </div>
  );
}




