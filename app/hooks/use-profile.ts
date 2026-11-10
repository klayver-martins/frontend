'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Profile } from '@/app/schemas/profile-schema';
import { getProfileService } from '@/app/services/user/get-profile-service';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getProfileService();

      setProfile(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível carregar seu perfil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const data = await getProfileService();

        if (isMounted) {
          setProfile(data);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : 'Não foi possível carregar seu perfil.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    profile,
    error,
    isLoading,
    reloadProfile: loadProfile,
  };
}
