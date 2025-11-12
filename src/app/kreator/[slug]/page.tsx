import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import * as React from 'react';
import { CreatorProfileContent } from './creator-profile-client';

export default function CreatorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    return (
        <>
            <SiteHeader />
            <CreatorProfileContent slug={slug} />
            <SiteFooter />
        </>
    )
}
