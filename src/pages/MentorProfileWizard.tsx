import React, { useState } from 'react';
import WizardLayout from '../components/mentor-wizard/WizardLayout';
import StepBasics from '../components/mentor-wizard/StepBasics';
import StepExpertise from '../components/mentor-wizard/StepExpertise';
import StepAvailability from '../components/mentor-wizard/StepAvailability';
import StepPricing from '../components/mentor-wizard/StepPricing';
import StepMediaBio from '../components/mentor-wizard/StepMediaBio';
import StepReviewSubmit from '../components/mentor-wizard/StepReviewSubmit';
import { useAutosave } from '../hooks/useAutosave';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface PricingPackage {
  id: string;
  name: string;
  sessions: number;
  discount: number;
}

interface MentorProfileData {
  // Step 1: Basics
  display_name: string;
  title: string;
  company_name: string;
  short_bio: string;
  languages: string[];
  location: string;
  timezone: string;
  
  // Step 2: Expertise
  primary_category: string;
  skills: string[];
  experience_years: number;
  highlight_offers: string[];
  
  // Step 3: Availability
  availability_pattern: string;
  time_slots: TimeSlot[];
  session_duration: number;
  meeting_pref: string;
  
  // Step 4: Pricing
  price_per_session: number;
  first_session_discount: boolean;
  first_session_discount_value: number;
  discount_note: string;
  packages: PricingPackage[];
  
  // Step 5: Verification
  badges: string[];
  company_verification: any;
  kyc_upload: any;
  
  // Step 6: Media/Bio
  avatar_upload: string;
  cover_upload: string;
  video_intro_url: string;
  long_bio: string;
  
  // Step 6: Status
  status: 'draft' | 'review' | 'published';
}

interface MentorProfileWizardProps {
  onBack: () => void;
}

/**
 * Complete mentor profile wizard with 6 steps
 */
const MentorProfileWizard: React.FC<MentorProfileWizardProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [profileData, setProfileData] = useState<MentorProfileData>({
    // Step 1
    display_name: '',
    title: '',
    company_name: '',
    short_bio: '',
    languages: [],
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Step 2
    primary_category: '',
    skills: [],
    experience_years: 0,
    highlight_offers: [],
    
    // Step 3
    availability_pattern: '',
    time_slots: [],
    session_duration: 60,
    meeting_pref: '',
    
    // Step 4
    price_per_session: 0,
    first_session_discount: false,
    first_session_discount_value: 20,
    discount_note: '',
    packages: [],
    
    // Step 5
    badges: [],
    company_verification: null,
    kyc_upload: null,
    
    // Step 6
    avatar_upload: '',
    cover_upload: '',
    video_intro_url: '',
    long_bio: '',
    
    // Step 6
    status: 'draft'
  });

  const totalSteps = 6;

  // Autosave hook
  const { saveNow } = useAutosave(profileData, {
    delay: 800,
    onSave: async (data) => {
      // Mock API call - PATCH /mentors/{id}/draft
      console.log('Autosaving profile data:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onStatusChange: setAutosaveStatus
  });

  const updateProfileData = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calculateProfileCompletion = (): number => {
    let completed = 0;
    let total = 0;

    // Step 1: Basics (6 fields)
    total += 6;
    if (profileData.display_name?.length >= 2) completed++;
    if (profileData.title?.length >= 2) completed++;
    if (profileData.short_bio?.length >= 80) completed++;
    if (profileData.languages?.length > 0) completed++;
    if (profileData.location) completed++;
    if (profileData.company_name) completed++;

    // Step 2: Expertise (4 fields)
    total += 4;
    if (profileData.primary_category) completed++;
    if (profileData.skills?.length >= 3) completed++;
    if (profileData.experience_years > 0) completed++;
    if (profileData.highlight_offers?.length > 0) completed++;

    // Step 3: Availability (4 fields)
    total += 4;
    if (profileData.availability_pattern) completed++;
    if (profileData.time_slots?.length > 0) completed++;
    if (profileData.session_duration > 0) completed++;
    if (profileData.meeting_pref) completed++;

    // Step 4: Pricing (2 fields)
    total += 2;
    if (profileData.price_per_session >= 100) completed++;
    if (profileData.packages?.length > 0) completed++;

    // Step 5: Media/Bio (3 fields)
    total += 3;
    if (profileData.avatar_upload) completed++;
    if (profileData.long_bio?.length >= 400) completed++;
    if (profileData.video_intro_url) completed++;

    return Math.round((completed / total) * 100);
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Basics - Only truly required fields block
        if (!profileData.display_name || profileData.display_name.length < 2) {
          newErrors.display_name = 'Görünecek isim en az 2 karakter olmalıdır';
        }
        if (!profileData.title || profileData.title.length < 2) {
          newErrors.title = 'Unvan en az 2 karakter olmalıdır';
        }
        if (!profileData.short_bio || profileData.short_bio.length < 80) {
          newErrors.short_bio = 'Kısa tanıtım en az 80 karakter olmalıdır';
        }
        if (profileData.languages.length === 0) {
          newErrors.languages = 'En az bir dil seçmelisiniz';
        }
        if (!profileData.location) {
          newErrors.location = 'Konum seçmelisiniz';
        }
        break;

      case 1: // Expertise - Only category is blocking
        if (!profileData.primary_category) {
          newErrors.primary_category = 'Ana kategori seçmelisiniz';
        }
        break;

      case 2: // Availability - Only pattern is blocking
        if (!profileData.availability_pattern) {
          newErrors.availability_pattern = 'Müsaitlik durumu seçmelisiniz';
        }
        break;

      case 3: // Pricing - Only minimum price is blocking
        if (profileData.price_per_session < 100) {
          newErrors.price_per_session = 'Minimum ücret 100₺ olmalıdır';
        }
        break;

      case 4: // Media/Bio - Only avatar is blocking
        if (!profileData.avatar_upload) {
          newErrors.avatar_upload = 'Profil fotoğrafı zorunludur';
        }
        if (profileData.video_intro_url && !validateVideoUrl(profileData.video_intro_url)) {
          newErrors.video_intro_url = 'Geçerli bir YouTube veya Vimeo linki giriniz';
        }
        break;

      case 5: // Review/Publish - No blocking validations
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVideoUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  const handleNext = () => {
    validateCurrentStep();
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleSave = async () => {
    await saveNow();
  };

  const handlePreview = () => {
    console.log('Opening profile preview:', profileData);
    alert('Profil önizlemesi açılacak (Demo)');
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      // Mock API call - POST /mentors/{id}/publish
      console.log('Publishing profile:', profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update status to published
      setProfileData(prev => ({
        ...prev,
        status: 'published'
      }));

      alert('Profil başarıyla yayınlandı!');
      onBack();
    } catch (error) {
      console.error('Publish error:', error);
      alert('Yayınlama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSubmitForReview = async () => {
    setIsPublishing(true);

    try {
      // Mock API call - POST /mentors/{id}/submit
      console.log('Submitting profile for review:', profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update status to review
      setProfileData(prev => ({
        ...prev,
        status: 'review'
      }));

      // Show success toast
      alert('✉️ Profilin incelemeye gönderildi. Onaylandığında sana haber vereceğiz!');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleWithdrawReview = async () => {
    try {
      // Mock API call - POST /mentors/{id}/withdraw
      console.log('Withdrawing profile from review');
      await new Promise(resolve => setTimeout(resolve, 500));

      setProfileData(prev => ({
        ...prev,
        status: 'draft'
      }));

      alert('İnceleme iptal edildi. Profilin taslak moduna alındı.');
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasics
            data={{
              display_name: profileData.display_name,
              title: profileData.title,
              company_name: profileData.company_name,
              short_bio: profileData.short_bio,
              languages: profileData.languages,
              location: profileData.location,
              timezone: profileData.timezone
            }}
            onChange={updateProfileData}
            errors={errors}
          />
        );
      case 1:
        return (
          <StepExpertise
            data={{
              primary_category: profileData.primary_category,
              skills: profileData.skills,
              experience_years: profileData.experience_years,
              highlight_offers: profileData.highlight_offers
            }}
            onChange={updateProfileData}
            errors={errors}
          />
        );
      case 2:
        return (
          <StepAvailability
            data={{
              availability_pattern: profileData.availability_pattern,
              time_slots: profileData.time_slots,
              session_duration: profileData.session_duration,
              meeting_pref: profileData.meeting_pref
            }}
            onChange={updateProfileData}
            errors={errors}
          />
        );
      case 3:
        return (
          <StepPricing
            data={{
              price_per_session: profileData.price_per_session,
              first_session_discount: profileData.first_session_discount,
              discount_note: profileData.discount_note,
              packages: profileData.packages
            }}
            onChange={updateProfileData}
            errors={errors}
          />
        );
      case 4:
        return (
          <StepMediaBio
            data={{
              avatar_upload: profileData.avatar_upload,
              cover_upload: profileData.cover_upload,
              video_intro_url: profileData.video_intro_url,
              long_bio: profileData.long_bio
            }}
            onChange={updateProfileData}
            errors={errors}
          />
        );
      case 5:
        return (
          <StepReviewSubmit
            data={{
              full_name: profileData.display_name,
              title: profileData.title,
              short_bio: profileData.short_bio,
              long_bio: profileData.long_bio,
              avatar_upload: profileData.avatar_upload,
              cover_upload: profileData.cover_upload,
              video_intro_url: profileData.video_intro_url,
              expertise_areas: profileData.skills.map(skill => ({ category: profileData.primary_category, skill })),
              price_per_session: profileData.price_per_session,
              price_tier: 'orta-seviye',
              first_session_discount: profileData.first_session_discount,
              first_session_discount_value: profileData.first_session_discount_value,
              packages: profileData.packages,
              availability: profileData.time_slots.map(slot => ({
                day: slot.day,
                slots: [{ start: slot.startTime, end: slot.endTime }]
              })),
              status: profileData.status
            }}
            onSubmitForReview={handleSubmitForReview}
            onWithdrawReview={handleWithdrawReview}
            onGoToStep={handleStepChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onStepChange={handleStepChange}
      isStepValid={Object.keys(errors).length === 0}
      onSave={handleSave}
      onPreview={handlePreview}
      onPublish={handlePublish}
      isPublishing={isPublishing}
      autosaveStatus={autosaveStatus}
      onClose={onBack}
      profileCompletion={calculateProfileCompletion()}
    >
      {renderCurrentStep()}
    </WizardLayout>
  );
};

export default MentorProfileWizard;