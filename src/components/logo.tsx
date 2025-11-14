import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="40" zoomAndPan="magnify" viewBox="80 -10 250 400" height="40" preserveAspectRatio="xMidYMid meet" version="1.0" className={cn('h-7 w-auto', className)} {...props}>
        <defs>
            <clipPath id="42eff0033b">
                <path d="M 45 91 L 337.5 91 L 337.5 375 L 45 375 Z M 45 91 " clip-rule="nonzero"/>
            </clipPath>
            <clipPath id="6e9facdef5">
                <path d="M 139 91 L 337.5 91 L 337.5 297 L 139 297 Z M 139 91 " clip-rule="nonzero"/>
            </clipPath>
        </defs>
        <path fill="currentColor" d="M 270.300781 79.480469 L 270.300781 91.882812 L 242.53125 91.882812 L 242.53125 79.480469 C 242.53125 51.0625 219.390625 27.921875 190.878906 27.921875 C 162.460938 27.921875 139.320312 51.0625 139.320312 79.480469 L 139.320312 143.996094 L 111.554688 143.996094 L 111.554688 79.480469 C 111.554688 35.695312 147.097656 0.152344 190.878906 0.152344 C 234.664062 0.152344 270.300781 35.695312 270.300781 79.480469 Z M 270.300781 79.480469 " fill-opacity="1" fill-rule="nonzero"/>
        <g clip-path="url(#42eff0033b)">
            <path fill="currentColor" d="M 337.039062 347.449219 L 337.039062 375.21875 L 44.816406 375.21875 L 44.816406 91.882812 L 111.554688 91.882812 L 111.554688 119.652344 L 72.582031 119.652344 L 72.582031 347.449219 Z M 337.039062 347.449219 " fill-opacity="1" fill-rule="nonzero"/>
        </g>
        <g clip-path="url(#6e9facdef5)">
            <path fill="currentColor" d="M 337.039062 91.882812 L 337.039062 296.078125 L 232.8125 296.078125 L 167.367188 234.984375 L 167.367188 287.929688 L 139.601562 287.929688 L 139.601562 189.167969 L 238.273438 189.167969 L 238.273438 216.933594 L 188.660156 216.933594 L 243.734375 268.308594 L 309.269531 268.308594 L 309.269531 119.652344 L 164.59375 119.652344 L 164.59375 91.882812 Z M 337.039062 91.882812 " fill-opacity="1" fill-rule="nonzero"/>
        </g>
    </svg>
  );
}
