import React from 'react';

interface Avatar {
  id: string;
  name: string;
  imageUrl?: string;
}

interface AvatarStripProps {
  avatars?: Avatar[];
  communityText?: string;
  maxVisible?: number;
}

const AvatarStrip: React.FC<AvatarStripProps> = ({
  avatars = [],
  communityText = "35.000+ kişi MentorHub'da",
  maxVisible = 8
}) => {
  // Default avatars if none provided
  const defaultAvatars: Avatar[] = [
    { id: '1', name: 'Ahmet Kaya', imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60' },
    { id: '2', name: 'Fatma Yıldız', imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=60' },
    { id: '3', name: 'Zeynep Demir', imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60' },
    { id: '4', name: 'Mehmet Özkan', imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60' },
    { id: '5', name: 'Ayşe Kılıç', imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60' },
    { id: '6', name: 'Can Yılmaz', imageUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60' },
    { id: '7', name: 'Elif Kaya' },
    { id: '8', name: 'Burak Demir' }
  ];

  const displayAvatars = avatars.length > 0 ? avatars : defaultAvatars;
  const visibleAvatars = displayAvatars.slice(0, maxVisible);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColors = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center space-y-4" data-testid="avatar-strip">
      {/* Avatar Row */}
      <div className="flex items-center -space-x-2">
        {visibleAvatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className="relative w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden transition-transform hover:scale-110 hover:z-10"
            title={avatar.name}
          >
            {avatar.imageUrl ? (
              <img
                src={avatar.imageUrl}
                alt={avatar.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full ${getAvatarColors(index)} flex items-center justify-center text-white text-sm font-semibold">
                        ${getInitials(avatar.name)}
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className={`w-full h-full ${getAvatarColors(index)} flex items-center justify-center text-white text-sm font-semibold`}>
                {getInitials(avatar.name)}
              </div>
            )}
          </div>
        ))}
        
        {displayAvatars.length > maxVisible && (
          <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-600 text-sm font-semibold">
            +{displayAvatars.length - maxVisible}
          </div>
        )}
      </div>

      {/* Community Text */}
      <p className="text-sm text-gray-600 font-medium">
        {communityText}
      </p>
    </div>
  );
};

export default AvatarStrip;