import { SiteFooter } from '@/components/site-footer';
import * as React from 'react';
import { AffiliateProfileContent } from './affiliate-profile-client';

export default function AffiliateProfilePage({ params }: { params: { slug: string } }) {
    
    return (
        <>
            <AffiliateProfileContent slug={params.slug} />
            <SiteFooter />
        </>
    )
}
