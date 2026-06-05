'use client';

import { useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trpc } from '@/lib/sdk';
import { useNotificationStore } from '@/sdk/store/index';

interface AppHeaderProps {
  title?: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  const { data: notifData } = trpc.notification.list.useQuery({ unreadOnly: false });
  const markAllRead         = trpc.notification.markAllRead.useMutation();
  const utils               = trpc.useUtils();

  const { unreadCount, setUnreadCount, clear } = useNotificationStore();

  // Sync unread count from server into Zustand
  useEffect(() => {
    if (notifData) {
      setUnreadCount((notifData as any[]).filter(n => !n.isRead).length);
    }
  }, [notifData, setUnreadCount]);

  const unreadNotifs = ((notifData ?? []) as any[]).filter(n => !n.isRead).slice(0, 5);

  function handleMarkAllRead() {
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        clear();
        utils.notification.list.invalidate();
      },
    });
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      {title && (
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold">{title}</h1>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <Button asChild size="sm" className="bg-cyan-500">
            <Link href="/generator">Get Started</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/iso">ISO Tools</Link>
          </Button>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search…" className="w-64 bg-muted pl-8" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center p-0 text-[10px] bg-red-500">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mark all read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {unreadNotifs.length === 0 ? (
              <DropdownMenuItem disabled>
                <span className="text-sm text-muted-foreground">All caught up!</span>
              </DropdownMenuItem>
            ) : (
              unreadNotifs.map((n: any) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
