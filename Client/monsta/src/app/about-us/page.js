import React from 'react'
import TestimonialSlider from '../components/home/Customers'
import Breadcrumbs from '../common/Breadcrumbs'
import { getAboutWhyChooseUs, getHomePageData } from '../services/homeServices'
import AboutWhyChooseUs from '../components/about/AboutWhyChooseUs'

export default async function page() {
    let [homePageData, aboutWhyChooseRes] =
        await Promise.all([
            getHomePageData(),
            getAboutWhyChooseUs()
        ]);

    let testimonials =
        homePageData?.data?.testimonials || [];
    let aboutWhyChooseUs =
        aboutWhyChooseRes?.data || [];

    return (
        <>
            {/* Header Section */}
            <Breadcrumbs tittle="About Us" />

            <section className="w-full bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">

                    {/* Image */}
                    <div className="w-full overflow-hidden">
                        <img
                            src="/about-banner.jpg"   // apni image ka path yahan do
                            alt="Welcome Monsta"
                            className="w-full h-[420px] object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="text-center mt-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1a1a1a]">
                            Welcome To Monsta!
                        </h2>

                        <p className="mt-6 text-[#555] leading-7 max-w-4xl mx-auto text-[15px]">
                            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam, est usus legentis in iis qui facit eorum claritatem.
                        </p>
                        <p className="mt-6 text-[#C09578] leading-7 max-w-4xl mx-auto text-[15px]">
                            “There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.”
                        </p>
                    </div>
                </div>
            </section>

            <AboutWhyChooseUs data={aboutWhyChooseUs} />

            {/*what our costumer says*/}
            <TestimonialSlider testimonials={testimonials}/>
        </>
    )
}
