// Basit API Test Component
import React, { useState } from 'react';
import { registerMentor } from '../lib/actions/mentorActions';
import { registerMentee } from '../lib/actions/menteeActions';

const SimpleApiTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testMentorRegistration = async () => {
    setLoading(true);
    setResult('Testing mentor registration...');
    
    try {
      const testData = {
        mode: 'individual' as const,
        displayName: 'Test Mentor',
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123',
        title: 'Senior Developer',
        yearsExperience: 5,
        hourlyRate: 500,
        meetingPreference: 'platform_internal' as const,
        bioShort: 'Test mentor bio short description',
        bioLong: 'Test mentor bio long description with more details',
        city: 'Istanbul',
        country: 'Turkey',
        languages: ['tr', 'en'],
        categories: ['yazilim'],
        skills: 'React, Node.js, TypeScript',
        kvkk: true as const
      };

      const response = await registerMentor(testData);
      setResult(`✅ Mentor registration successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Mentor registration failed: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testMenteeRegistration = async () => {
    setLoading(true);
    setResult('Testing mentee registration...');
    
    try {
      const testData = {
        fullName: 'Test Mentee',
        email: `mentee-${Date.now()}@example.com`,
        password: 'testpassword123',
        shortGoal: 'Yazılım geliştirici olmak istiyorum',
        targetTrack: 'yazilim',
        budget: '500_1000' as const,
        timePref: 'weekday_evening' as const,
        city: 'Istanbul',
        country: 'Turkey',
        languages: ['tr'],
        kvkk: true as const,
        interests: ['yazilim', 'veri_ai'],
        goalType: 'somut_hedef',
        priorities: ['cv_portfoy', 'mock_interview']
      };

      const response = await registerMentee(testData);
      setResult(`✅ Mentee registration successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Mentee registration failed: ${error.message}`);
    }
    
    setLoading(false);
  };

  const clearResult = () => {
    setResult('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔧 Simple API Test</h2>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={testMentorRegistration}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Mentor Registration
          </button>
          <button
            onClick={testMenteeRegistration}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Mentee Registration
          </button>
          <button
            onClick={clearResult}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Result
          </button>
        </div>

        {loading && (
          <div className="text-blue-600 font-medium">
            ⏳ Running test...
          </div>
        )}
      </div>

      {result && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-blue-600 mb-2">Test Result:</h3>
          <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-64">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SimpleApiTest;

