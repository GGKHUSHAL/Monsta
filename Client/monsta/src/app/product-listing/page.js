import ProductListingPageShell from "@/app/components/product-listing/ProductListingPageShell";

export const metadata = {
  title: "Product Listing | Monsta E-COM",
  description: "Browse all Monsta E-COM products with category, material, color, price and sorting filters.",
};

export default function ProductListingPage() {
  return <ProductListingPageShell />;
}
