const productUseadd = require("../../model/productModel");
const sliderUseadd = require("../../model/sliderModel");
const testimonialUseadd = require("../../model/testimonialModel");
const whyChooseUseadd = require("../../model/whyChooseModel");
const aboutWhyChooseUseadd = require("../../model/aboutWhyChooseModel");
const adminUseadd = require("../../model/adminModel");
const faqUseadd = require("../../model/faqModel");
const categoryUseadd = require("../../model/categoryModel");
const subcategoryUseadd = require("../../model/subcategoryModel");
const subsubcategoryUseadd = require("../../model/subsubcategoryModel");

const addImagePath = (data, path) => {
    return data.map((item) => {
        let obj = item.toObject();
        obj.imagePath = item.image ? `${path}${item.image}` : "";
        return obj;
    });
};

let getHomeSliders = async (req, res) => {
    try {
        let data = await sliderUseadd
            .find({
                _sliderStatus: true,
                _slider_Deleted_at: null
            })
            .sort({
                _sliderOrder: 1
            });

        return res.send({
            _status: true,
            _message: "Home Sliders Fetched Successfully",
            path: process.env.SLIDERPATH,
            data: addImagePath(data, process.env.SLIDERPATH)
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching home sliders"
        });
    }
};

let getHomeTestimonials = async (req, res) => {
    try {
        let data = await testimonialUseadd
            .find({
                _testimonialStatus: true,
                _testimonial_Deleted_at: null
            })
            .sort({
                _testimonialOrder: 1
            });

        return res.send({
            _status: true,
            _message: "Home Testimonials Fetched Successfully",
            path: process.env.TESTIMONIALPATH,
            data: addImagePath(data, process.env.TESTIMONIALPATH)
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching home testimonials"
        });
    }
};

let getHomeWhyChooseUs = async (req, res) => {
    try {
        let data = await whyChooseUseadd
            .find({
                _whyChooseStatus: true,
                _whyChoose_Deleted_at: null
            })
            .sort({
                _whyChooseOrder: 1
            });

        return res.send({
            _status: true,
            _message: "Home Why Choose Us Fetched Successfully",
            path: process.env.WHYCHOOSEPATH,
            data: addImagePath(data, process.env.WHYCHOOSEPATH)
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching why choose us"
        });
    }
};

let getAboutWhyChooseUs = async (req, res) => {
    try {
        let path = process.env.ABOUTWHYCHOOSEPATH || "http://localhost:8000/uploads/aboutwhychooseus/";

        let data = await aboutWhyChooseUseadd
            .find({
                _aboutWhyChooseStatus: true,
                _aboutWhyChoose_Deleted_at: null
            })
            .sort({
                _aboutWhyChooseOrder: 1
            });

        return res.send({
            _status: true,
            _message: "About Why Choose Us Fetched Successfully",
            path,
            data: addImagePath(data, path)
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching about why choose us"
        });
    }
};

let getHomePageData = async (req, res) => {
    try {
        let [sliders, testimonials, whyChooseUs] = await Promise.all([
            sliderUseadd
                .find({
                    _sliderStatus: true,
                    _slider_Deleted_at: null
                })
                .sort({
                    _sliderOrder: 1
                }),
            testimonialUseadd
                .find({
                    _testimonialStatus: true,
                    _testimonial_Deleted_at: null
                })
                .sort({
                    _testimonialOrder: 1
                }),
            whyChooseUseadd
                .find({
                    _whyChooseStatus: true,
                    _whyChoose_Deleted_at: null
                })
                .sort({
                    _whyChooseOrder: 1
                })
        ]);

        return res.send({
            _status: true,
            _message: "Home Page Data Fetched Successfully",
            data: {
                sliders: addImagePath(sliders, process.env.SLIDERPATH),
                testimonials: addImagePath(testimonials, process.env.TESTIMONIALPATH),
                whyChooseUs: addImagePath(whyChooseUs, process.env.WHYCHOOSEPATH)
            }
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching home page data"
        });
    }
};

let getCompanyProfile = async (req, res) => {
    try {
        let data = await adminUseadd
            .findOne({
                deleted_at: null,
                $or: [
                    { company_name: { $ne: "" } },
                    { company_email: { $ne: "" } },
                    { company_phone_number: { $ne: "" } },
                    { company_address: { $ne: "" } }
                ]
            })
            .select(
                "company_name company_logo company_email company_phone_number company_address company_map_location company_facebook_link company_instagram_link company_twitter_link company_youtube_link company_linkedin_link company_telegram_link"
            );

        if (!data) {
            return res.send({
                _status: true,
                _message: "Company Profile Fetched Successfully",
                path: process.env.ADMINPROFILEPATH,
                data: null
            });
        }

        let finalData = data.toObject();

        finalData.logoPath = finalData.company_logo
            ? `${process.env.ADMINPROFILEPATH}${finalData.company_logo}`
            : "";

        return res.send({
            _status: true,
            _message: "Company Profile Fetched Successfully",
            path: process.env.ADMINPROFILEPATH,
            data: finalData
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching company profile"
        });
    }
};

let getFaqs = async (req, res) => {
    try {
        let data = await faqUseadd
            .find({
                _faqStatus: true,
                _faq_Deleted_at: null
            })
            .sort({
                _faqOrder: 1
            });

        return res.send({
            _status: true,
            _message: "FAQs Fetched Successfully",
            data
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching FAQs"
        });
    }
};

let getHeaderCategories = async (req, res) => {
    try {
        let [categories, subcategories, subsubcategories] = await Promise.all([
            categoryUseadd
                .find({
                    _categoryStatus: true,
                    _category_Deleted_at: null
                })
                .select("_categoryName slug _categoryOrder")
                .sort({ _categoryOrder: 1 }),
            subcategoryUseadd
                .find({
                    _subcategoryStatus: true,
                    _subcategory_Deleted_at: null
                })
                .select("_subcategoryName slug _subcategoryOrder _parentCategoryId")
                .sort({ _subcategoryOrder: 1 }),
            subsubcategoryUseadd
                .find({
                    _subsubcategoryStatus: true,
                    _subsubcategory_Deleted_at: null
                })
                .select("_subsubcategoryName slug _subsubcategoryOrder _parentCategoryId _subcategoryId")
                .sort({ _subsubcategoryOrder: 1 })
        ]);

        let subsubcategoriesBySubcategory = subsubcategories.reduce((acc, item) => {
            let subcategoryId = item._subcategoryId?.toString();

            if (!subcategoryId) return acc;

            if (!acc[subcategoryId]) acc[subcategoryId] = [];
            acc[subcategoryId].push(item);

            return acc;
        }, {});

        let subcategoriesByCategory = subcategories.reduce((acc, item) => {
            let categoryId = item._parentCategoryId?.toString();

            if (!categoryId) return acc;

            if (!acc[categoryId]) acc[categoryId] = [];

            let subcategoryObj = item.toObject();
            subcategoryObj.subSubcategories =
                subsubcategoriesBySubcategory[item._id.toString()] || [];

            acc[categoryId].push(subcategoryObj);

            return acc;
        }, {});

        let data = categories.map((item) => {
            let categoryObj = item.toObject();
            categoryObj.subcategories =
                subcategoriesByCategory[item._id.toString()] || [];

            return categoryObj;
        });

        return res.send({
            _status: true,
            _message: "Header Categories Fetched Successfully",
            data
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching header categories"
        });
    }
};

let getProductByType = async(req,res)=>{
    try {
        let data = await productUseadd
            .find({
                _product_Deleted_at: null,
                _productStatus: true
            })
            .populate(
                "_productParentCategory",
                "_categoryName"
            )
            .populate(
                "_productSubCategory",
                "_subcategoryName"
            )
            .populate(
                "_productSubSubCategory",
                "_subsubcategoryName"
            )
            .populate(
                "_productMaterial",
                "_materialName"
            )
            .sort({
                _productOrder: 1
            });

        let finalData = data.map(
            (item) => {
                let obj = item.toObject();

                obj.imagePath = item.image
                    ? `${process.env.PRODUCTPATH}${item.image}`
                    : "";

                obj.galleryPath =
                    item.gallery?.map(
                        (img) =>
                            `${process.env.PRODUCTPATH}${img}`
                    ) || [];

                return obj;
            }
        );
        return res.send({
            _status: true,
            _message:
                "All Products Fetched Successfully",
            data: finalData
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message:
                "Error occurred while fetching products"
        });
    }
}

let getRandomTopRatedProducts = async(req,res)=>{
    try {
        let data = await productUseadd.aggregate([
            {
                $match: {
                    _product_Deleted_at: null,
                    _productStatus: true,
                    _topRated: true
                }
            },
            {
                $sample: {
                    size: 2
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_productParentCategory",
                    foreignField: "_id",
                    as: "_productParentCategory"
                }
            },
            {
                $unwind: {
                    path: "$_productParentCategory",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        let finalData = data.map((item) => ({
            ...item,
            imagePath: item.image
                ? `${process.env.PRODUCTPATH}${item.image}`
                : "",
            galleryPath:
                item.gallery?.map(
                    (img) =>
                        `${process.env.PRODUCTPATH}${img}`
                ) || []
        }));

        return res.send({
            _status: true,
            _message: "Random Top Rated Products Fetched Successfully",
            data: finalData
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message:
                "Error occurred while fetching random top rated products"
        });
    }
}

module.exports = {
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
}
