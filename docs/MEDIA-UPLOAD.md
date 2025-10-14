# MentorHub - Media Upload API Dokümantasyonu

## 📸 Genel Bakış

MentorHub mentor profil medya yükleme sistemi, mentorların avatar, kapak görseli ve tanıtım videosu yüklemelerini güvenli ve verimli şekilde yönetir.

## 🔄 Upload Akışı

### 1. Presigned URL Alma
```bash
# Avatar için upload URL al
curl -X POST https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/media/avatar-upload-url \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "image/jpeg",
    "file_size": 2048576
  }'

# Response
{
  "upload_url": "https://s3.amazonaws.com/bucket/mentors/c9b2e8f4/avatar.jpg?X-Amz-Signature=...",
  "expires_at": "2025-10-02T12:15:00Z",
  "upload_id": "upload_c9b2e8f4_avatar_1696248900"
}
```

### 2. Dosya Yükleme
```bash
# Dosyayı doğrudan storage'a yükle
curl -X PUT "https://s3.amazonaws.com/bucket/mentors/c9b2e8f4/avatar.jpg?X-Amz-Signature=..." \
  -H "Content-Type: image/jpeg" \
  --data-binary @avatar.jpg
```

### 3. URL Commit
```bash
# İşlenen URL'yi profile kaydet
curl -X PATCH https://api.mentorhub.com/v1/mentors/c9b2e8f4-1234-5678-9abc-def012345678/media/commit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "avatar_url": "https://cdn.mentorhub.com/avatars/c9b2e8f4.webp"
  }'

# Response
{
  "success": true,
  "message": "Media URLs updated successfully",
  "updated_at": "2025-10-02T12:00:00Z"
}
```

## 📋 Medya Türleri ve Kuralları

### Avatar (Profil Fotoğrafı)
- **Format**: JPG, PNG, WebP
- **Boyut**: Maksimum 2MB
- **Aspect Ratio**: 1:1 (kare)
- **Minimum Çözünürlük**: 400×400px
- **İşleme**: Otomatik crop ve resize
- **Zorunluluk**: Zorunlu

### Cover (Kapak Görseli)
- **Format**: JPG, PNG, WebP
- **Boyut**: Maksimum 5MB
- **Aspect Ratio**: 16:9
- **Minimum Çözünürlük**: 1280×720px
- **İşleme**: Otomatik crop ve resize
- **Zorunluluk**: Opsiyonel

### Video (Tanıtım Videosu)
- **Format**: MP4
- **Boyut**: Maksimum 200MB
- **Süre**: 15 saniye - 120 saniye
- **Çözünürlük**: Minimum 720p
- **İşleme**: Transcoding (HLS + MP4)
- **Zorunluluk**: Opsiyonel

## 🔐 Authentication

### JWT Token Gereklilikleri
```javascript
// JWT Payload örneği
{
  "sub": "user123",
  "role": "mentor",
  "mentor_id": "c9b2e8f4-1234-5678-9abc-def012345678",
  "iat": 1696248900,
  "exp": 1696252500
}
```

### Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Endpoint Detayları

### POST /mentors/{id}/media/avatar-upload-url
**Amaç**: Avatar yükleme için presigned URL oluşturur

**Request Body**:
```json
{
  "content_type": "image/jpeg",
  "file_size": 2048576
}
```

**Response (200)**:
```json
{
  "upload_url": "https://s3.amazonaws.com/bucket/mentors/c9b2e8f4/avatar.jpg?...",
  "expires_at": "2025-10-02T12:15:00Z",
  "upload_id": "upload_c9b2e8f4_avatar_1696248900"
}
```

**Hata Durumları**:
- `400` - Dosya çok büyük (>2MB)
- `415` - Desteklenmeyen format
- `401` - Token eksik/geçersiz
- `403` - Mentor sahibi değil

### POST /mentors/{id}/media/cover-upload-url
**Amaç**: Kapak görseli yükleme için presigned URL oluşturur

**Request Body**:
```json
{
  "content_type": "image/png",
  "file_size": 4194304
}
```

**Validation**:
- Maksimum 5MB
- JPG/PNG/WebP formatları
- 16:9 aspect ratio kontrolü

### POST /mentors/{id}/media/video-upload-url
**Amaç**: Tanıtım videosu yükleme için presigned URL oluşturur

**Request Body**:
```json
{
  "content_type": "video/mp4",
  "file_size": 52428800
}
```

**Validation**:
- Maksimum 200MB
- Sadece MP4 format
- 15-120 saniye süre kontrolü

### PATCH /mentors/{id}/media/commit
**Amaç**: İşlenen medya URL'lerini mentor profiline kaydeder

**Request Body**:
```json
{
  "avatar_url": "https://cdn.mentorhub.com/avatars/c9b2e8f4.webp",
  "cover_url": "https://cdn.mentorhub.com/covers/c9b2e8f4.webp",
  "video_intro_url": "https://cdn.mentorhub.com/videos/c9b2e8f4.mp4"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Media URLs updated successfully",
  "updated_at": "2025-10-02T12:00:00Z"
}
```

## 🔧 İşleme Pipeline

### Avatar İşleme
1. **Upload**: Presigned URL ile S3'e yükleme
2. **Validation**: Boyut ve format kontrolü
3. **Processing**: 
   - 1:1 aspect ratio crop
   - Multiple size generation (400x400, 200x200, 100x100)
   - WebP conversion
4. **CDN**: İşlenen dosyalar CDN'e deploy
5. **Commit**: Final URL mentor profiline kaydedilir

### Cover İşleme
1. **Upload**: Presigned URL ile yükleme
2. **Validation**: 16:9 aspect ratio kontrolü
3. **Processing**:
   - 16:9 crop (center focus)
   - Multiple size generation (1280x720, 640x360)
   - WebP conversion
4. **CDN Deploy**: Optimize edilmiş dosyalar
5. **Commit**: URL kaydı

### Video İşleme
1. **Upload**: Presigned URL ile yükleme
2. **Validation**: Süre (15-120s) ve format kontrolü
3. **Transcoding**:
   - Multiple quality levels (720p, 480p, 360p)
   - HLS segmentation
   - Thumbnail generation (3 frame)
4. **CDN Deploy**: Adaptive streaming
5. **Commit**: Video URL kaydı

## 🚨 Hata Yönetimi

### Validation Hataları
```json
// Dosya çok büyük
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "Avatar file size must be under 2MB",
    "field": "file_size"
  }
}

// Desteklenmeyen format
{
  "error": {
    "code": "UNSUPPORTED_FORMAT",
    "message": "Avatar must be jpg, png, or webp",
    "field": "content_type"
  }
}

// Aspect ratio hatası
{
  "error": {
    "code": "INVALID_ASPECT_RATIO",
    "message": "Cover image must be 16:9 aspect ratio",
    "field": "dimensions"
  }
}
```

### Processing Hataları
```json
// İşleme başarısız
{
  "error": {
    "code": "PROCESSING_FAILED",
    "message": "Video transcoding failed - invalid codec",
    "field": "video_file"
  }
}

// URL erişilemez
{
  "error": {
    "code": "INVALID_URL",
    "message": "Avatar URL is not accessible",
    "field": "avatar_url"
  }
}
```

## 📱 Frontend Integration

### React Hook Örneği
```typescript
const useMediaUpload = (mentorId: string, mediaType: 'avatar' | 'cover' | 'video') => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    
    try {
      // 1. Get upload URL
      const urlResponse = await fetch(`/api/mentors/${mentorId}/media/${mediaType}-upload-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content_type: file.type,
          file_size: file.size
        })
      });
      
      const { upload_url, upload_id } = await urlResponse.json();
      
      // 2. Upload file
      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
        onUploadProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        }
      });
      
      if (!uploadResponse.ok) throw new Error('Upload failed');
      
      // 3. Commit URL
      const finalUrl = `https://cdn.mentorhub.com/${mediaType}s/${mentorId}.webp`;
      await fetch(`/api/mentors/${mentorId}/media/commit`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [`${mediaType}_url`]: finalUrl
        })
      });
      
      return finalUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress, error };
};
```

## 🔍 Monitoring & Analytics

### Upload Metrikleri
- Upload başarı oranı (type bazında)
- Ortalama upload süresi
- Processing başarı oranı
- CDN hit ratio
- Hata dağılımı

### Performance Metrikleri
- Presigned URL generation time
- File processing time
- CDN propagation time
- API response times

## 🛡️ Güvenlik Önlemleri

### File Validation
- **Magic Number Check**: Dosya header kontrolü
- **Virus Scanning**: ClamAV entegrasyonu
- **Content Analysis**: Uygunsuz içerik tespiti
- **Size Limits**: Katı boyut kısıtlamaları

### Access Control
- **JWT Verification**: Her istekte token kontrolü
- **Owner Validation**: Sadece mentor sahibi yükleyebilir
- **Rate Limiting**: Abuse koruması
- **CORS Policy**: Sadece izinli domain'ler

### Storage Security
- **Presigned URL**: Geçici, sınırlı erişim
- **CDN Security**: Hotlink koruması
- **Backup Strategy**: Otomatik yedekleme
- **Encryption**: Rest ve transit şifreleme

---

**API Version**: 1.0.0  
**Last Updated**: 2025-10-02  
**Contact**: media@mentorhub.com