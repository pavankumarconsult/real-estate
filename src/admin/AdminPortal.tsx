import { useEffect, useState } from 'react';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { AdminApiError, verifyAdminSession } from './adminApi';
import { AdminSignIn } from './AdminSignIn';
import { LeadsDashboard } from './LeadsDashboard';
import { adminAuth } from './firebaseClient';

interface AdminPortalProps {
  currentPath: string;
  onNavigate: (path: string, replace?: boolean) => void;
}

function messageForError(error: unknown): string {
  if (error instanceof AdminApiError) {
    if (error.code === 'unauthorized') return 'This Firebase account is valid but its UID is not approved for Team4 Aria administration.';
    if (error.code === 'session-expired') return 'Your session expired or was revoked. Please sign in again.';
    if (error.code === 'configuration-error') return 'Admin access has not been configured on the server.';
  }
  return 'The sign-in request could not be completed. Check the credentials and try again.';
}

export default function AdminPortal({ currentPath, onNavigate }: AdminPortalProps) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authorizedEmail, setAuthorizedEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => onAuthStateChanged(adminAuth, async (user) => {
    setIsChecking(true);
    setErrorMessage('');
    if (!user) {
      setAuthUser(null);
      setAuthorizedEmail(null);
      setIsChecking(false);
      if (currentPath !== '/admin') onNavigate('/admin', true);
      return;
    }

    try {
      const session = await verifyAdminSession(user);
      setAuthUser(user);
      setAuthorizedEmail(session.email);
      if (currentPath !== '/admin/leads') onNavigate('/admin/leads', true);
    } catch (error) {
      setErrorMessage(messageForError(error));
      setAuthUser(null);
      setAuthorizedEmail(null);
      await signOut(adminAuth);
    } finally {
      setIsChecking(false);
    }
  }), [currentPath, onNavigate]);

  const handleSignIn = async (email: string, password: string, remember: boolean) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await setPersistence(adminAuth, remember ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(adminAuth, email, password);
      const session = await verifyAdminSession(credential.user);
      setAuthUser(credential.user);
      setAuthorizedEmail(session.email);
      onNavigate('/admin/leads', true);
    } catch (error) {
      setErrorMessage(messageForError(error));
      await signOut(adminAuth);
    } finally {
      setIsSubmitting(false);
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(adminAuth);
    setAuthUser(null);
    setAuthorizedEmail(null);
    onNavigate('/admin', true);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f5] px-5 text-center text-[#635d5c]">
        <div>
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#d2c5b3] border-t-[#775610]" />
          <p className="mt-4 text-sm">Verifying admin session…</p>
        </div>
      </div>
    );
  }

  if (!authUser || currentPath === '/admin') {
    return <AdminSignIn errorMessage={errorMessage} isSubmitting={isSubmitting} onSubmit={handleSignIn} />;
  }

  return (
    <LeadsDashboard
      user={authUser}
      authorizedEmail={authorizedEmail}
      onSignOut={handleSignOut}
      onSessionError={async (error) => {
        setErrorMessage(messageForError(error));
        await signOut(adminAuth);
        setAuthUser(null);
        setAuthorizedEmail(null);
        onNavigate('/admin', true);
      }}
    />
  );
}
