import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image, Video, CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'avatar' | 'cover' | 'video';
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  mentorId: string;
}

/**
 * Media upload modal component for avatar, cover, and video uploads
 */
const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  mediaType,
  currentUrl,
  onUploadComplete,
  mentorId
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getMediaConfig = () => {
    switch (mediaType) {
      case 'avatar':
        return {
          title: 'Avatar Yükle',
          icon: <Camera className="w-8 h-8" />,
          motivation: 'İlk izlenim çok önemli 🌟',
          accept: 'image/jpeg,image/png,image/webp',
          maxSize: 2 * 1024 * 1024, // 2MB
          aspectRatio: '1:1',
          minDimensions: '400×400px',
          description: 'Kare format profil fotoğrafı'
        };
      case 'cover':
        return {
          title: 'Kapak Görseli Yükle',
          icon: <Image className="w-8 h-8" />,
          motivation: 'Kendi sahneni hazırla 🎨',
          accept: 'image/jpeg,image/png,image/webp',
          maxSize: 5 * 1024 * 1024, // 5MB
          aspectRatio: '16:9',
          minDimensions: '1280×720px',
          description: 'Geniş format kapak görseli'
        };
      case 'video':
        return {
          title: 'Tanıtım Videosu Yükle',
          icon: <Video className="w-8 h-8" />,
          motivation: 'Kendi hikayeni paylaş 🎥 (opsiyonel)',
          accept: 'video/mp4',
          maxSize: 200 * 1024 * 1024, // 200MB
          aspectRatio: '16:9',
          minDimensions: '720p+',
          description: 'MP4 format tanıtım videosu'
        };
      default:
        return null;
    }
  };

  const config = getMediaConfig();
  if (!config) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = async (file: File): Promise<string | null> => {
    // File size check
    if (file.size > config.maxSize) {
      return `Dosya çok büyük. Maksimum boyut: ${formatFileSize(config.maxSize)}`;
    }

    // File type check
    if (!config.accept.split(',').includes(file.type)) {
      return `Desteklenmeyen format. İzin verilen: ${config.accept.replace(/image\/|video\//g, '').toUpperCase()}`;
    }

    // Image dimension validation
    if (mediaType === 'avatar' || mediaType === 'cover') {
      try {
        const dimensions = await getImageDimensions(file);
        const minWidth = mediaType === 'avatar' ? 400 : 1280;
        const minHeight = mediaType === 'avatar' ? 400 : 720;

        if (dimensions.width < minWidth || dimensions.height < minHeight) {
          return `Görsel çok küçük. Minimum boyut: ${minWidth}×${minHeight}px`;
        }

        // Check aspect ratio for avatar (should be roughly square)
        if (mediaType === 'avatar') {
          const ratio = dimensions.width / dimensions.height;
          if (ratio < 0.8 || ratio > 1.2) {
            return 'Avatar için kare format (1:1) gerekli';
          }
        }

        // Check aspect ratio for cover (should be roughly 16:9)
        if (mediaType === 'cover') {
          const ratio = dimensions.width / dimensions.height;
          const targetRatio = 16 / 9;
          if (ratio < targetRatio - 0.3 || ratio > targetRatio + 0.3) {
            return 'Kapak için 16:9 format önerilir';
          }
        }
      } catch (err) {
        return 'Görsel dosyası okunamadı';
      }
    }

    return null;
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    const validationError = await validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      // Determine bucket based on media type
      const bucket = mediaType === 'avatar' ? 'mentor-avatars' : 'mentor-covers';

      // Create unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      setProgress(20);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Yükleme başarısız: ${uploadError.message}`);
      }

      setProgress(60);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('Dosya URL alınamadı');
      }

      setProgress(100);

      // Success - wait a moment to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      onUploadComplete(urlData.publicUrl);
      onClose();

    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Yükleme hatası';

      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'İnternet bağlantınızı kontrol edin';
        } else if (err.message.includes('size') || err.message.includes('large')) {
          errorMessage = 'Dosya çok büyük. Lütfen daha küçük bir dosya seçin';
        } else if (err.message.includes('type') || err.message.includes('format')) {
          errorMessage = 'Desteklenmeyen dosya formatı';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderPreview = () => {
    const url = previewUrl || currentUrl;
    if (!url) return null;

    if (mediaType === 'video') {
      return (
        <div className="relative">
          <video
            src={url}
            className="w-full h-48 object-cover rounded-lg"
            controls
            muted
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Video className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <img
          src={url}
          alt={`${mediaType} preview`}
          className={`object-cover rounded-lg ${
            mediaType === 'avatar' 
              ? 'w-32 h-32 rounded-full mx-auto' 
              : 'w-full h-48'
          }`}
        />
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {config.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-600">{config.motivation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current/Preview */}
          {(previewUrl || currentUrl) && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Önizleme:</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {renderPreview()}
                {selectedFile && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>Dosya:</strong> {selectedFile.name}</p>
                    <p><strong>Boyut:</strong> {formatFileSize(selectedFile.size)}</p>
                    <p><strong>Tip:</strong> {selectedFile.type}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Dosya Seç:</h4>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedFile ? selectedFile.name : 'Dosya seçin veya sürükleyin'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {config.description}
                  </p>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>💡 Format: {config.aspectRatio}</p>
                  <p>📏 Minimum: {config.minDimensions}</p>
                  <p>📦 Maksimum: {formatFileSize(config.maxSize)}</p>
                  <p>🎨 Desteklenen: {config.accept.replace(/image\/|video\//g, '').toUpperCase()}</p>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={config.accept}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium text-blue-900">Yükleniyor...</span>
                </div>
                
                <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-blue-800">
                  <span>{progress}% tamamlandı</span>
                  <span>
                    {mediaType === 'video' ? 'Video işleniyor...' : 
                     mediaType === 'avatar' ? 'Avatar işleniyor...' : 
                     'Görsel işleniyor...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Yükleme Başarısız</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                {selectedFile && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tekrar Dene</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {progress === 100 && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Yükleme Başarılı</h4>
                  <p className="text-sm text-green-700">
                    Dosyanız başarıyla yüklendi
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ready to Upload */}
          {!uploading && selectedFile && !error && progress === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Dosya Hazır</h4>
                  <p className="text-sm text-blue-700">
                    {selectedFile.name} yüklenmeye hazır
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {selectedFile && (
              <button
                onClick={handleRemove}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Değiştir</span>
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors min-h-[44px]"
            >
              İptal
            </button>
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Yükle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal;