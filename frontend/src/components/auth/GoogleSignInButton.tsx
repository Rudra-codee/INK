import { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export const GoogleSignInButton = () => {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In disabled.');
    return null;
  }

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error('Missing Google credential.');
      return;
    }
    setLoading(true);
    try {
      await googleLogin(response.credential);
      toast.success('Signed in with Google');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in failed')}
        useOneTap
        theme="outline"
        shape="pill"
        size="large"
        context={loading ? 'use' : 'signIn'}
      />
    </div>
  );
};

