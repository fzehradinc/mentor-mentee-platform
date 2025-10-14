"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import EmptyState from '../../components/mentee/EmptyState';
import { FolderOpen, Upload, Share2, Download, Trash2 } from 'lucide-react';
import { getFiles, uploadFile, toggleFileSharing, type MenteeFile } from '../../lib/actions/menteeAreaActions';

export default function MenteeFiles() {
  const [files, setFiles] = useState<MenteeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  const folders = [
    { value: 'all', label: 'Tümü' },
    { value: 'general', label: 'Genel' },
    { value: 'cv', label: 'CV' },
    { value: 'projects', label: 'Projeler' },
    { value: 'notes', label: 'Notlar' }
  ];

  useEffect(() => {
    loadFiles();
  }, [selectedFolder]);

  const loadFiles = async () => {
    try {
      const folder = selectedFolder === 'all' ? undefined : selectedFolder;
      const data = await getFiles(folder);
      setFiles(data);
    } catch (error) {
      console.error('Load files error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadFile({
        file,
        folder: selectedFolder === 'all' ? 'general' : selectedFolder,
        sharedWithMentors: false
      });
      loadFiles();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleShare = async (fileId: string, currentShared: boolean) => {
    try {
      await toggleFileSharing(fileId, !currentShared);
      loadFiles();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <MenteeLayout currentPage="files">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="files">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dosyalar</h2>
            <p className="text-gray-600">CV, projeler ve paylaşımlarınızı yönetin</p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? 'Yükleniyor...' : 'Dosya Yükle'}
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Folder Tabs */}
        <div className="flex space-x-1 border-b border-gray-200">
          {folders.map((folder) => (
            <button
              key={folder.value}
              onClick={() => setSelectedFolder(folder.value)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                selectedFolder === folder.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {folder.label}
            </button>
          ))}
        </div>

        {/* Files List */}
        {files.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosya Adı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boyut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klasör</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yüklenme</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Paylaşım</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {file.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size_bytes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {file.folder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleToggleShare(file.id, file.shared_with_mentors)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          file.shared_with_mentors
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Share2 className="w-3 h-3" />
                        {file.shared_with_mentors ? 'Paylaşılıyor' : 'Özel'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-blue-600 hover:text-blue-700 mr-3">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon={FolderOpen}
              title="Henüz dosya yok"
              description="CV'nizi ve çalışmalarınızı buradan paylaşabilirsiniz."
              action={{ 
                label: 'İlk Dosyanı Yükle', 
                onClick: () => document.querySelector<HTMLInputElement>('input[type="file"]')?.click() 
              }}
            />
          </div>
        )}
      </div>
    </MenteeLayout>
  );
}


