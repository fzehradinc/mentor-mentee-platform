"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import EmptyState from '../../components/mentee/EmptyState';
import { FileText, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { getNotes, createNote, updateNote, deleteNote, type MenteeNote } from '../../lib/actions/menteeAreaActions';

export default function MenteeNotes() {
  const [notes, setNotes] = useState<MenteeNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<MenteeNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Load notes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    try {
      await createNote({ title: formData.title, content: formData.content });
      setFormData({ title: '', content: '' });
      setIsCreating(false);
      loadNotes();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingNote || !formData.title.trim()) return;

    try {
      await updateNote(editingNote.id, { title: formData.title, content: formData.content });
      setFormData({ title: '', content: '' });
      setEditingNote(null);
      loadNotes();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu notu silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteNote(id);
      loadNotes();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const startEdit = (note: MenteeNote) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content || '' });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  if (loading) {
    return (
      <MenteeLayout currentPage="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Notlarım</h2>
            <p className="text-slate-600">Kişisel notlarınızı buradan yönetin</p>
          </div>
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Not
          </button>
        </div>

        {/* Note Form (Create/Edit) */}
        {(isCreating || editingNote) && (
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">
              {editingNote ? 'Notu Düzenle' : 'Yeni Not'}
            </h3>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Not başlığı"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              autoFocus
            />
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Not içeriği..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg h-40 resize-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={editingNote ? handleUpdate : handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800"
              >
                <Save className="w-4 h-4" />
                {editingNote ? 'Güncelle' : 'Oluştur'}
              </button>
              <button
                onClick={cancelForm}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {notes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-800 flex-1">{note.title}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(note)}
                      className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {note.content && (
                  <p className="text-sm text-slate-600 line-clamp-4 mb-3">{note.content}</p>
                )}
                <div className="text-xs text-slate-400">
                  {new Date(note.updated_at).toLocaleDateString('tr-TR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12">
            <EmptyState
              icon={FileText}
              title="Henüz not yok"
              description="Seanslar, hedefler ve mentorlarla ilgili notlarınızı buraya yazabilirsiniz."
              action={{ label: 'İlk Notunu Oluştur', onClick: startCreate }}
            />
          </div>
        )}
      </div>
    </MenteeLayout>
  );
}


