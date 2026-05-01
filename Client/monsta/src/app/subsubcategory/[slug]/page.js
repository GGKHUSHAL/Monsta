import ProductListingPageShell from "@/app/components/product-listing/ProductListingPageShell";

export const metadata = {
  title: "Product Listing | Monsta E-COM",
  description: "Browse Monsta E-COM products by sub-subcategory.",
};

export default async function SubsubcategoryListingPage({ params }) {
  const { slug } = await params;

  return (
    <ProductListingPageShell
      filterType="subsubcategory"
      slug={slug}
    />
  );
}
