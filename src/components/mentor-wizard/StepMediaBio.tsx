import React, { useState } from 'react';
import { Camera, Video, FileText, Upload, Eye } from 'lucide-react';
import FormField from './FormField';
import MediaUploadModal from './MediaUploadModal';

interface MentorMediaBio {
  avatar_upload: string;
  cover_upload: string;
  video_intro_url: string;
  long_bio: string;
}

interface StepMediaBioProps {
  data: MentorMediaBio;
  onChange: (field: keyof MentorMediaBio, value: string) => void;
  errors: Record<string, string>;
}

/**
 * Step 5: Media uploads and detailed bio
 */
const StepMediaBio: React.FC<StepMediaBioProps> = ({ data, onChange, errors }) => {
  const [bioPreview, setBioPreview] = useState(false);
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    type: 'avatar' | 'cover' | 'video';
  }>({ isOpen: false, type: 'avatar' });

  const bioTemplate = `• **Deneyim Özeti**
8 yıldır [alan] alanında çalışıyorum. [Şirket/pozisyon] olarak [başarı/proje] gerçekleştirdim.

• **Odaklandığım Alanlar**
- [Alan 1]: [kısa açıklama]
- [Alan 2]: [kısa açıklama]
- [Alan 3]: [kısa açıklama]

• **Mentörlük Stilim**
"Göster → Yap → Geri Bildirim" yaklaşımıyla pratik odaklı mentörlük veriyorum.

• **Beklenti ve Çalışma Şeklim**
[Mentee'den beklentiler] ve [çalışma metodunuz] hakkında kısa bilgi.`;

  const handleFileUpload = (field: 'avatar_upload' | 'cover_upload', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a service and return URL
      const mockUrl = URL.createObjectURL(file);
      onChange(field, mockUrl);
    }
  };

  const validateVideoUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  const handleVideoUrlChange = (url: string) => {
    onChange('video_intro_url', url);
  };

  const handleUploadComplete = (url: string) => {
    if (uploadModal.type === 'avatar') {
      onChange('avatar_upload', url);
    } else if (uploadModal.type === 'cover') {
      onChange('cover_upload', url);
    }
    setUploadModal({ isOpen: false, type: 'avatar' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Medya & Bio
        </h2>
        <p className="text-gray-600">
          Görselleriniz ve hikayeniz mentee'leri ikna eder
        </p>
      </div>

      {/* Avatar Upload */}
      <FormField
        label="Profil Fotoğrafı"
        required
        error={errors.avatar_upload}
        helper="1:1 oran, minimum 600×600 piksel. Profesyonel ve güler yüzlü fotoğraf tercih edin."
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {data.avatar_upload ? (
              <div className="relative">
                <img
                  src={data.avatar_upload}
                  alt="Profil fotoğrafı önizleme"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => onChange('avatar_upload', '')}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <button
                type="button"
                onClick={() => setUploadModal({ isOpen: true, type: 'avatar' })}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors min-h-[44px] w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span>{data.avatar_upload ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}</span>
              </button>
            </div>
          </div>
        </div>
      </FormField>

      {/* Cover Upload */}
      <FormField
        label="Kapak Fotoğrafı"
        error={errors.cover_upload}
        helper="16:9 oran, minimum 1280×720 piksel. Çalışma ortamınız veya ilham veren bir görsel (opsiyonel)"
      >
        <div className="space-y-4">
          {data.cover_upload ? (
            <div className="relative">
              <img
                src={data.cover_upload}
                alt="Kapak fotoğrafı önizleme"
                className="w-full h-32 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={() => onChange('cover_upload', '')}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Kapak fotoğrafı yükle</p>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => setUploadModal({ isOpen: true, type: 'cover' })}
            className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px] w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            <span>{data.cover_upload ? 'Kapak Fotoğrafını Değiştir' : 'Kapak Fotoğrafı Yükle'}</span>
          </button>
        </div>
      </FormField>

      {/* Video Intro */}
      <FormField
        label="Tanıtım Videosu"
        error={errors.video_intro_url}
        helper="YouTube veya Vimeo linki (opsiyonel). Kısa tanıtım videosu mentee güvenini artırır."
      >
        <div className="relative">
          <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="url"
            value={data.video_intro_url}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.video_intro_url ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        
        {data.video_intro_url && validateVideoUrl(data.video_intro_url) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">✅ Geçerli video linki</p>
          </div>
        )}
      </FormField>

      {/* Long Bio */}
      <FormField
        label="Detaylı Tanıtım"
        required
        error={errors.long_bio}
        helper="Deneyiminiz, mentörlük yaklaşımınız ve mentee'lere nasıl değer katacağınız (400-1200 karakter)"
      >
        <div className="space-y-4">
          {/* Bio Template Button */}
          {!data.long_bio && (
            <button
              type="button"
              onClick={() => onChange('long_bio', bioTemplate)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Şablon kullan</span>
            </button>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={data.long_bio}
              onChange={(e) => onChange('long_bio', e.target.value)}
              placeholder="Deneyiminizi, mentörlük yaklaşımınızı ve mentee'lere nasıl değer katacağınızı detaylı olarak anlatın..."
              minLength={400}
              maxLength={1200}
              rows={12}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                errors.long_bio ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            
            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setBioPreview(!bioPreview)}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Character Count */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {data.long_bio.length < 400 ? `En az ${400 - data.long_bio.length} karakter daha` : 'Uygun uzunluk'}
            </span>
            <span className="text-xs text-gray-500">
              {data.long_bio.length}/1200
            </span>
          </div>

          {/* Bio Preview */}
          {bioPreview && data.long_bio && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Önizleme:</h4>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ 
                  __html: data.long_bio
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>')
                }}
              />
            </div>
          )}
        </div>
      </FormField>

      {/* Bio Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 İyi Bio Yazma İpuçları:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Somut başarılarınızı ve deneyimlerinizi paylaşın</li>
          <li>• Mentörlük yaklaşımınızı net olarak belirtin</li>
          <li>• Mentee'lere nasıl değer katacağınızı açıklayın</li>
          <li>• Kişisel hikayenizi ve motivasyonunuzu ekleyin</li>
          <li>• Samimi ama profesyonel bir ton kullanın</li>
        </ul>
      </div>

      {/* Media Upload Modal */}
      <MediaUploadModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ isOpen: false, type: 'avatar' })}
        mediaType={uploadModal.type}
        currentUrl={
          uploadModal.type === 'avatar' ? data.avatar_upload :
          uploadModal.type === 'cover' ? data.cover_upload :
          data.video_intro_url
        }
        onUploadComplete={handleUploadComplete}
        mentorId="mock-mentor-id"
      />
    </div>
  );
};

export default StepMediaBio;