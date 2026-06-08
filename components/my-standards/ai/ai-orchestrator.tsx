"use client";
import { DomainDashboard, DomainAI, DomainFeed } from '@/components/domain-fullset/base';
import { useDomainConfig } from '../hooks';
export default function AiOrchestrator(){ const config=useDomainConfig(); return <div className='space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur'><DomainAI config={config} /><DomainFeed config={config} /></div>; }
