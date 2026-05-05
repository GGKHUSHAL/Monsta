import AddTestimonial from "./Pages/Testimonial/AddTestimonial";
import ViewTestimonials from "./Pages/Testimonial/ViewTestimonials";

import AddWhyChoose from "./Pages/WhyChoose/AddWhyChoose";
import ViewWhyChoose from "./Pages/WhyChoose/ViewWhyChoose";
import AddAboutWhyChoose from "./Pages/AboutWhyChoose/AddAboutWhyChoose";
import ViewAboutWhyChoose from "./Pages/AboutWhyChoose/ViewAboutWhyChoose";

import AddColor from "./Pages/Color/AddColor";
import ViewColors from "./Pages/Color/ViewColors";

import AddMaterial from "./Pages/Material/AddMaterial";
import ViewMaterials from "./Pages/Material/ViewMaterials";

import AddCategory from "./Pages/Category/AddCategory";
import ViewCategories from "./Pages/Category/ViewCategories";

import AddSubCategory from "./Pages/SubCategory/AddSubCategory";
import ViewSubCategories from "./Pages/SubCategory/ViewSubCategories";

import AddSubSubCategory from "./Pages/SubSubCategory/AddSubSubCategory";
import ViewSubSubCategories from "./Pages/SubSubCategory/ViewSubSubCategories";

import AddProduct from "./Pages/Product/AddProduct";

import Dashboard from "./Pages/Dashboard";
import AddFAQ from "./Pages/Faq/AddFaq";
import ViewFAQ from "./Pages/Faq/ViewFaq";
import AddCountry from "./Pages/Country/AddCountry";
import ViewCountry from "./Pages/Country/ViewCountry";
import AddSlider from "./Pages/Slider/AddSlider";
import ViewSlider from "./Pages/Slider/ViewSlider";
import ProductDetails from "./Pages/Product/ProductDetails";
import ViewProduct from "./Pages/Product/ViewProducts";
import ViewContactQueries from "./Pages/ContactQuery/ViewContactQueries";
import ViewNewsletterSubscribers from "./Pages/Newsletter/ViewNewsletterSubscribers";
import ViewUsers from "./Pages/User/ViewUsers";


export const adminRoutes = [
    {
        name: "Dashboard",
        routes: [
            { path: "/", component: Dashboard }
        ]
    },
    {
        name: "Testimonial",
        routes: [
            { path: "/testimonial/add", component: AddTestimonial },
            { path: "/testimonial/view", component: ViewTestimonials },
        ],
    },
    {
        name: "Why Choose Us",
        routes: [
            { path: "/whychoose/add", component: AddWhyChoose },
            { path: "/whychoose/view", component: ViewWhyChoose },
        ],
    },
    {
        name: "About Why Choose Us",
        routes: [
            { path: "/about-whychoose/add", component: AddAboutWhyChoose },
            { path: "/about-whychoose/view", component: ViewAboutWhyChoose },
        ],
    },
    {
        name: "Slider",
        routes: [
            { path: "/slider/add", component: AddSlider },
            { path: "/slider/view", component: ViewSlider },
        ],
    },
    {
        name: "Color",
        routes: [
            { path: "/color/add", component: AddColor },
            { path: "/color/view", component: ViewColors },
        ],
    },
    {
        name: "Material",
        routes: [
            { path: "/material/add", component: AddMaterial },
            { path: "/material/view", component: ViewMaterials },
        ],
    },
    {
        name: "Category",
        routes: [
            { path: "/category/add", component: AddCategory },
            { path: "/category/view", component: ViewCategories },
        ],
    },
    {
        name: "Sub Category",
        routes: [
            { path: "/subcategory/add", component: AddSubCategory },
            { path: "/subcategory/view", component: ViewSubCategories },
        ],
    },
    {
        name: "Sub Sub Category",
        routes: [
            { path: "/subsubcategory/add", component: AddSubSubCategory },
            { path: "/subsubcategory/view", component: ViewSubSubCategories },
        ],
    },
    {
        name: "Product",
        routes: [
            { path: "/product/add", component: AddProduct },
            { path: "/product/view", component: ViewProduct },
            { path: "/product/view/:slug", component: ProductDetails },
        ],
    },
    {
        name: "FaQ",
        routes: [
            { path: "/faq/add", component: AddFAQ },
            { path: "/faq/view", component: ViewFAQ },
        ],
    },
    {
        name: "Contact Queries",
        routes: [
            { path: "/contact-query/view", component: ViewContactQueries },
        ],
    },
    {
        name: "Users",
        routes: [
            { path: "/user/view", component: ViewUsers },
        ],
    },
    {
        name: "Newsletter Subscribers",
        routes: [
            { path: "/newsletter/view", component: ViewNewsletterSubscribers },
        ],
    },
    {
        name: "Country",
        routes: [
            { path: "/country/add", component: AddCountry },
            { path: "/country/view", component: ViewCountry },
        ],
    }
];
