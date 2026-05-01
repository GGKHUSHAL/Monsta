import React from "react";
import Breadcrumbs from "../common/Breadcrumbs";
import { getFaqs } from "../services/homeServices";
import FaqAccordion from "../components/faq/FaqAccordion";

export const metadata = {
  title: "Frequently Questions | Monsta E-COM",
  description: "Find answers to frequently asked questions about Monsta E-COM.",
};

const fallbackFaqs = [
  {
    _id: "fallback-1",
    _faqQuestion: "Morbi gravida, nisi id fringilla ultricies, elit lorem ipsum?",
    _faqAnswere:
      "Donec mattis finibus elit ut tristique. Nullam tempus nunc eget arcu vulputate, eu porttitor tellus commodo. Aliquam erat volutpat. Aliquam consectetur lorem eu viverra lobortis. Morbi gravida, nisi id fringilla ultricies, elit lorem eleifend lorem",
  },
  {
    _id: "fallback-2",
    _faqQuestion: "Aenean elit orci, efficitur quis nisl at, accumsan?",
    _faqAnswere:
      "Donec mattis finibus elit ut tristique. Nullam tempus nunc eget arcu vulputate, eu porttitor tellus commodo.",
  },
  {
    _id: "fallback-3",
    _faqQuestion: "Pellentesque habitant morbi tristique senectus et netus?",
    _faqAnswere:
      "Aliquam erat volutpat. Aliquam consectetur lorem eu viverra lobortis.",
  },
];

export default async function FrequentlyQuestionsPage() {
  const faqRes = await getFaqs();
  const faqs = faqRes?.data?.length ? faqRes.data : fallbackFaqs;

  return (
    <main className="min-h-[560px] bg-white text-black">
      <Breadcrumbs tittle="Frequently Questions" />

      <div className="mx-auto max-w-[1140px] px-4 pb-16">
        <div className="border-t border-[#ebebeb]"></div>

        <section className="pt-10">
          <FaqAccordion faqs={faqs} />
        </section>
      </div>
    </main>
  );
}
