"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import EmptyState from '../../components/mentee/EmptyState';
import { CreditCard, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getPayments, type Payment } from '../../lib/actions/menteeAreaActions';

export default function MenteePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Load payments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'refunded':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      succeeded: 'Başarılı',
      refunded: 'İade Edildi',
      failed: 'Başarısız',
      requires_action: 'İşlem Gerekli'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <MenteeLayout currentPage="payments">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="payments">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ödemeler & Faturalar</h2>
          <p className="text-gray-600">Ödeme geçmişiniz ve fatura bilgileriniz</p>
        </div>

        {payments.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fatura
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.created_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.description || 'Mentor seansı ödemesi'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(payment.amount_cents / 100).toFixed(2)} {payment.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className="text-sm text-gray-900">{getStatusLabel(payment.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {payment.invoice_url ? (
                        <a
                          href={payment.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      ) : (
                        <button
                          onClick={() => alert('Fatura oluşturma özelliği yakında eklenecek')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          Fatura İste
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon={CreditCard}
              title="Henüz ödeme yok"
              description="Şeffaf süreç. Tüm ödemeler güvenli ve kayıtlardadır."
              action={{ label: 'Mentör Ara', onClick: () => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentors' })) }}
            />
          </div>
        )}

        {/* New Goal Modal */}
        {isCreatingGoal && !newGoalTitle && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setIsCreatingGoal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Hedef</h3>
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Hedef başlığı"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateGoal}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Oluştur
                </button>
                <button
                  onClick={() => setIsCreatingGoal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MenteeLayout>
  );
}


