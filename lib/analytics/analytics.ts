// lib/analytics/analytics.ts
import { logEvent as firebaseLogEvent } from 'firebase/analytics';
import { initializeFirebaseAnalytics } from '../../config/firebase';

let analytics: any = null;
initializeFirebaseAnalytics().then(instance => {
  analytics = instance;
});

export const logAnalyticsEvent = (eventName: string, params?: { [key: string]: any }) => {
  if (analytics) {
    try {
      firebaseLogEvent(analytics, eventName, params);
    } catch (e: any) {
      console.error('Analytics logging error:', e.message);
    }
  } else if (__DEV__) {
    console.log('Analytics Event (Development):', { eventName, params });
  }
};
