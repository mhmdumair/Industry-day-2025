import React from "react";
import Header from "@/components/custom/header";
import Announcement from "@/components/custom/announcement";
import Carousel from "@/components/custom/carousel";


const page = () => {
    return(
        <>
            <div><Header/></div>
            <div><Announcement/></div>
            <div><Carousel/></div>
        </>
    )
}

export default page