'use client'

import {
  ChevronDown,
  CreditCard,
  Sparkles,
  User,
  LogOut,
  Bell,
  Wallet,
  Settings,
} from 'lucide-react'

import {
  SidebarFooter,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SidebarSubscription, SubscriptionPlan } from './sidebar-subscription'
import { SidebarBilling } from './sidebar-billing'

export interface SidebarUserData {
  name: string
  email: string
  avatarUrl?: string
  initials: string
  subscription: SubscriptionPlan
  credits: number
  creditLimit: number
  cardLast4: string
  cardBrand: string
}

const defaultUserData: SidebarUserData = {
  name: 'John Doe',
  email: 'john.doe@company.com',
  avatarUrl: '',
  initials: 'JD',
  subscription: 'Pro',
  credits: 1250,
  creditLimit: 5000,
  cardLast4: '4242',
  cardBrand: 'Visa',
}

interface SidebarFooterComponentProps {
  userData?: Partial<SidebarUserData>
}

export function SidebarFooterComponent({ userData }: SidebarFooterComponentProps) {
  const user = { ...defaultUserData, ...userData }

  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-6">
            <Avatar className="size-9">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col items-start gap-0.5 overflow-hidden">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <Badge 
              variant="secondary" 
              className="ml-auto shrink-0 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
            >
              <Sparkles className="mr-1 size-3" />
              {user.subscription}
            </Badge>
            <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          side="top" 
          align="start" 
          className="w-72 p-0"
          sideOffset={8}
        >
          {/* User Info Section */}
          <div className="flex items-center gap-3 p-4 pb-3">
            <Avatar className="size-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Subscription & Credits Section */}
          <div className="p-3 space-y-3">
            <SidebarSubscription 
              plan={user.subscription}
              credits={user.credits}
              creditLimit={user.creditLimit}
            />

            {/* Payment Method */}
            <SidebarBilling 
              cardBrand={user.cardBrand}
              cardLast4={user.cardLast4}
            />
          </div>

          <DropdownMenuSeparator />

          {/* Menu Items */}
          <div className="p-1">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2">
              <User className="size-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="size-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <CreditCard className="size-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Bell className="size-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          {/* Bottom Actions */}
          <div className="p-1">
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  )
}

