import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Visual */}
        <div className="flex justify-center">
          <div className="relative">
            <span className="text-[120px] font-black text-muted/30 leading-none select-none">404</span>
            <Search className="absolute inset-0 m-auto size-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">
              <Home className="size-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="size-4" />
              Go Back
            </Link>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-4 border-t border-border">
          <p>If you believe this is an error, check the URL or contact support.</p>
        </div>
      </div>
    </div>
  );
}
