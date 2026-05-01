// src/app/services/homeServices.js

import axios from "axios";

let apiBaseUrl =
  process.env.NEXT_PUBLIC_APIBASEPATH;

// HOME PRODUCTS
let getProductbyType = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/get-products`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// COMPLETE HOME PAGE DATA
let getHomePageData = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/home-page`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// HOME SLIDER
let getHomeSliders = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/slider`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// HOME TESTIMONIALS
let getHomeTestimonials = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/testimonials`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// HOME WHY CHOOSE US
let getHomeWhyChooseUs = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/why-choose-us`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// ABOUT WHY CHOOSE US
let getAboutWhyChooseUs = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/about-why-choose-us`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// COMPANY PROFILE
let getCompanyProfile = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/profile/company`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// FAQS
let getFaqs = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/faqs`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// HEADER CATEGORIES
let getHeaderCategories = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/categories`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// CONTACT QUERY
let submitContactQuery = async (queryData) => {
  return axios
    .post(
      `${apiBaseUrl}contact-query/create`,
      queryData
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        _message: "Something went wrong. Please try again.",
      };
    });
};

// NEWSLETTER
let subscribeNewsletter = async (email) => {
  return axios
    .post(
      `${apiBaseUrl}newsletter/subscribe`,
      { email }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        _message: "Something went wrong. Please try again.",
      };
    });
};

let unsubscribeNewsletter = async ({ email, token }) => {
  return axios
    .post(
      `${apiBaseUrl}newsletter/unsubscribe`,
      { email, token }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        _message: "Something went wrong. Please try again.",
      };
    });
};

// RANDOM TOP RATED PRODUCTS
let getRandomTopRatedProducts = async () => {
  return axios
    .get(
      `${apiBaseUrl}home/top-rated-random`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// PRODUCT DETAILS
let getProductDetails =
  async (slug) => {
    return axios
      .get(
        `${apiBaseUrl}home/productdetails/${slug}`
      )
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

let getCountries = async () => {
  return axios
    .get(`${apiBaseUrl}country/view`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        data: [],
      };
    });
};

let placeOrder = async ({ token, orderData }) => {
  return axios
    .post(`${apiBaseUrl}order/place-order`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        _message: "Something went wrong. Please try again.",
      };
    });
};

let createRazorpayOrder = async ({ token, orderData }) => {
  return axios
    .post(`${apiBaseUrl}order/create-razorpay-order`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        _message: "Unable to start online payment.",
      };
    });
};

let verifyRazorpayPayment = async ({ token, paymentData }) => {
  return axios
    .post(`${apiBaseUrl}order/verify-razorpay-payment`, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        _message: "Unable to verify payment.",
      };
    });
};

let getMyOrders = async (token) => {
  return axios
    .get(`${apiBaseUrl}order/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        _status: false,
        data: [],
      };
    });
};

export {
  getProductbyType,
  getHomePageData,
  getHomeSliders,
  getHomeTestimonials,
  getHomeWhyChooseUs,
  getAboutWhyChooseUs,
  getCompanyProfile,
  getFaqs,
  getHeaderCategories,
  submitContactQuery,
  subscribeNewsletter,
  unsubscribeNewsletter,
  getRandomTopRatedProducts,
  getProductDetails,
  getCountries,
  placeOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders
};
