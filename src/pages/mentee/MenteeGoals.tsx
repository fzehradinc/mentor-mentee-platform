"use client";
import React, { useState, useEffect } from 'react';
import MenteeLayout from '../../components/mentee/MenteeLayout';
import DashboardCard from '../../components/mentee/DashboardCard';
import ProgressBar from '../../components/mentee/ProgressBar';
import EmptyState from '../../components/mentee/EmptyState';
import { Target, Plus, CheckCircle, Circle, Trash2 } from 'lucide-react';
import { getGoals, createGoal, createTask, toggleTask, deleteGoal, type Goal } from '../../lib/actions/menteeAreaActions';

export default function MenteeGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Load goals error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim()) return;

    try {
      await createGoal({ title: newGoalTitle });
      setNewGoalTitle('');
      setIsCreatingGoal(false);
      loadGoals();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAddTask = async (goalId: string) => {
    const title = newTaskTitles[goalId];
    if (!title?.trim()) return;

    try {
      await createTask(goalId, title);
      setNewTaskTitles({ ...newTaskTitles, [goalId]: '' });
      loadGoals();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleToggleTask = async (taskId: string, done: boolean) => {
    try {
      await toggleTask(taskId, done);
      loadGoals();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Bu hedefi silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteGoal(goalId);
      loadGoals();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <MenteeLayout currentPage="goals">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout currentPage="goals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hedefler & İlerleme</h2>
            <p className="text-gray-600">Hedeflerinizi belirleyin ve ilerleyişinizi takip edin</p>
          </div>
          <button
            onClick={() => setIsCreatingGoal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Yeni Hedef
          </button>
        </div>

        {/* New Goal Form */}
        {isCreatingGoal && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Yeni Hedef Oluştur</h3>
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
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Oluştur
              </button>
              <button
                onClick={() => {
                  setIsCreatingGoal(false);
                  setNewGoalTitle('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Goals List */}
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => {
              const tasks = goal.tasks || [];
              const doneTasks = tasks.filter(t => t.done).length;
              const progress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

              return (
                <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      )}
                      {goal.target_date && (
                        <p className="text-xs text-gray-500">
                          Hedef Tarih: {new Date(goal.target_date).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress */}
                  <ProgressBar 
                    progress={progress} 
                    label={`İlerleme (${doneTasks}/${tasks.length})`}
                    color="green"
                  />

                  {/* Tasks */}
                  <div className="mt-4 space-y-2">
                    {tasks.map((task: any) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={(e) => handleToggleTask(task.id, e.target.checked)}
                          className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </span>
                        {task.done && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </label>
                    ))}

                    {/* Add Task */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={newTaskTitles[goal.id] || ''}
                        onChange={(e) => setNewTaskTitles({ ...newTaskTitles, [goal.id]: e.target.value })}
                        placeholder="Yeni görev ekle..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTask(goal.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddTask(goal.id)}
                        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Suggested Resources */}
                  {goal.suggested_resources && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Önerilen Kaynaklar</h4>
                      <p className="text-sm text-blue-800">{goal.suggested_resources}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon={Target}
              title="Henüz hedef yok"
              description="Hedef ekleyerek ilerlemenizi görünür kılın. Mentörünüz size yol gösterecek."
              action={{ label: 'İlk Hedefini Oluştur', onClick: () => setIsCreatingGoal(true) }}
            />
          </div>
        )}
      </div>
    </MenteeLayout>
  );
}


