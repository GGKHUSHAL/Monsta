import WishlistClient from "@/app/components/wishlist/WishlistClient";

export const metadata = {
  title: "My Wishlist | Monsta E-COM",
  description: "View saved Monsta E-COM wishlist products, check stock status and add items to cart.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
