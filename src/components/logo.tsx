
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="50" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="50" preserveAspectRatio="xMidYMid meet" version="1.0" className={cn('h-10 w-auto', className)} {...props}>
        <defs>
            <clipPath id="fa7bcf60c4">
                <path d="M 0 75 L 0 300 C 0 341.421875 33.578125 375 75 375 L 300 375 C 341.421875 375 375 341.421875 375 300 L 375 75 C 375 33.578125 341.421875 0 300 0 L 75 0 C 33.578125 0 0 33.578125 0 75 Z M 0 75 " clipRule="nonzero"/>
            </clipPath>
            <clipPath id="a51f27b0a2">
                <path d="M 137 37.5 L 238 37.5 L 238 129 L 137 129 Z M 137 37.5 " clipRule="nonzero"/>
            </clipPath>
            <clipPath id="0bc9d5e9a1">
                <path d="M 95.269531 95 L 279.769531 95 L 279.769531 273.75 L 95.269531 273.75 Z M 95.269531 95 " clipRule="nonzero"/>
            </clipPath>
            <clipPath id="46566a61c3">
                <path d="M 154 95 L 279.769531 95 L 279.769531 225 L 154 225 Z M 154 95 " clipRule="nonzero"/>
            </clipPath>
            <clipPath id="94197fc1f9">
                <rect x="0" width="237" y="0" height="67"/>
            </clipPath>
        </defs>
        <g clipPath="url(#fa7bcf60c4)">
            <path fill="currentColor" d="M 333.332031 375 L 41.667969 375 C 18.75 375 0 356.25 0 333.332031 L 0 41.667969 C 0 18.75 18.75 0 41.667969 0 L 333.332031 0 C 356.25 0 375 18.75 375 41.667969 L 375 333.332031 C 375 356.25 356.25 375 333.332031 375 Z M 333.332031 375 " fillOpacity="1" fillRule="nonzero"/>
        </g>
        <g clipPath="url(#a51f27b0a2)">
            <path fill="#ffffff" d="M 237.34375 87.621094 L 237.34375 95.445312 L 219.832031 95.445312 L 219.832031 87.621094 C 219.832031 69.703125 205.238281 55.109375 187.261719 55.109375 C 169.339844 55.109375 154.75 69.703125 154.75 87.621094 L 154.75 128.308594 L 137.238281 128.308594 L 137.238281 87.621094 C 137.238281 60.011719 159.652344 37.597656 187.261719 37.597656 C 214.871094 37.597656 237.34375 60.011719 237.34375 87.621094 Z M 237.34375 87.621094 " fillOpacity="1" fillRule="nonzero"/>
        </g>
        <g clipPath="url(#0bc9d5e9a1)">
            <path fill="#ffffff" d="M 279.429688 256.609375 L 279.429688 274.117188 L 95.152344 274.117188 L 95.152344 95.445312 L 137.238281 95.445312 L 137.238281 112.957031 L 112.664062 112.957031 L 112.664062 256.609375 Z M 279.429688 256.609375 " fillOpacity="1" fillRule="nonzero"/>
        </g>
        <g clipPath="url(#46566a61c3)">
            <path fill="#ffffff" d="M 279.429688 95.445312 L 279.429688 224.210938 L 213.703125 224.210938 L 172.433594 185.6875 L 172.433594 219.074219 L 154.925781 219.074219 L 154.925781 156.792969 L 217.148438 156.792969 L 217.148438 174.304688 L 185.859375 174.304688 L 220.589844 206.699219 L 261.917969 206.699219 L 261.917969 112.957031 L 170.683594 112.957031 L 170.683594 95.445312 Z M 279.429688 95.445312 " fillOpacity="1" fillRule="nonzero"/>
        </g>
    </svg>
  );
}
