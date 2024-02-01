
import { Link } from "react-router-dom";

import SideScroll from "./SideScroll";

export default function ({ title, children, link=''}) {
    return (

        <div className="p-10 my-10 max-[475px]:py-5 max-[475px]:px-0">
        <div className="flex justify-between items-center max-[475px]:px-5">
            <div className="flex items-center gap-2 ">
                <h2 className="orb text-2xl max-[800px]:text-xl font-semibold">{title}</h2>
                <span className="max-[800px]:hidden">
                    <hr className="bg-black h-[2px] w-[100px]"/>
                </span>
            </div>

            <Link to={link} className="underline hover:text-blue-600">View All</Link>
        </div>

        <div className="py-10">
            <SideScroll>
                {children}
            </SideScroll>
        </div>
    </div>
    );
}