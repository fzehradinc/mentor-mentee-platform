import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import DevErrorBoundary from './components/DevErrorBoundary';
import TestComponent from './components/TestComponent';
import SimpleApiTest from './components/SimpleApiTest';
import HomePage from './pages/NewHomePage';
import JoinPage from './pages/JoinPage';
import MentorDetailPage from './pages/MentorDetailPage';
import AuthPage from './pages/AuthPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MessagesPage from './pages/MessagesPage';
import OnboardingPage from './pages/OnboardingPage';
import MenteePage from './pages/MenteePage';
import MentorProfileWizard from './pages/MentorProfileWizard';
import MentorsPage from './pages/MentorsPage';
import MentorsIndexPage from './pages/mentors/index';
import MentorDetailPageNew from './pages/mentors/[id]';
import WorkshopsPage from './pages/WorkshopsPageNew';
import MentorTypeGate from './pages/MentorTypeGate';
import MenteeRegisterPage from './pages/MenteeRegisterPage';
import IndividualMentorRegisterPage from './pages/IndividualMentorRegisterPage';
import CorporateMentorRegisterPage from './pages/CorporateMentorRegisterPage';
import MenteeDashboard from './pages/mentee/MenteeDashboard';
import MenteeCalendar from './pages/mentee/MenteeCalendar';
import MenteeMessages from './pages/mentee/MenteeMessages';
import MenteeMentors from './pages/mentee/MenteeMentors';
import MenteeGoals from './pages/mentee/MenteeGoals';
import MenteePayments from './pages/mentee/MenteePayments';
import MenteeFiles from './pages/mentee/MenteeFiles';
import MenteeNotes from './pages/mentee/MenteeNotes';
import MenteeSettings from './pages/mentee/MenteeSettings';
import WorkshopDetailPage from './pages/WorkshopDetailPage';
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorCalendar from './pages/mentor/MentorCalendar';
import MentorMessages from './pages/mentor/MentorMessages';
import MentorAppointments from './pages/mentor/MentorAppointments';
import MentorServices from './pages/mentor/MentorServices';
import MentorEarnings from './pages/mentor/MentorEarnings';
import MentorProfile from './pages/mentor/MentorProfileEdit';
import MentorSettings from './pages/mentor/MentorSettings';
import BimentorMentorsPage from './pages/BimentorMentorsPage';

type AppView = 'home' | 'join' | 'mentor-detail' | 'auth' | 'appointments' | 'messages' | 'onboarding' | 'mentee-page' | 'mentor-wizard' | 'mentors' | 'mentors-new' | 'mentor-detail-new' | 'mentors-bimentor' | 'mentor-detail-bimentor' | 'workshops' | 'workshop-detail' | 'mentor-type-gate' | 'mentee-register' | 'individual-mentor-register' | 'corporate-mentor-register' | 'mentee-dashboard' | 'mentee-calendar' | 'mentee-messages' | 'mentee-mentors' | 'mentee-goals' | 'mentee-payments' | 'mentee-files' | 'mentee-notes' | 'mentee-settings' | 'mentor-dashboard' | 'mentor-calendar' | 'mentor-messages' | 'mentor-appointments' | 'mentor-services' | 'mentor-earnings' | 'mentor-profile' | 'mentor-settings' | 'api-test';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [selectedWorkshopSlug, setSelectedWorkshopSlug] = useState<string>('');

  // Listen for onboarding trigger from role selection
  React.useEffect(() => {
    const handleShowOnboarding = () => {
      setCurrentView('onboarding');
    };
    
    const handleShowMenteePage = () => {
      setCurrentView('mentee-page');
    };
    
    const handleShowMentorWizard = () => {
      setCurrentView('mentor-wizard');
    };

    const handleNavigateTo = (e: Event) => {
      const customEvent = e as CustomEvent<any>;
      const detail = customEvent.detail;
      
      if (typeof detail === 'string') {
        setCurrentView(detail as AppView);
      } else if (detail && typeof detail === 'object') {
        // Handle workshop detail with slug
        if (detail.slug) {
          setSelectedWorkshopSlug(detail.slug);
          setCurrentView('workshop-detail');
        }
      }
    };

    window.addEventListener('showOnboarding', handleShowOnboarding);
    window.addEventListener('showMenteePage', handleShowMenteePage);
    window.addEventListener('showMentorWizard', handleShowMentorWizard);
    window.addEventListener('navigateTo', handleNavigateTo as EventListener);
    
    return () => {
      window.removeEventListener('showOnboarding', handleShowOnboarding);
      window.removeEventListener('showMenteePage', handleShowMenteePage);
      window.removeEventListener('showMentorWizard', handleShowMentorWizard);
      window.removeEventListener('navigateTo', handleNavigateTo as EventListener);
    };
  }, []);

  const handleViewProfile = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setCurrentView('mentor-detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedMentorId('');
  };

  const handleAuthSuccess = () => {
    setCurrentView('home');
  };

  const handleShowAuth = () => {
    setCurrentView('auth');
  };

  const handleShowAppointments = () => {
    setCurrentView('appointments');
  };

  const handleShowMessages = () => {
    setCurrentView('messages');
  };

  const handleShowOnboarding = () => {
    setCurrentView('onboarding');
  };

  const handleShowMenteePage = () => {
    setCurrentView('mentee-page');
  };
  
  const handleShowMentorWizard = () => {
    setCurrentView('mentor-wizard');
  };

  const handleShowJoin = () => {
    setCurrentView('join');
  };

  const handleMenteeSelect = () => {
    setCurrentView('mentee-register');
  };

  const handleMentorSelect = () => {
    setCurrentView('mentor-type-gate');
  };

  switch (currentView) {
    case 'join':
      return (
        <JoinPage
          onShowAuth={handleShowAuth}
          onShowOnboarding={handleShowOnboarding}
        />
      );
    case 'mentor-detail':
      return (
        <MentorDetailPage
          mentorId={selectedMentorId}
          onBack={handleBackToHome}
        />
      );
    case 'auth':
      return <AuthPage onSuccess={handleAuthSuccess} />;
    case 'appointments':
      return <AppointmentsPage onBack={handleBackToHome} />;
    case 'messages':
      return <MessagesPage onBack={handleBackToHome} />;
    case 'onboarding':
      return <OnboardingPage onBack={handleBackToHome} />;
    case 'mentee-page':
      return <MenteePage onBack={handleBackToHome} />;
    case 'mentor-wizard':
      return <MentorProfileWizard onBack={handleBackToHome} />;
    case 'mentors':
      return <MentorsPage onBack={handleBackToHome} />;
    case 'mentors-new':
      return <MentorsIndexPage />;
    case 'mentor-detail-new':
      return <MentorDetailPageNew />;
    case 'mentors-bimentor':
      return <BimentorMentorsPage />;
    case 'mentor-detail-bimentor':
      return <MentorDetailPageNew />;
    case 'workshops':
      return <WorkshopsPage onBack={handleBackToHome} onViewDetail={(slug) => {
        setSelectedWorkshopSlug(slug);
        setCurrentView('workshop-detail');
      }} />;
    case 'workshop-detail':
      return <WorkshopDetailPage slug={selectedWorkshopSlug} onBack={() => setCurrentView('workshops')} />;
    case 'mentor-type-gate':
      return <MentorTypeGate onBack={handleBackToHome} />;
    case 'mentee-register':
      return <MenteeRegisterPage onBack={handleBackToHome} />;
    case 'individual-mentor-register':
      return <IndividualMentorRegisterPage onBack={() => setCurrentView('mentor-type-gate')} />;
    case 'corporate-mentor-register':
      return <CorporateMentorRegisterPage onBack={() => setCurrentView('mentor-type-gate')} />;
    case 'mentee-dashboard':
      return <MenteeDashboard />;
    case 'mentee-calendar':
      return <MenteeCalendar />;
    case 'mentee-messages':
      return <MenteeMessages />;
    case 'mentee-mentors':
      return <MenteeMentors />;
    case 'mentee-goals':
      return <MenteeGoals />;
    case 'mentee-payments':
      return <MenteePayments />;
    case 'mentee-files':
      return <MenteeFiles />;
    case 'mentee-notes':
      return <MenteeNotes />;
    case 'mentee-settings':
      return <MenteeSettings />;
    case 'mentor-dashboard':
      return <MentorDashboard />;
    case 'mentor-calendar':
      return <MentorCalendar />;
    case 'mentor-messages':
      return <MentorMessages />;
    case 'mentor-appointments':
      return <MentorAppointments />;
    case 'mentor-services':
      return <MentorServices />;
    case 'mentor-earnings':
      return <MentorEarnings />;
    case 'mentor-profile':
      return <MentorProfile />;
    case 'mentor-settings':
      return <MentorSettings />;
    case 'api-test':
      return <SimpleApiTest />;
    default:
      return (
        <HomePage
          onViewProfile={handleViewProfile}
          onShowAuth={handleShowAuth}
          onShowAppointments={handleShowAppointments}
          onShowMessages={handleShowMessages}
          onShowOnboarding={handleShowOnboarding}
          onMenteeSelect={handleMenteeSelect}
          onMentorSelect={handleMentorSelect}
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;