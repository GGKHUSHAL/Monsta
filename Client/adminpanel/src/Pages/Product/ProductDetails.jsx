import React, {
  useEffect,
  useState
} from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaFire,
  FaStar,
  FaArrowUp
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {
  const apiBaseUrl =
    import.meta.env.VITE_APIBASEURL;

  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activeImage, setActiveImage] =
    useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct =
    async () => {
      try {
        let res =
          await axios.get(
            `${apiBaseUrl}product/productdetails/${slug}`
          );

        if (
          res.data._status
        ) {
          setData(
            res.data.data
          );

          setActiveImage(
            res.data.data.imagePath
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-500">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="mb-5 bg-black text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">

          {/* LEFT */}
          <div className="p-6">

            <div className="h-[500px] rounded-3xl overflow-hidden border bg-gray-100">
              <img
                src={activeImage}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4">

              <div
                onClick={() =>
                  setActiveImage(
                    data.imagePath
                  )
                }
                className="h-24 rounded-xl overflow-hidden border cursor-pointer"
              >
                <img
                  src={data.imagePath}
                  className="w-full h-full object-cover"
                />
              </div>

              {data.galleryPath?.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    onClick={() =>
                      setActiveImage(
                        item
                      )
                    }
                    className="h-24 rounded-xl overflow-hidden border cursor-pointer"
                  >
                    <img
                      src={item}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div className="p-8">

            <h1 className="text-4xl font-bold mb-3">
              {data._productName}
            </h1>

            <div className="flex gap-3 flex-wrap mb-5">

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {
                  data
                    ._productParentCategory
                    ?._categoryName
                }
              </span>

              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                {
                  data
                    ._productSubCategory
                    ?._subcategoryName
                }
              </span>

              <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">
                {
                  data
                    ._productSubSubCategory
                    ?._subsubcategoryName
                }
              </span>

            </div>

            <div className="flex items-center gap-4 mb-6">

              <h2 className="text-4xl font-bold text-green-600">
                ₹{data._productSalePrice}
              </h2>

              <span className="text-xl line-through text-gray-400">
                ₹{data._productPrice}
              </span>

            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Product Type
                </p>
                <h3 className="font-bold capitalize">
                  {data._productType}
                </h3>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Stock
                </p>
                <h3 className="font-bold">
                  {data._productStock}
                </h3>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <h3 className="font-bold flex gap-2 items-center">
                  {data._productStatus ? (
                    <>
                      <FaCheckCircle className="text-green-600" />
                      Active
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-600" />
                      Inactive
                    </>
                  )}
                </h3>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Best Selling
                </p>

                <h3 className="font-bold flex gap-2 items-center">
                  {data._bestSelling ? (
                    <>
                      <FaFire className="text-orange-500" />
                      Yes
                    </>
                  ) : (
                    "No"
                  )}
                </h3>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Top Rated
                </p>

                <h3 className="font-bold flex gap-2 items-center">
                  {data._topRated ? (
                    <>
                      <FaStar className="text-yellow-500" />
                      Yes
                    </>
                  ) : (
                    "No"
                  )}
                </h3>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Upsell
                </p>

                <h3 className="font-bold flex gap-2 items-center">
                  {data._upsell ? (
                    <>
                      <FaArrowUp className="text-blue-500" />
                      Yes
                    </>
                  ) : (
                    "No"
                  )}
                </h3>
              </div>

            </div>

            <div className="mb-5">
              <h3 className="font-bold text-lg mb-2">
                Materials
              </h3>

              <div className="flex gap-2 flex-wrap">
                {data._productMaterial?.map(
                  (
                    item,
                    index
                  ) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-4 py-2 rounded-full text-sm"
                    >
                      {
                        item._materialName
                      }
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="font-bold text-lg mb-2">
                Colors
              </h3>

              <div className="flex gap-2 flex-wrap">
                {data._productColor?.map(
                  (
                    item,
                    index
                  ) => (
                    <span
                      key={index}
                      className="bg-black text-white px-4 py-2 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="font-bold text-lg mb-2">
                Short Description
              </h3>

              <p className="text-gray-600">
                {
                  data._productShortDescription
                }
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">
                Full Description
              </h3>

              <p className="text-gray-600">
                {
                  data._productDescription
                }
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}