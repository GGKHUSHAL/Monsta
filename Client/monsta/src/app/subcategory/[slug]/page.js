import ProductListingPageShell from "@/app/components/product-listing/ProductListingPageShell";

export const metadata = {
  title: "Subcategory Products | Monsta E-COM",
  description: "Browse Monsta E-COM subcategory products.",
};

export default async function SubcategoryListingPage({ params }) {
  const { slug } = await params;

  return (
    <ProductListingPageShell
      filterType="subcategory"
      slug={slug}
    />
  );
}
