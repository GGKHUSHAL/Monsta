import React from "react";
import ContactFormSection from "../components/contact-us/ContactFormSection";
import Breadcrumbs from "../common/Breadcrumbs";
import { getCompanyProfile } from "../services/homeServices";

export const metadata = {
  title: "Contact Us | Monsta E-COM",
  description: "Contact Monsta E-COM for furniture support, address, phone, email and location details.",
};

const getMapUrl = (input) => {
  if (!input) {
    return "https://www.google.com/maps?q=Jodhpur%2C%20Rajasthan&output=embed";
  }

  const url = input.trim();
  const match = url.match(/src=["']([^"']+)["']/i);

  if (match?.[1]) {
    return match[1];
  }

  if (
    url.includes("/maps/embed") ||
    url.includes("output=embed") ||
    url.includes("google.com/maps/embed")
  ) {
    return url;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
};

export default async function page() {
  const companyProfileRes =
    await getCompanyProfile();
  const companyProfile =
    companyProfileRes?.data || null;
  const mapUrl =
    getMapUrl(companyProfile?.company_map_location);

  return (
    <>
      <div className="w-full">

        {/* Header Section */}
        <Breadcrumbs tittle="Contact Us" />


        {/* Divider */}
        <div className="border-b"></div>

        {/* Map Section */}
        <div className="w-full py-10 bg-white">
          <div className="w-[95%] max-w-[1200px] mx-auto">

            <div className="w-full h-[450px] rounded-md overflow-hidden shadow">

              <iframe
                title="Company location"
                src={mapUrl}
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

            </div>

          </div>
        </div>

      </div>

      {/*Contact-us*/}
      <ContactFormSection companyProfile={companyProfile} />
    </>
  );
}
