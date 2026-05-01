import ProductCard from "./common/ProductCard";
import Bestsellingproducts from "./components/home/Bestsellingproducts";
import HeroSlider from "./components/home/HeroSlider";
import TabSection from "./components/home/TabSection";
import TestimonialSlider from "./components/home/Customers";
import NewsletterForm from "./components/home/NewsletterForm";
import WhyChooseUs from "./components/home/WhyChooseUs";
import { getHomePageData, getProductbyType } from "./services/homeServices";

export default async function Home() {

  let [data, homePageData] =
    await Promise.all([
      getProductbyType(),
      getHomePageData()
    ]);

  let allProducts =
    data?.data || [];
  let sliders =
    homePageData?.data?.sliders || [];
  let testimonials =
    homePageData?.data?.testimonials || [];
  let whyChooseUs =
    homePageData?.data?.whyChooseUs || [];

  let bestSellingProducts =
    allProducts.filter(
      (item) =>
        item._bestSelling ===
        true
    );

  return (
    <>

      <HeroSlider sliders={sliders} />

      {/* chair section */}
      <div className="w-full py-10 bg-amber-50 text-black">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">

          <div className="relative h-[260px] overflow-hidden bg-yellow-400 group">
            <img
              src="/chair1.jpg"
              alt="chair"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-90 group-hover:contrast-110"
            />

            <div className="absolute top-6 left-6">
              <p className="text-sm font-medium">
                Design Creative
              </p>

              <h3 className="text-2xl font-semibold mt-1">
                Chair Collection
              </h3>
            </div>
          </div>

          <div className="relative h-[260px] overflow-hidden bg-red-600 group">
            <img
              src="/chair2.jpg"
              alt="chair"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-90 group-hover:contrast-110"
            />

            <div className="absolute top-6 left-6 text-black">
              <p className="text-sm font-medium">
                Bestselling Products
              </p>

              <h3 className="text-2xl font-semibold mt-1">
                Chair Collection
              </h3>
            </div>
          </div>

          <div className="relative h-[260px] overflow-hidden bg-yellow-400 group">
            <img
              src="/chair3.jpg"
              alt="chair"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-90 group-hover:contrast-110"
            />

            <div className="absolute top-6 left-6">
              <p className="text-sm font-medium">
                Onsale Products
              </p>

              <h3 className="text-2xl font-semibold mt-1">
                Chair Collection
              </h3>
            </div>
          </div>

        </div>
      </div>

      {/* TabSection */}
      <TabSection
        productData={data}
      />

      {/*new trending collaction */}
      <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">

        <div
          className="w-full h-[500px] bg-cover bg-center relative overflow-hidden group"
          style={{
            backgroundImage:
              "url('/trending-collaction.jpg')",
          }}
        >
          <div className="relative left-[150px] z-10 h-full flex flex-col justify-center px-10 transition-all duration-300 group-hover:scale-105">

            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              New Trending Collection
            </h1>

            <p className="text-gray-600 mb-6">
              We Believe That Good Design is Always in Season
            </p>

            <button className="border border-orange-400 text-orange-400 px-6 py-2 w-fit hover:bg-orange-400 hover:text-white transition-all">
              SHOPPING NOW
            </button>

          </div>

        </div>

      </div>

      {/* Bestselling Products */}
      <Bestsellingproducts>

        {bestSellingProducts.map(
          (
            item,
            index
          ) => (
            <ProductCard
              key={index}
              data={item}
            />
          )
        )}

      </Bestsellingproducts>

      <WhyChooseUs whyChooseUs={whyChooseUs} />

      <TestimonialSlider testimonials={testimonials} />

      {/* Newsletter */}
      <div className="w-full bg-gray-100 py-16 text-black">
        <div className="w-[95%] max-w-[900px] mx-auto text-center">

          <h2 className="text-3xl font-bold mb-3">
            Our Newsletter
          </h2>

          <p className="text-gray-600 mb-6">
            Get E-mail updates about our latest shop and special offers.
          </p>

          <NewsletterForm />

        </div>
      </div>

    </>
  );
}
