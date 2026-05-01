"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { clearCart, selectCartItems, selectCartSubtotal } from "@/app/redux/cartSlice";
import {
  createRazorpayOrder,
  getCountries,
  placeOrder,
  verifyRazorpayPayment,
} from "@/app/services/homeServices";

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

const emptyCheckoutForm = {
  name: "",
  mobile: "",
  billingName: "",
  billingEmail: "",
  billingMobile: "",
  billingAddress: "",
  country: "",
  state: "",
  city: "",
  postcode: "",
  shippingName: "",
  shippingEmail: "",
  shippingMobile: "",
  shippingAddress: "",
  shippingCountry: "",
  shippingState: "",
  shippingCity: "",
  shippingPostcode: "",
};

const buildCheckoutForm = (userData = {}) => {
  const billing = userData.billingAddress || {};
  const shipping = userData.shippingAddress || {};

  return {
    name: userData.name || "",
    mobile: userData.phone_number || "",
    billingName: billing.name || userData.name || "",
    billingEmail: billing.email || userData.email || "",
    billingMobile: billing.mobile || userData.phone_number || "",
    billingAddress: billing.address || userData.address || "",
    country: billing.country || "",
    state: billing.state || "",
    city: billing.city || "",
    postcode: billing.postcode || billing.zip || "",
    shippingName: shipping.name || userData.name || "",
    shippingEmail: shipping.email || userData.email || "",
    shippingMobile: shipping.mobile || userData.phone_number || "",
    shippingAddress: shipping.address || userData.address || "",
    shippingCountry: shipping.country || "",
    shippingState: shipping.state || "",
    shippingCity: shipping.city || "",
    shippingPostcode: shipping.postcode || shipping.zip || "",
  };
};

function Field({ label, className = "", name, value, onChange, ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="font-[var(--font-playfair)] text-[16px] font-bold text-black">
        {label}
      </span>
      <input
        {...props}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 h-[40px] w-full border border-[#e5e5e5] px-3 text-[14px] outline-none focus:border-[#c09578]"
      />
    </label>
  );
}

function CountrySelect({ label, className = "", name, value, onChange, countries }) {
  return (
    <label className={`block ${className}`}>
      <span className="font-[var(--font-playfair)] text-[16px] font-bold text-black">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 h-[40px] w-full border border-[#e5e5e5] bg-white px-3 text-[14px] outline-none focus:border-[#c09578]"
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country._id} value={country._countryName}>
            {country._countryName}
          </option>
        ))}
      </select>
    </label>
  );
}

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutClient() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const token = useSelector((state) => state.authStore.token);
  const [shipDifferent, setShipDifferent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState(emptyCheckoutForm);
  const [countries, setCountries] = useState([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEPATH;
  const discount = 0;
  const total = subtotal - discount;

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const getUserData = useCallback(() => {
    if (!token) return;

    axios
      .post(
        `${apiBaseUrl}user/get-data`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data._status) {
          setForm(buildCheckoutForm(response.data.userData));
        }
      })
      .catch(() => {
        toast.error("Unable to fetch profile address");
      });
  }, [apiBaseUrl, token]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    getCountries().then((response) => {
      if (response?._status) {
        setCountries(response.data || []);
      }
    });
  }, []);

  const handleUpdateAddress = async () => {
    const billingAddress = {
      name: form.billingName,
      email: form.billingEmail,
      mobile: form.billingMobile,
      address: form.billingAddress,
      country: form.country,
      state: form.state,
      city: form.city,
      postcode: form.postcode,
    };

    const requiredBillingFields = [
      billingAddress.name,
      billingAddress.email,
      billingAddress.mobile,
      billingAddress.address,
      billingAddress.country,
      billingAddress.state,
      billingAddress.city,
    ];

    if (requiredBillingFields.some((value) => !String(value || "").trim())) {
      toast.error("Please fill all billing address fields");
      return false;
    }

    const payload = { billingAddress };

    if (shipDifferent) {
      const shippingAddress = {
        name: form.shippingName,
        email: form.shippingEmail,
        mobile: form.shippingMobile,
        address: form.shippingAddress,
        country: form.shippingCountry,
        state: form.shippingState,
        city: form.shippingCity,
        postcode: form.shippingPostcode,
      };

      const requiredShippingFields = [
        shippingAddress.name,
        shippingAddress.email,
        shippingAddress.mobile,
        shippingAddress.address,
        shippingAddress.country,
        shippingAddress.state,
        shippingAddress.city,
      ];

      if (requiredShippingFields.some((value) => !String(value || "").trim())) {
        toast.error("Please fill all shipping address fields");
        return false;
      }

      payload.shippingAddress = shippingAddress;
    }

    try {
      setIsSavingAddress(true);
      const response = await axios.post(`${apiBaseUrl}user/update-addresses`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data._status) {
        toast.success(response.data._message || "Address updated in profile");
        getUserData();
        return true;
      }

      toast.error(response.data._message || "Address update failed");
      return false;
    } catch (error) {
      toast.error(error.response?.data?._message || "Something went wrong");
      return false;
    } finally {
      setIsSavingAddress(false);
    }
  };

  const buildOrderPayload = () => {
    const billingAddress = {
      name: form.billingName,
      email: form.billingEmail,
      mobile: form.billingMobile,
      address: form.billingAddress,
      country: form.country,
      state: form.state,
      city: form.city,
      postcode: form.postcode,
    };

    const shippingAddress = shipDifferent
      ? {
          name: form.shippingName,
          email: form.shippingEmail,
          mobile: form.shippingMobile,
          address: form.shippingAddress,
          country: form.shippingCountry,
          state: form.shippingState,
          city: form.shippingCity,
          postcode: form.shippingPostcode,
        }
      : billingAddress;

    return {
      items: cartItems,
      billingAddress,
      shippingAddress,
      orderNotes,
      paymentMethod,
      discount,
    };
  };

  const handlePlaceOrder = async () => {
    const addressSaved = await handleUpdateAddress();

    if (!addressSaved) return;

    const orderPayload = buildOrderPayload();

    try {
      setIsPlacingOrder(true);

      if (paymentMethod === "online") {
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          toast.error("Unable to load Razorpay checkout");
          return;
        }

        const razorpayOrderResponse = await createRazorpayOrder({
          token,
          orderData: orderPayload,
        });

        if (!razorpayOrderResponse?._status) {
          toast.error(
            razorpayOrderResponse?._error
              ? `${razorpayOrderResponse._message} (${razorpayOrderResponse._error})`
              : razorpayOrderResponse?._message || "Unable to start online payment"
          );
          return;
        }

        const razorpayOrder = razorpayOrderResponse.order;
        const key = razorpayOrderResponse.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        const options = {
          key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || "INR",
          name: "Monsta E-COM",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          prefill: {
            name: orderPayload.billingAddress.name,
            email: orderPayload.billingAddress.email,
            contact: orderPayload.billingAddress.mobile,
          },
          theme: {
            color: "#c09578",
          },
          handler: async (paymentResponse) => {
            const verifyResponse = await verifyRazorpayPayment({
              token,
              paymentData: {
                ...orderPayload,
                paymentMethod: "online",
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
            });

            if (verifyResponse?._status) {
              toast.success(
                verifyResponse.orderData?.orderNumber
                  ? `Order placed: ${verifyResponse.orderData.orderNumber}`
                  : verifyResponse._message || "Order placed successfully"
              );
              dispatch(clearCart());
              return;
            }

            toast.error(
              verifyResponse?._error
                ? `${verifyResponse._message} (${verifyResponse._error})`
                : verifyResponse?._message || "Payment verification failed"
            );
          },
          modal: {
            ondismiss: () => {
              toast.info("Online payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return;
      }

      const response = await placeOrder({
        token,
        orderData: orderPayload,
      });

      if (response?._status) {
        toast.success(
          response.orderData?.orderNumber
            ? `Order placed: ${response.orderData.orderNumber}`
            : response._message || "Order placed successfully"
        );
        dispatch(clearCart());
        return;
      }

      toast.error(
        response?._error
          ? `${response._message} (${response._error})`
          : response?._message || "Order failed"
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const orderRows = useMemo(
    () =>
      cartItems.map((item) => ({
        ...item,
        total: Number(item.price || 0) * Number(item.quantity || 0),
      })),
    [cartItems]
  );

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-[1140px] px-4 py-14">
        <div className="border border-[#ebebeb] bg-white p-10 text-center">
          <h2 className="font-[var(--font-playfair)] text-[26px] font-bold text-[#111]">
            Your cart is empty!
          </h2>
          <Link
            href="/product-listing"
            className="mt-5 inline-block bg-[#c09578] px-6 py-3 text-sm font-bold text-white hover:bg-[#a87c5f]"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1140px] px-4 py-10">
      <div className="border-t border-[#ebebeb] pt-10">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[1fr_420px]">
          <div>
            <h2 className="bg-[#1f1f1f] px-4 py-3 font-[var(--font-playfair)] text-[17px] font-bold text-white">
              BILLING DETAILS
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Name*" name="name" value={form.name} onChange={handleFieldChange} />
              <Field label="Mobile Number*" name="mobile" value={form.mobile} onChange={handleFieldChange} />
              <Field label="Billing Name*" name="billingName" value={form.billingName} onChange={handleFieldChange} />
              <Field label="Billing Email*" name="billingEmail" type="email" value={form.billingEmail} onChange={handleFieldChange} />
              <Field label="Billing Mobile Number*" name="billingMobile" value={form.billingMobile} onChange={handleFieldChange} className="sm:col-span-2" />
              <Field label="Billing Address*" name="billingAddress" value={form.billingAddress} onChange={handleFieldChange} className="sm:col-span-2" />
              <CountrySelect label="Country*" name="country" value={form.country} onChange={handleFieldChange} countries={countries} />
              <Field label="State*" name="state" value={form.state} onChange={handleFieldChange} />
              <Field label="City*" name="city" value={form.city} onChange={handleFieldChange} />
              <Field label="Postcode / ZIP*" name="postcode" value={form.postcode} onChange={handleFieldChange} />
            </div>

            <label className="mt-7 flex items-center gap-3">
              <input
                type="checkbox"
                checked={shipDifferent}
                onChange={(event) => setShipDifferent(event.target.checked)}
                className="h-4 w-4 accent-[#c09578]"
              />
              <span className="bg-[#1f1f1f] px-3 py-2 font-[var(--font-playfair)] text-[16px] font-bold text-white">
                Ship To A Different Address?
              </span>
            </label>

            {shipDifferent && (
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Shipping Name*" name="shippingName" value={form.shippingName} onChange={handleFieldChange} />
                <Field label="Shipping Email*" name="shippingEmail" type="email" value={form.shippingEmail} onChange={handleFieldChange} />
                <Field label="Shipping Mobile Number*" name="shippingMobile" value={form.shippingMobile} onChange={handleFieldChange} />
                <Field label="Shipping Address*" name="shippingAddress" value={form.shippingAddress} onChange={handleFieldChange} className="sm:col-span-2" />
                <CountrySelect label="Shipping Country*" name="shippingCountry" value={form.shippingCountry} onChange={handleFieldChange} countries={countries} />
                <Field label="Shipping State*" name="shippingState" value={form.shippingState} onChange={handleFieldChange} />
                <Field label="Shipping City*" name="shippingCity" value={form.shippingCity} onChange={handleFieldChange} />
                <Field label="Shipping Postcode / ZIP*" name="shippingPostcode" value={form.shippingPostcode} onChange={handleFieldChange} />
              </div>
            )}

            <button
              type="button"
              onClick={handleUpdateAddress}
              disabled={isSavingAddress}
              className="mt-6 bg-[#1f1f1f] px-6 py-3 text-[12px] font-bold text-white hover:bg-[#c09578] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingAddress ? "UPDATING..." : "UPDATE ADDRESS"}
            </button>

            <label className="mt-6 block">
              <span className="font-[var(--font-playfair)] text-[16px] font-bold text-black">
                Order Notes
              </span>
              <textarea
                value={orderNotes}
                onChange={(event) => setOrderNotes(event.target.value)}
                placeholder="Notes about your order, e.g. special notes for delivery."
                className="mt-2 h-[102px] w-full resize-none border border-[#e5e5e5] px-5 py-3 text-[14px] outline-none focus:border-[#c09578]"
              />
            </label>
          </div>

          <aside>
            <h2 className="bg-[#1f1f1f] px-4 py-3 font-[var(--font-playfair)] text-[17px] font-bold text-white">
              YOUR ORDER
            </h2>

            <table className="w-full border border-[#ebebeb] text-center">
              <thead>
                <tr className="bg-[#f4f4f4] font-[var(--font-playfair)] text-[16px] font-bold text-black">
                  <th className="border border-[#ebebeb] px-4 py-4">Product</th>
                  <th className="border border-[#ebebeb] px-4 py-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderRows.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-[#ebebeb] px-4 py-4 font-bold">
                      {item.name} × {item.quantity}
                    </td>
                    <td className="border border-[#ebebeb] px-4 py-4 font-bold">
                      Rs. {formatPrice(item.total)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-[#ebebeb] px-4 py-4 font-[var(--font-playfair)] font-bold">
                    Cart Subtotal
                  </td>
                  <td className="border border-[#ebebeb] px-4 py-4">
                    Rs. {formatPrice(subtotal)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#ebebeb] px-4 py-4 font-[var(--font-playfair)] font-bold">
                    Discount (-)
                  </td>
                  <td className="border border-[#ebebeb] px-4 py-4 font-bold">
                    Rs. {formatPrice(discount)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#ebebeb] px-4 py-4 font-[var(--font-playfair)] font-bold">
                    Order Total
                  </td>
                  <td className="border border-[#ebebeb] px-4 py-4 font-bold text-[#c09578]">
                    Rs. {formatPrice(total)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 border border-[#ebebeb]">
              <h3 className="bg-[#1f1f1f] px-4 py-3 font-[var(--font-playfair)] text-[17px] font-bold text-white">
                PAYMENT METHOD
              </h3>
              <div className="space-y-4 p-5">
                <label className="flex cursor-pointer items-center gap-3 font-semibold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="accent-[#c09578]"
                  />
                  Cash On Delivery
                </label>
                <label className="flex cursor-pointer items-center gap-3 font-semibold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="accent-[#c09578]"
                  />
                  Online Payment
                </label>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSavingAddress || isPlacingOrder}
                  className="mt-2 w-full bg-[#c09578] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#a87c5f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlacingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
