import { SiteFooter } from '@/components/site-footer';
import * as React from 'react';
import { AffiliateProfileContent } from './affiliate-profile-client';
import { SiteHeader } from '@/components/site-header';

export default function AffiliateProfilePage({ params }: { params: { slug: string } }) {
    
    return (
        <>
            <SiteHeader />
            <AffiliateProfileContent slug={params.slug} />
            <SiteFooter />
        </>
    )
}
