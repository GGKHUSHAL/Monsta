import React from "react";
import Link from "next/link";

export default function Breadcrumbs({ tittle }) {
    return (
        <div>
            <div className="bg-gray-50 py-12 text-center">

                <h1 className="text-4xl font-bold mb-2 text-black">
                    {tittle}
                </h1>

                <p className="text-sm text-black">

                    <Link
                        href="/"
                        className="hover:text-[#C09578]"
                    >
                        Home
                    </Link>

                    <span className="mx-2 ">{">"}</span>

                    
                    <span className="text-[#C09578]">{tittle}</span>


                </p>

            </div>
        </div>
    );
}