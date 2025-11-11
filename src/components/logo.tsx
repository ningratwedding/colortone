import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-6 w-6', className)}
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(210 90% 55%)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)" />
    </svg>
  );
}
