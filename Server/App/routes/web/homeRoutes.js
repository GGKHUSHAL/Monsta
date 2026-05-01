let express = require("express")
const {
  getHomeSliders,
  getHomeTestimonials,
  getHomeWhyChooseUs,
  getAboutWhyChooseUs,
  getHomePageData,
  getCompanyProfile,
  getFaqs,
  getHeaderCategories,
  getProductByType,
  getRandomTopRatedProducts
} = require("../../controller/web/homeController");
const { viewSlugProduct } = require("../../controller/admin/productController");

let homeRoute = express.Router()  //API create

homeRoute.get("/slider", getHomeSliders)

homeRoute.get("/testimonials", getHomeTestimonials)

homeRoute.get("/why-choose-us", getHomeWhyChooseUs)

homeRoute.get("/about-why-choose-us", getAboutWhyChooseUs)

homeRoute.get("/home-page", getHomePageData)

homeRoute.get("/profile/company", getCompanyProfile)

homeRoute.get("/faqs", getFaqs)

homeRoute.get("/categories", getHeaderCategories)

homeRoute.get("/get-products",getProductByType)

homeRoute.get("/top-rated-random", getRandomTopRatedProducts)

homeRoute.get(
  "/productdetails/:slug",
  viewSlugProduct
);


module.exports = {homeRoute} 
