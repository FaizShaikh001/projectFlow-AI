import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
      <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center">
        <FileQuestion className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">404 - Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find the page or resource you were looking for. It might have been deleted, or the link could be broken.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/projects">View Projects</Link>
        </Button>
      </div>
    </div>
  );
}
