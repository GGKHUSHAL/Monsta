"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { unsubscribeNewsletter } from "@/app/services/homeServices";

export default function UnsubscribeConfirm() {
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const hasValidLink = Boolean(email && token);

  const handleUnsubscribe = async () => {
    if (!hasValidLink) {
      toast.error("Invalid unsubscribe link");
      return;
    }

    setIsSubmitting(true);
    let finalRes = await unsubscribeNewsletter({ email, token });
    setIsSubmitting(false);

    if (finalRes?._status) {
      setIsUnsubscribed(true);
      toast.success(finalRes?._message || "You have been unsubscribed");
      return;
    }

    toast.error(finalRes?._message || "Newsletter unsubscribe failed");
  };

  return (
    <section className="bg-[#f7f3f0] py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-[#eaded7] rounded p-6 sm:p-10 text-center shadow-sm">
          <p className="text-sm uppercase text-[#c09578] font-semibold">
            Newsletter
          </p>
          <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl mt-3 text-[#222]">
            Unsubscribe confirmation
          </h1>

          {isUnsubscribed ? (
            <>
              <p className="mt-5 text-[#555] leading-7">
                {email} has been removed from active newsletter emails. You can
                subscribe again anytime from the home page.
              </p>
              <Link
                href="/"
                className="inline-flex mt-8 bg-[#c09578] text-white px-7 py-3 rounded font-semibold hover:opacity-90 transition"
              >
                Back to Home
              </Link>
            </>
          ) : (
            <>
              <p className="mt-5 text-[#555] leading-7">
                Please confirm that you want to stop receiving Monsta E-COM
                newsletter, offer, and product update emails for
                <span className="font-semibold text-[#222]"> {email || "this email"}</span>.
              </p>

              {!hasValidLink && (
                <p className="mt-5 text-sm text-red-600">
                  This unsubscribe link is missing required information.
                </p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  disabled={!hasValidLink || isSubmitting}
                  onClick={handleUnsubscribe}
                  className="bg-[#c09578] text-white px-7 py-3 rounded font-semibold hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Unsubscribing..." : "Confirm Unsubscribe"}
                </button>
                <Link
                  href="/"
                  className="border border-[#c09578] text-[#a77a5e] px-7 py-3 rounded font-semibold hover:bg-[#f7f3f0] transition"
                >
                  Keep Subscription
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
