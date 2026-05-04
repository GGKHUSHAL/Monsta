"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AuthRequiredLink from "@/app/common/AuthRequiredLink";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  selectCartItemByProductOptions,
  updateCartQuantity,
} from "@/app/redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsWishlisted,
} from "@/app/redux/wishlistSlice";

const sortOptions = [
  { label: "Featured Products", value: "featured" },
  { label: "New Arrivals", value: "new-arrivals" },
  { label: "On sale", value: "onsale" },
  { label: "Best Sellings", value: "best-selling" },
  { label: "Sort by price: low to high", value: "price-low-high" },
  { label: "Sort by price: high to low", value: "price-high-low" },
  { label: "Product Name: A to Z", value: "name-a-z" },
  { label: "Product Name: Z to A", value: "name-z-a" },
];

const normalize = (value) => String(value || "").trim();

const getProductPrice = (product) =>
  Number(product?._productSalePrice || product?._productPrice || 0);

const getProductCategoryLabel = (product) =>
  product?._productSubSubCategory?._subsubcategoryName ||
  product?._productSubCategory?._subcategoryName ||
  product?._productParentCategory?._categoryName ||
  "Product";

const getProductType = (product) =>
  normalize(product?._productType).toLowerCase();

const matchesCollection = (product, collection) => {
  if (!collection) return true;

  if (collection === "featured") {
    return getProductType(product) === "featured";
  }

  if (collection === "onsale") {
    return Boolean(product?._productSalePrice) || getProductType(product) === "onsale";
  }

  if (collection === "best-selling") {
    return Boolean(product?._bestSelling);
  }

  return true;
};

function ToggleCheckbox({ checked, label, onChange }) {
  return (
    <label className="flex items-center gap-3 text-[14px] text-[#333] leading-6 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-[17px] w-[17px] rounded border-[#b8b8b8] accent-[#c09578]"
      />
      <span>{label}</span>
    </label>
  );
}

function ListingProductCard({ product }) {
  const dispatch = useDispatch();
  const selectedColor = product?._productColor?.[0] || "";
  const selectedMaterial = product?._productMaterial?.[0]?._materialName || "";
  const isWishlisted = useSelector(selectIsWishlisted(product?._id));
  const cartItem = useSelector(
    selectCartItemByProductOptions(product?._id, selectedColor, selectedMaterial)
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        selectedColor,
        selectedMaterial,
      })
    );
    toast.success("Product added to cart");
  };

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product?._id));
      toast.success("Product removed from wishlist");
      return;
    }

    dispatch(addToWishlist(product));
    toast.success("Product added to wishlist");
  };

  return (
    <div className="w-full max-w-[245px] bg-white shadow-lg overflow-hidden border border-[#eeeeee] transition hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/product/${product?.slug || ""}`}
        className="block"
      >
        <img
          src={product?.imagePath || "/table.jpg"}
          alt={product?._productName || "Product"}
          className="h-[155px] w-full object-cover"
        />
      </Link>

      <div className="px-4 py-3 text-center">
        <p className="text-[12px] text-[#4d4d4d]">
          {getProductCategoryLabel(product)}
        </p>

        <Link
          href={`/product/${product?.slug || ""}`}
          className="block"
        >
          <h3 className="mt-2 min-h-[44px] font-[var(--font-playfair)] text-[17px] font-bold leading-snug text-[#111] hover:text-[#c09578]">
            {product?._productName}
          </h3>
        </Link>

        <div className="mt-4 flex justify-center gap-2 text-[14px]">
          <span className="text-[#555] line-through">
            Rs. {Number(product?._productPrice || 0).toLocaleString("en-IN")}
          </span>
          <span className="font-bold text-[#c09578]">
            Rs. {getProductPrice(product).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="mt-4 flex justify-center">
          <AuthRequiredLink
            href="/wishlist"
            className="flex h-[37px] w-[37px] items-center justify-center border border-[#eeeeee] text-[22px] text-black hover:text-[#c09578]"
            message="Please login to add product to wishlist"
            label="Add to wishlist"
            onClick={handleAddToWishlist}
            navigateOnClick={false}
          >
            {isWishlisted ? (
              <FaHeart className="text-[#c09578]" />
            ) : (
              <FaRegHeart />
            )}
          </AuthRequiredLink>
          {cartItem ? (
            <div className="flex h-[37px] items-center border border-[#eeeeee] text-[#333]">
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      id: cartItem.id,
                      quantity: cartItem.quantity - 1,
                    })
                  )
                }
                className="h-full px-3 text-[16px] hover:text-[#c09578]"
                aria-label={`Decrease quantity for ${product?._productName}`}
              >
                -
              </button>
              <span className="min-w-[28px] text-center text-[12px] font-bold">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      id: cartItem.id,
                      quantity: cartItem.quantity + 1,
                    })
                  )
                }
                className="h-full px-3 text-[16px] hover:text-[#c09578]"
                aria-label={`Increase quantity for ${product?._productName}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-[37px] border border-[#eeeeee] px-4 text-[12px] text-[#333] hover:text-[#c09578]"
            >
              Add To Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductListingClient({
  products = [],
  categories = [],
  initialFilter = null,
  initialCollection = "",
}) {
  const maxProductPrice = useMemo(() => {
    let prices = products.map(getProductPrice).filter(Boolean);
    return prices.length ? Math.max(...prices) : 200000;
  }, [products]);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    initialFilter?.type === "category" ? [initialFilter.id] : []
  );
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState(
    initialFilter?.type === "subcategory" ? [initialFilter.id] : []
  );
  const [selectedSubsubcategoryIds, setSelectedSubsubcategoryIds] = useState(
    initialFilter?.type === "subsubcategory" ? [initialFilter.id] : []
  );
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceValue, setPriceValue] = useState(maxProductPrice);
  const [appliedPrice, setAppliedPrice] = useState(maxProductPrice);
  const [sortValue, setSortValue] = useState(initialCollection || "featured");
  const [collectionValue, setCollectionValue] = useState(initialCollection);

  const materialOptions = useMemo(() => {
    let map = new Map();

    products.forEach((product) => {
      product?._productMaterial?.forEach((material) => {
        if (material?._id) {
          map.set(material._id, normalize(material._materialName));
        }
      });
    });

    return Array.from(map, ([id, name]) => ({ id, name })).filter(
      (item) => item.name
    );
  }, [products]);

  const colorOptions = useMemo(() => {
    let values = new Set();

    products.forEach((product) => {
      product?._productColor?.forEach((color) => {
        if (normalize(color)) values.add(normalize(color));
      });
    });

    return Array.from(values);
  }, [products]);

  const toggleValue = (setter, value) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setSelectedSubsubcategoryIds([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setPriceValue(maxProductPrice);
    setAppliedPrice(maxProductPrice);
    setCollectionValue("");
  };

  const hasCategoryFilter =
    selectedCategoryIds.length > 0 ||
    selectedSubcategoryIds.length > 0 ||
    selectedSubsubcategoryIds.length > 0;
  const hasAnyFilter =
    hasCategoryFilter ||
    selectedMaterials.length > 0 ||
    selectedColors.length > 0 ||
    appliedPrice < maxProductPrice ||
    Boolean(collectionValue);

  const filteredProducts = useMemo(() => {
    let data = products.filter((product) => {
      let categoryId = product?._productParentCategory?._id;
      let subcategoryId = product?._productSubCategory?._id;
      let subsubcategoryId = product?._productSubSubCategory?._id;
      let productMaterials =
        product?._productMaterial?.map((material) => material?._id) || [];
      let productColors = product?._productColor?.map(normalize) || [];

      let matchesCategory =
        !hasCategoryFilter ||
        selectedCategoryIds.includes(categoryId) ||
        selectedSubcategoryIds.includes(subcategoryId) ||
        selectedSubsubcategoryIds.includes(subsubcategoryId);

      let matchesMaterial =
        selectedMaterials.length === 0 ||
        selectedMaterials.some((id) => productMaterials.includes(id));

      let matchesColor =
        selectedColors.length === 0 ||
        selectedColors.some((color) => productColors.includes(color));

      let matchesPrice = getProductPrice(product) <= appliedPrice;
      let matchesSelectedCollection = matchesCollection(product, collectionValue);

      return (
        matchesCategory &&
        matchesMaterial &&
        matchesColor &&
        matchesPrice &&
        matchesSelectedCollection
      );
    });

    return [...data].sort((a, b) => {
      if (sortValue === "new-arrivals") {
        return new Date(b._product_Creted_at) - new Date(a._product_Creted_at);
      }
      if (sortValue === "onsale") {
        return Number(Boolean(b._productSalePrice)) - Number(Boolean(a._productSalePrice));
      }
      if (sortValue === "best-selling") {
        return Number(Boolean(b._bestSelling)) - Number(Boolean(a._bestSelling));
      }
      if (sortValue === "price-low-high") {
        return getProductPrice(a) - getProductPrice(b);
      }
      if (sortValue === "price-high-low") {
        return getProductPrice(b) - getProductPrice(a);
      }
      if (sortValue === "name-a-z") {
        return normalize(a._productName).localeCompare(normalize(b._productName));
      }
      if (sortValue === "name-z-a") {
        return normalize(b._productName).localeCompare(normalize(a._productName));
      }
      return Number(a._productOrder || 0) - Number(b._productOrder || 0);
    });
  }, [
    appliedPrice,
    hasCategoryFilter,
    products,
    collectionValue,
    selectedCategoryIds,
    selectedColors,
    selectedMaterials,
    selectedSubcategoryIds,
    selectedSubsubcategoryIds,
    sortValue,
  ]);

  return (
    <>
      <section className="border-y border-[#eeeeee] bg-[#f8f8f8] py-12 text-center">
        <h1 className="font-[var(--font-playfair)] text-[38px] font-bold text-[#111]">
          Product Listing
        </h1>
        <div className="mt-2 flex justify-center gap-2 text-[14px]">
          <Link href="/" className="hover:text-[#c09578]">
            Home
          </Link>
          <span>{">"}</span>
          <span className="text-[#c09578]">Product Listing</span>
        </div>
      </section>

      <section className="max-w-[1120px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="self-start border-r-4 border-[#c09578] pr-8">
            <h2 className="font-[var(--font-playfair)] text-[26px] font-bold text-[#111]">
              Categories
            </h2>

            <div className="mt-7">
              <ToggleCheckbox
                checked={!hasAnyFilter}
                label="All Products"
                onChange={resetAllFilters}
              />
            </div>

            <div className="mt-7 space-y-7">
              {categories.map((category) => (
                <div key={category._id}>
                  <h3 className="font-[var(--font-playfair)] text-[20px] font-bold text-[#333]">
                    {category._categoryName}
                  </h3>

                  <div className="mt-4 space-y-3">
                    <ToggleCheckbox
                      checked={selectedCategoryIds.includes(category._id)}
                      label={`All ${category._categoryName}`}
                      onChange={() => toggleValue(setSelectedCategoryIds, category._id)}
                    />

                    {category?.subcategories?.map((subcategory) => (
                      <div key={subcategory._id} className="space-y-3">
                        <ToggleCheckbox
                          checked={selectedSubcategoryIds.includes(subcategory._id)}
                          label={subcategory._subcategoryName}
                          onChange={() =>
                            toggleValue(setSelectedSubcategoryIds, subcategory._id)
                          }
                        />

                        <div className="space-y-3 pl-7">
                          {subcategory?.subSubcategories?.map((subsubcategory) => (
                            <ToggleCheckbox
                              key={subsubcategory._id}
                              checked={selectedSubsubcategoryIds.includes(
                                subsubcategory._id
                              )}
                              label={subsubcategory._subsubcategoryName}
                              onChange={() =>
                                toggleValue(
                                  setSelectedSubsubcategoryIds,
                                  subsubcategory._id
                                )
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {materialOptions.length > 0 && (
              <div className="mt-10 border-t border-[#e5e5e5] pt-8">
                <h2 className="font-[var(--font-playfair)] text-[26px] font-bold text-[#111]">
                  Material
                </h2>
                <div className="mt-7 space-y-5">
                  {materialOptions.map((material) => (
                    <ToggleCheckbox
                      key={material.id}
                      checked={selectedMaterials.includes(material.id)}
                      label={material.name}
                      onChange={() => toggleValue(setSelectedMaterials, material.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {colorOptions.length > 0 && (
              <div className="mt-10 border-t border-[#e5e5e5] pt-8">
                <h2 className="font-[var(--font-playfair)] text-[26px] font-bold text-[#111]">
                  Color
                </h2>
                <div className="mt-7 space-y-5">
                  {colorOptions.map((color) => (
                    <ToggleCheckbox
                      key={color}
                      checked={selectedColors.includes(color)}
                      label={color}
                      onChange={() => toggleValue(setSelectedColors, color)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 border-t border-[#e5e5e5] pt-8">
              <h2 className="font-[var(--font-playfair)] text-[26px] font-bold text-[#111]">
                Filter By Price
              </h2>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={priceValue}
                onChange={(event) => setPriceValue(Number(event.target.value))}
                className="mt-6 w-full accent-[#c09578]"
              />
              <p className="mt-3 text-[14px] font-bold text-[#333]">
                Rs. 0 - Rs. {Number(priceValue).toLocaleString("en-IN")}
              </p>
              <button
                type="button"
                onClick={() => setAppliedPrice(priceValue)}
                className="mt-2 bg-[#1f1f23] px-5 py-2 text-[12px] font-bold text-white hover:bg-[#c09578]"
              >
                Filter
              </button>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="flex flex-col items-start justify-between gap-4 border border-[#eeeeee] px-6 py-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 sm:ml-auto">
                <label className="text-[14px] text-[#333]" htmlFor="sort-products">
                  Sort By :
                </label>
                <select
                  id="sort-products"
                  value={sortValue}
                  onChange={(event) => setSortValue(event.target.value)}
                  className="h-[36px] border border-[#cfcfcf] bg-white px-4 text-[14px] outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[14px] text-[#333]">
                Showing {filteredProducts.length > 0 ? 1 : 0}-{filteredProducts.length} of{" "}
                {filteredProducts.length} results
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="mt-7 grid grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ListingProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-7 border border-[#eeeeee] p-10 text-center text-[#555]">
                No products found for selected filters.
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
}
