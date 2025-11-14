import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="95" zoomAndPan="magnify" viewBox="0 0 95 112.499997" height="150" preserveAspectRatio="xMidYMid meet" version="1.0" className={cn('h-6 w-auto', className)} {...props}>
        <defs>
            <g/>
            <clipPath id="cf31d39e23">
            <path d="M 22 1.570312 L 69 1.570312 L 69 44 L 22 44 Z M 22 1.570312 " clipRule="nonzero"/>
            </clipPath>
            <clipPath id="54bc66cc24">
            <path d="M 3.027344 28 L 88 28 L 88 110.585938 L 3.027344 110.585938 Z M 3.027344 28 " clipRule="nonzero"/>
            </clipPath>
        </defs>
        <g clipPath="url(#cf31d39e23)">
            <path fill="currentColor" d="M 68.359375 24.621094 L 68.359375 28.21875 L 60.308594 28.21875 L 60.308594 24.621094 C 60.308594 16.382812 53.597656 9.671875 45.332031 9.671875 C 37.089844 9.671875 30.378906 16.382812 30.378906 24.621094 L 30.378906 43.332031 L 22.328125 43.332031 L 22.328125 24.621094 C 22.328125 11.925781 32.636719 1.617188 45.332031 1.617188 C 58.027344 1.617188 68.359375 11.925781 68.359375 24.621094 Z M 68.359375 24.621094 " fillOpacity="1" fillRule="nonzero"/>
        </g>
        <g clipPath="url(#54bc66cc24)">
            <path fill="currentColor" d="M 87.714844 102.328125 L 87.714844 110.378906 L 2.976562 110.378906 L 2.976562 28.21875 L 22.328125 28.21875 L 22.328125 36.269531 L 11.027344 36.269531 L 11.027344 102.328125 Z M 87.714844 102.328125 " fillOpacity="1" fillRule="nonzero"/>
        </g>
        <path fill="currentColor" d="M 87.714844 28.21875 L 87.714844 87.429688 L 57.488281 87.429688 L 38.511719 69.714844 L 38.511719 85.066406 L 30.460938 85.066406 L 30.460938 56.429688 L 59.074219 56.429688 L 59.074219 64.480469 L 44.6875 64.480469 L 60.65625 79.378906 L 79.660156 79.378906 L 79.660156 36.269531 L 37.707031 36.269531 L 37.707031 28.21875 Z M 87.714844 28.21875 " fillOpacity="1" fillRule="nonzero"/>
    </svg>
  );
}