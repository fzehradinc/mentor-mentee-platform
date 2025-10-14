import { v4 as uuidv4 } from 'uuid';

const GUEST_SESSION_KEY = 'beementor_guest_session_id';
const ONBOARDING_ANSWERS_KEY = 'beementor_onboarding_guest';

export interface GuestOnboardingData {
  answers: Record<string, any>;
  currentStep: number;
  timestamp: number;
  completed: boolean;
}

export const guestSession = {
  ensureSession(): string {
    let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(GUEST_SESSION_KEY, sessionId);
    }
    return sessionId;
  },

  getSessionId(): string | null {
    return localStorage.getItem(GUEST_SESSION_KEY);
  },

  saveAnswers(data: Partial<GuestOnboardingData>): void {
    const existing = this.getAnswers();
    const updated: GuestOnboardingData = {
      ...existing,
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(ONBOARDING_ANSWERS_KEY, JSON.stringify(updated));
  },

  getAnswers(): GuestOnboardingData {
    const stored = localStorage.getItem(ONBOARDING_ANSWERS_KEY);
    if (!stored) {
      return {
        answers: {},
        currentStep: 0,
        timestamp: Date.now(),
        completed: false,
      };
    }
    try {
      return JSON.parse(stored);
    } catch {
      return {
        answers: {},
        currentStep: 0,
        timestamp: Date.now(),
        completed: false,
      };
    }
  },

  clearSession(): void {
    localStorage.removeItem(GUEST_SESSION_KEY);
    localStorage.removeItem(ONBOARDING_ANSWERS_KEY);
  },

  hasInProgressOnboarding(): boolean {
    const data = this.getAnswers();
    return data.currentStep > 0 && !data.completed;
  },
};
