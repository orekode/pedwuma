import { useState } from 'react';
import { SmallBtn } from "./Buttons";

import { Link, useNavigate } from "react-router-dom";
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'

import { useSelector, useDispatch } from "react-redux";
import { logout, setLang } from "../config/general";

export default function () {
    const [ menu, setMenu ] = useState(false);

    const general = useSelector((state) => state.general);

    const dispatch = useDispatch();

    const navigate = useNavigate()

    const navLinks = [
        {
            name: "Home",
            link: ""
        },
        {
            name: "Our Workers",
            link: "workers"
        },
        {
            name: "Our Jobs",
            link: "jobs"
        },
        {
            name: "Services",
            link: "services"
        },
        {
            name: "FAQs",
            link: "faq"
        },
        {
            name: general?.loggedIn ? "Log Out" : "Log In",
            link: general?.loggedIn ? (e) => {e.stopPropagation(); dispatch(logout())} :  "login",
        },
        {
            name: general?.loggedIn ? "Dashboard" : "Sign Up",
            link: general?.loggedIn ? "admin" : "signup"
        },
    ];

    return (
        <div className="">
            <div className="relative z-40">
                <nav className="bg-black text-white px-10 py-3 max-[475px]:px-5 flex items-center justify-between relative z-50">
                    <div  className="logo flex items-center gap-2">
                        <div onClick={() => navigate("/")} className="image h-[40px] w-[40px] rounded-full overflow-hidden bg-blue-800">
                            <img src="/images/logo.png" className="object-cover h-full w-full" />
                        </div>
                        <div onClick={() => navigate("/")} className="uppercase orb font-black max-[550px]:hidden">pedwuma</div>

                        <div style={{
                                    background: "#111",
                                    padding: ".5rem",
                                    borderRadius: "1rem",
                                    color: "white",
                                    scale: "0.85",
                                    "border": "1px solid white",
                                    "display": "flex",
                                    "alignItems": "center",
                                }}>
                            <i className="bi bi-globe-europe-africa mr-0.5"></i>
                            <select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={general.lang}
                                onChange={(e) => {dispatch(setLang(e.target.value))}}
                                className="select bg-[#111]"
                                size="small"
                            >
                                <option value={"english"}>English</option>
                                <option value={"french"}>French</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {navLinks.slice(0, (navLinks.length - 1)).map( (item,index) => 
                            typeof(item?.link) == "string" ?
                            <Link to={typeof(item?.link) == "string" ? `/${item?.link}` : ""} key={index} className="px-3 py-1.5 mx-1 hover:bg-[#222] bg-opacity-30 rounded text-sm max-[1165px]:hidden">{item?.name}</Link>
                            :
                            <div onClick={typeof(item?.link) == "string" ? () => {} : item?.link} key={index} className="px-3 py-1.5 mx-1 hover:bg-[#222] bg-opacity-30 rounded text-sm max-[1165px]:hidden">{item?.name}</div>

                        )}

                        <Link to={`/${navLinks[navLinks.length - 1]['link']}`} className="max-[370px]:hidden">
                            <SmallBtn style={{marginLeft: '1.5rem'}}>
                                {navLinks[navLinks.length - 1]['name']}
                            </SmallBtn>
                        </Link>

                        <i onClick={() => setMenu(!menu)} className={`bi bi-${menu ? 'x-lg' : 'list'} font-black text-3xl ml-6 max-[475px]:ml-3 max-[475px]:text-xl`}></i>
                    </div>
                </nav>

                <div className={`mobile-menu ${ menu ? 'top-12 mt-4' : '-top-[200vh]'} shadow-lg left-0 w-full bg-white absolute z-40 `}>
                    <div onClick={() => {navigate("/"); setMenu(!menu)}}          className="border-b text-xl hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Home</div>
                    <div onClick={() => {navigate("/workers"); setMenu(!menu)}}   className="border-b text-xl hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Our Workers</div>
                    <div onClick={() => {navigate("/jobs"); setMenu(!menu)}}      className="border-b text-xl hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Our Jobs</div>
                    <div onClick={() => {navigate("/services"); setMenu(!menu)}}  className="border-b text-xl hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Services</div>
                    <div onClick={() => {navigate("/faq"); setMenu(!menu)}}       className="border-b text-xl hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">FAQs</div>
                    {!general?.loggedIn && 
                        <>
                            <div onClick={() => {navigate("/login"); setMenu(!menu)}} className="text-xl  border-b hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Log In</div>
                            <div onClick={() => {navigate("/signup"); setMenu(!menu)}} className="text-xl border-b hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Sign Up</div>
                        </>
                    }

                    {general?.loggedIn && 
                        <>
                            <div onClick={(e) => {e.stopPropagation(); dispatch(logout()); setMenu(!menu)}} className="text-xl border-b hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Log Out</div>
                            <div onClick={() => {navigate(`/${navLinks[navLinks.length - 1]['link']}`); setMenu(!menu)}} className=" border-b text-xl hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Dashboard</div>
                        </>
                    }
                    <div onClick={() => {navigate("/tsncs"); setMenu(!menu)}}       className="text-xl hover:tracking-wide hover:bg-gray-200 py-5 px-10 max-[475px]:p-5">Terms and Conditions</div>
                </div>
            </div>

            {/* <div className="absolute bottom-[15%] right-1 p-5 z-0">
                <div className="h-[45px] w-[140px] border-2 active:border-black hover:border-blue-600 shadow mb-3 relative group bg-black px-3 rounded-md">
                    <img src="/images/playstore.jpg" className="object-contain h-full w-full rounded-md" />
                </div>
                <div className="h-[45px] w-[140px] border-2 active:border-black hover:border-blue-600 shadow mb-3 relative group bg-black px-3 rounded-md">
                    <img src="/images/appstore.png" className="object-contain h-full w-full rounded-md" />
                </div>
            </div> */}
        </div>
    );
}