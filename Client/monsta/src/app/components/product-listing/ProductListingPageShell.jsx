import ProductListingClient from "./ProductListingClient";
import { getHeaderCategories, getProductbyType } from "@/app/services/homeServices";

const decodeSlug = (slug = "") => decodeURIComponent(slug);

const findInitialFilter = (categories, type, slug) => {
  if (!type || !slug) return null;

  let decodedSlug = decodeSlug(slug);

  for (let category of categories) {
    if (type === "category" && category.slug === decodedSlug) {
      return { type, id: category._id };
    }

    for (let subcategory of category.subcategories || []) {
      if (type === "subcategory" && subcategory.slug === decodedSlug) {
        return { type, id: subcategory._id };
      }

      for (let subsubcategory of subcategory.subSubcategories || []) {
        if (
          type === "subsubcategory" &&
          subsubcategory.slug === decodedSlug
        ) {
          return { type, id: subsubcategory._id };
        }
      }
    }
  }

  return null;
};

export default async function ProductListingPageShell({ filterType, slug }) {
  const [productsRes, categoriesRes] = await Promise.all([
    getProductbyType(),
    getHeaderCategories(),
  ]);

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];
  const initialFilter = findInitialFilter(categories, filterType, slug);

  return (
    <ProductListingClient
      products={products}
      categories={categories}
      initialFilter={initialFilter}
    />
  );
}
