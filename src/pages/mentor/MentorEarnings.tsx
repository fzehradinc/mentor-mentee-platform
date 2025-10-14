"use client";
import React, { useState, useEffect } from 'react';
import MentorLayout from '../../components/mentor/MentorLayout';
import StatCard from '../../components/mentor/StatCard';
import EmptyState from '../../components/mentee/EmptyState';
import { DollarSign, TrendingUp, Download } from 'lucide-react';
import { getEarningsSummary, getPayouts } from '../../lib/actions/mentorAreaActions';

export default function MentorEarnings() {
  const [earnings, setEarnings] = useState<any>({});
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [earningsData, payoutsData] = await Promise.all([
        getEarningsSummary(),
        getPayouts()
      ]);
      
      setEarnings(earningsData);
      setPayouts(payoutsData);
    } catch (error) {
      console.error('Load earnings error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MentorLayout currentPage="earnings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout currentPage="earnings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kazançlar</h2>
          <p className="text-gray-600">Şeffaf kazanç. Tüm ödemeler tek yerde ve faturalandırılmıştır.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            icon={DollarSign}
            label="Toplam Kazanç"
            value={`${((earnings.total_earned_cents || 0) / 100).toFixed(0)}₺`}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Bekleyen Kazanç"
            value={`${((earnings.pending_cents || 0) / 100).toFixed(0)}₺`}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            label="Tamamlanan Seans"
            value={earnings.completed_sessions || 0}
            color="blue"
          />
        </div>

        {/* Payouts Table */}
        {payouts.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dönem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fatura</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(payout.period_start).toLocaleDateString('tr-TR')} - {new Date(payout.period_end).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {(payout.amount_cents / 100).toFixed(2)} {payout.currency}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payout.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payout.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payout.status === 'paid' ? 'Ödendi' : payout.status === 'processing' ? 'İşlemde' : 'Beklemede'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {payout.invoice_url ? (
                        <a href={payout.invoice_url} target="_blank" className="text-blue-600 hover:underline flex items-center justify-end gap-1">
                          <Download className="w-4 h-4" /> PDF
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
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
              icon={DollarSign}
              title="Henüz ödeme yok"
              description="Tamamlanan seanslarınız için ödemeler burada görünecek."
            />
          </div>
        )}
      </div>
    </MentorLayout>
  );
}


