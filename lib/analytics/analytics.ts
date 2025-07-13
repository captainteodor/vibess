// lib/analytics/analytics.ts
import { Analytics, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { Platform } from 'react-native';
import { initializeFirebaseAnalytics } from '../../config/firebase';

let analytics: Analytics | null = null;
let initializationPromise: Promise<Analytics | null> | null = null;

// Lazy initialization - only initialize when first event is logged
const ensureAnalyticsInitialized = async () => {
  if (analytics) return analytics;
  
  if (!initializationPromise) {
    initializationPromise = initializeFirebaseAnalytics();
  }
  
  analytics = await initializationPromise;
  return analytics;
};

export const logAnalyticsEvent = async (eventName: string, params?: { [key: string]: any }) => {
  // Skip analytics on non-web platforms
  if (Platform.OS !== 'web') {
    if (__DEV__) {
      console.log('Analytics Event (Native):', { eventName, params });
    }
    return;
  }

  try {
    const analyticsInstance = await ensureAnalyticsInitialized();
    
    if (analyticsInstance) {
      firebaseLogEvent(analyticsInstance, eventName, params);
    } else if (__DEV__) {
      console.log('Analytics Event (Development - Not initialized):', { eventName, params });
    }
  } catch (error) {
    console.error('Analytics logging error:', error);
    if (__DEV__) {
      console.log('Analytics Event (Error):', { eventName, params });
    }
  }
};

// Optional: Initialize analytics after user authentication
export const initializeAnalytics = async () => {
  return ensureAnalyticsInitialized();
};