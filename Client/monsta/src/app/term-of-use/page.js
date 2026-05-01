import React from "react";
import Breadcrumbs from "../common/Breadcrumbs";

export const metadata = {
  title: "Term Of Use | Monsta E-COM",
  description: "Read the Monsta E-COM terms of use.",
};

export default function TermOfUsePage() {
  return (
    <main className="bg-white text-black">
      <Breadcrumbs tittle="Term Of Use" />

      <div className="mx-auto max-w-[1140px] px-4 pb-16">
        <div className="border-t border-[#ebebeb]"></div>

        <article className="pt-16 text-[15px] leading-7">
          <section className="mb-6">
            <h2 className="mb-5 text-[26px] font-medium">
              Who we are
            </h2>
            <p>
              Our website address is:{" "}
              <span className="text-[#c09578]">
                http://localhost/furniture
              </span>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-5 text-[26px] font-medium">
              What personal data we collect and why we collect it
            </h2>

            <h3 className="mb-2 text-[24px] font-medium">
              Comments
            </h3>
            <p className="mb-6">
              When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor&apos;s IP address and browser user agent string to help spam detection.
            </p>
            <p>
              An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[24px] font-medium">
              Media
            </h3>
            <p>
              If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[24px] font-medium">
              Cookies
            </h3>
            <p className="mb-6">
              If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
            </p>
            <p className="mb-6">
              If you have an account and you log in to this site, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
            </p>
            <p className="mb-6">
              When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select &quot;Remember Me&quot;, your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
            </p>
            <p>
              If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[24px] font-medium">
              Embedded content from other websites
            </h3>
            <p className="mb-6">
              Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
            </p>
            <p>
              These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with that embedded content if you have an account and are logged in to that website.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[24px] font-medium">
              How long we retain your data
            </h3>
            <p className="mb-6">
              If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
            </p>
            <p>
              For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[24px] font-medium">
              What rights you have over your data
            </h3>
            <p>
              If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-[24px] font-medium">
              Where we send your data
            </h3>
            <p>
              Visitor comments may be checked through an automated spam detection service.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
