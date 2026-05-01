import ProductListingPageShell from "@/app/components/product-listing/ProductListingPageShell";

export const metadata = {
  title: "Category Products | Monsta E-COM",
  description: "Browse Monsta E-COM category products.",
};

export default async function CategoryListingPage({ params }) {
  const { slug } = await params;

  return (
    <ProductListingPageShell
      filterType="category"
      slug={slug}
    />
  );
}
