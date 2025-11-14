import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="40" zoomAndPan="magnify" viewBox="80 -10 250 400" height="40" preserveAspectRatio="xMidYMid meet" version="1.0" className={cn('h-7 w-auto', className)} {...props}>
        <defs>
            <clipPath id="3f153949cc">
                <path d="M 128 16.378906 L 246 16.378906 L 246 123 L 128 123 Z M 128 16.378906 " clipRule="nonzero"/>
            </clipPath>
            <clipPath id="6d60fad2dc">
                <path d="M 79.113281 84 L 294.363281 84 L 294.363281 292.378906 L 79.113281 292.378906 Z M 79.113281 84 " clipRule="nonzero"/>
            </clipPath>
            <clipPath id="af539e5ed4">
                <path d="M 148 84 L 294.363281 84 L 294.363281 235 L 148 235 Z M 148 84 " clipRule="nonzero"/>
            </clipPath>
        </defs>
        <g clipPath="url(#3f153949cc)">
            <path fill="currentColor" d="M 245.074219 74.925781 L 245.074219 84.0625 L 224.617188 84.0625 L 224.617188 74.925781 C 224.617188 53.992188 207.570312 36.945312 186.570312 36.945312 C 165.640625 36.945312 148.59375 53.992188 148.59375 74.925781 L 148.59375 122.449219 L 128.136719 122.449219 L 128.136719 74.925781 C 128.136719 42.671875 154.320312 16.492188 186.570312 16.492188 C 218.820312 16.492188 245.074219 42.671875 245.074219 74.925781 Z M 245.074219 74.925781 " fillOpacity="1" fillRule="nonzero"/>
        </g>
        <g clipPath="url(#6d60fad2dc)">
            <path fill="currentColor" d="M 294.234375 272.316406 L 294.234375 292.773438 L 78.976562 292.773438 L 78.976562 84.0625 L 128.136719 84.0625 L 128.136719 104.515625 L 99.433594 104.515625 L 99.433594 272.316406 Z M 294.234375 272.316406 " fillOpacity="1" fillRule="nonzero"/>
        </g>
        <g clipPath="url(#af539e5ed4)">
            <path fill="currentColor" d="M 294.234375 84.0625 L 294.234375 234.472656 L 217.457031 234.472656 L 169.253906 189.472656 L 169.253906 228.472656 L 148.796875 228.472656 L 148.796875 155.722656 L 221.480469 155.722656 L 221.480469 176.175781 L 184.933594 176.175781 L 225.503906 214.019531 L 273.777344 214.019531 L 273.777344 104.515625 L 167.207031 104.515625 L 167.207031 84.0625 Z M 294.234375 84.0625 " fillOpacity="1" fillRule="nonzero"/>
        </g>
    </svg>
  );
}
