
import CreatorProfileContent from './creator-profile-client';

export default function CreatorProfilePage({ params }: { params: { slug: string } }) {
    return <CreatorProfileContent slug={params.slug} />;
}
