import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const AuthContext = createContext(null);

/**
 * Calls the backend to create a users/{uid} document on first login.
 * No-ops silently on repeat logins. Fire-and-forget — never throws.
 */
async function initUserDocument(firebaseUser) {
  try {
    await fetch(`${API_BASE}/api/users/init`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid:         firebaseUser.uid,
        displayName: firebaseUser.displayName || '',
        email:       firebaseUser.email       || '',
        photoURL:    firebaseUser.photoURL    || '',
      }),
    });
  } catch (err) {
    // Non-critical — don't surface to the user
    console.warn('[AuthContext] initUserDocument failed:', err.message);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Create Firestore user doc on every sign-in
      // (backend guards against overwriting existing docs)
      if (firebaseUser) {
        initUserDocument(firebaseUser);
      }
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
}
