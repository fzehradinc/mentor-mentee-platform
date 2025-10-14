// Browser Console'da çalıştırılacak test scripti
// Browser'da F12 > Console > Bu kodu yapıştır

console.log('🔧 API Test başlatılıyor...');

// Test mentor registration
async function testMentorRegistration() {
  try {
    console.log('📝 Mentor registration test...');
    
    // Dynamic import (Vite'da çalışır)
    const { registerMentor } = await import('./src/lib/actions/mentorActions.ts');
    
    const testData = {
      mode: 'individual',
      displayName: 'Console Test Mentor',
      email: `console-test-${Date.now()}@example.com`,
      password: 'testpassword123',
      title: 'Senior Developer',
      yearsExperience: 5,
      hourlyRate: 500,
      meetingPreference: 'platform_internal',
      bioShort: 'Console test mentor bio short',
      bioLong: 'Console test mentor bio long description',
      city: 'Istanbul',
      country: 'Turkey',
      languages: ['tr', 'en'],
      categories: ['yazilim'],
      skills: 'React, Node.js, TypeScript',
      kvkk: true
    };

    const result = await registerMentor(testData);
    console.log('✅ Mentor registration successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Mentor registration failed:', error);
    return null;
  }
}

// Test mentee registration
async function testMenteeRegistration() {
  try {
    console.log('📝 Mentee registration test...');
    
    const { registerMentee } = await import('./src/lib/actions/menteeActions.ts');
    
    const testData = {
      fullName: 'Console Test Mentee',
      email: `console-mentee-${Date.now()}@example.com`,
      password: 'testpassword123',
      shortGoal: 'Console test mentee goal',
      targetTrack: 'yazilim',
      budget: '500_1000',
      timePref: 'weekday_evening',
      city: 'Istanbul',
      country: 'Turkey',
      languages: ['tr'],
      kvkk: true,
      interests: ['yazilim', 'veri_ai'],
      goalType: 'somut_hedef',
      priorities: ['cv_portfoy', 'mock_interview']
    };

    const result = await registerMentee(testData);
    console.log('✅ Mentee registration successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Mentee registration failed:', error);
    return null;
  }
}

// Test functions'ı global scope'a ekle
window.testMentorRegistration = testMentorRegistration;
window.testMenteeRegistration = testMenteeRegistration;

console.log('🎯 Test functions hazır!');
console.log('Kullanım:');
console.log('- testMentorRegistration()');
console.log('- testMenteeRegistration()');

