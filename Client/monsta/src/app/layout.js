import { Geist_Mono, Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "./common/Header";
import Footer from "./common/Footer";
import MainRootFile from "./MainRootFile";
import BackToTop from "./common/BackToTop";
import { getCompanyProfile, getHeaderCategories } from "./services/homeServices";

// 🔹 Optional (Geist)
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// 🔥 Main Font (UI ke liye best)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

export const metadata = {
  title: "Monsta E-COM",
  description: "E-commerce Website",
};

export default async function RootLayout({ children }) {
  const [companyProfileRes, headerCategoriesRes] =
    await Promise.all([
      getCompanyProfile(),
      getHeaderCategories(),
    ]);
  const companyProfile =
    companyProfileRes?.data || null;
  const headerCategories =
    headerCategoriesRes?.data || [];

  return (
    <html lang="en">
      <body
        className={`
          ${geistMono.variable}
          ${playfair.variable}
          ${lato.variable}
          antialiased
        `}
      >
        <MainRootFile>
          <Header
            companyProfile={companyProfile}
            categories={headerCategories}
          />

          {children}

          <Footer companyProfile={companyProfile} />
          <BackToTop />
        </MainRootFile>
      </body>
    </html>
  );
}
