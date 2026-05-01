import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import ProductBreadcrumb from "@/app/common/ProductBreadcrumb";
import RelatedProducts from "./relatedProducts";
import ProductCard from "@/app/common/ProductCard";
import UpSellProducts from "../upSellProducts";

async function getProduct(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APIBASEPATH}home/productdetails/${slug}`,
      {
        cache: "no-store",
      }
    );

    return await res.json();
  } catch (error) {
    return null;
  }
}

async function getAllProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APIBASEPATH}home/get-products`,
      {
        cache: "no-store",
      }
    );

    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}) {
  const { slug } =
    await params;

  const data =
    await getProduct(slug);

  if (!data?._status) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title:
      data.data._productName,
    description:
      data.data
        ._productShortDescription,
  };
}

export default async function Page({
  params,
}) {
  const { slug } =
    await params;

  const data =
    await getProduct(slug);

  if (!data?._status) {
    notFound();
  }

  const product =
    data.data;

  const allProductsRes =
    await getAllProducts();

  const allProducts =
    allProductsRes?.data ||
    [];

  /* Related Products */
  const relatedProducts =
    allProducts.filter(
      (item) =>
        item.slug !==
          product.slug &&
        item
          ?._productParentCategory
          ?._id ===
          product
            ?._productParentCategory
            ?._id
    );

  /* Upsell Products */
  const upSellProducts =
    allProducts.filter(
      (item) =>
        item.slug !==
          product.slug &&
        item._upsell ===
          true
    );

  return (
    <>

      <ProductBreadcrumb
        productName={
          product._productName
        }
        categoryName={
          product
            ?._productParentCategory
            ?._categoryName
        }
        categorySlug={
          product
            ?._productParentCategory
            ?._categoryName
            ?.toLowerCase()
            .replaceAll(
              " ",
              "-"
            )
        }
        subCategoryName={
          product
            ?._productSubCategory
            ?._subcategoryName
        }
        subCategorySlug={
          product
            ?._productSubCategory
            ?._subcategoryName
            ?.toLowerCase()
            .replaceAll(
              " ",
              "-"
            )
        }
      />

      <ProductDetailsClient
        product={product}
      />

      {/* Related Products */}
      <RelatedProducts>

        {relatedProducts.map(
          (
            item,
            index
          ) => (
            <ProductCard
              key={index}
              data={item}
            />
          )
        )}

      </RelatedProducts>

      {/* Upsell Products */}
      <UpSellProducts>

        {upSellProducts.map(
          (
            item,
            index
          ) => (
            <ProductCard
              key={index}
              data={item}
            />
          )
        )}

      </UpSellProducts>

    </>
  );
}