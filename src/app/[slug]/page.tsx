
import { SiteFooter } from '@/components/site-footer';
import * as React from 'react';
import { SiteHeader } from '@/components/site-header';
import { AffiliateProfileContent } from './affiliate-profile-client';

export default function AffiliateRootPage({ params }: { params: { slug: string } }) {
    
    return (
        <>
            <SiteHeader />
            <AffiliateProfileContent slug={params.slug} />
            <SiteFooter />
        </>
    )
}
