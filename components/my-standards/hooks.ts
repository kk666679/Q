import { useMemo } from 'react';
import { makeDomainConfig } from '@/components/domain-fullset/mock-data';
import { DOMAIN_KEY, DOMAIN_NAME } from './constants';
export function useDomainConfig(){ return useMemo(()=>makeDomainConfig(DOMAIN_KEY, DOMAIN_NAME, 'from-cyan-500/30 to-blue-600/20'),[]);}
