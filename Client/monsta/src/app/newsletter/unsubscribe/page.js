import { Suspense } from "react";
import UnsubscribeConfirm from "@/app/components/newsletter/UnsubscribeConfirm";

export const metadata = {
  title: "Unsubscribe Newsletter | Monsta E-COM",
  description: "Confirm newsletter unsubscribe for Monsta E-COM.",
};

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense
      fallback={
        <section className="bg-[#f7f3f0] py-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white border border-[#eaded7] rounded p-10 text-center shadow-sm">
              Loading unsubscribe details...
            </div>
          </div>
        </section>
      }
    >
      <UnsubscribeConfirm />
    </Suspense>
  );
}
