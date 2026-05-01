import React from "react";
import Breadcrumbs from "../common/Breadcrumbs";
import AuthRequiredPage from "../common/AuthRequiredPage";
import CheckoutClient from "../components/checkout/CheckoutClient";

export const metadata = {
  title: "Checkout | Monsta E-COM",
  description: "Checkout securely with your Monsta E-COM account.",
};

export default function CheckoutPage() {
  return (
    <AuthRequiredPage message="Please login to checkout">
      <main className="min-h-[520px] bg-white">
        <Breadcrumbs tittle="Checkout" />
        <CheckoutClient />
      </main>
    </AuthRequiredPage>
  );
}
