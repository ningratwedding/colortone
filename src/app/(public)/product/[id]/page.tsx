
import { ProductPageContent } from "./product-client-content";

export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductPageContent productId={params.id} />
}
