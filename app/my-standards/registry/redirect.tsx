'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToRegistryPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/my-standards/registry');
  }, [router]);
  return null;
}

