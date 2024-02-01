import { Outlet, useLocation } from "react-router-dom";

import { Nav, Footer } from "components";
import { useEffect } from "react";


export default function () {

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <main className="bg-whitesmoke">
            <Nav />
            <Outlet />
            <Footer />
        </main>
        
    )
}