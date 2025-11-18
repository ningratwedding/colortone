

import { ProductPageContent } from "./product-client-content";

export default function ProductPage({ params }: { params: { id: string } }) {
    // The data fetching is now handled inside ProductPageContent which is a server component.
    // We just pass the ID down.
    return <ProductPageContent productId={params.id} />
}
