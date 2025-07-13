// /lib/auth/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../../config/firebase'; // Import your firebase config

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Default to true to show initial loading
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Setting up Firebase Auth listener...");
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      (authUser) => {
        if (authUser) {
          console.log("Authenticated user:", authUser);
          setUser(authUser);
        } else {
          console.log("No authenticated user found.");
          setUser(null); // No user
        }
        setLoading(false); // Stop loading after user state is determined
      },
      (error) => {
        console.error("Firebase Auth error:", error);
        setError(error);
        setLoading(false); // Stop loading in case of error
      }
    );

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  console.log("Current auth state:", { user, loading, error });

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
