import { useNavigate } from "react-router-dom";
import { orderBy, where } from "firebase/firestore";
import { Btn } from "./";
import CardScroll from "./CardScroll";

import { useData, getData } from "functions/reads/General";
import { safeGet, encrypt } from "functions/utils/Fixers";
import { Skeleton } from "@mui/material";

export default function () {

    const navigate = useNavigate();

    const { data } = useData({
        target: "Booking Profile",
        conditions: [ orderBy("Work Experience & Certification", "desc") ],
        callback: async (person) => {
            person.user = await getData({
                target: "users",
                conditions: [ where("User ID", "==", person["User ID"]) ],
                callback: async (user) => {
                    user.location = await getData({
                        target: "Location",
                        conditions: [ where("User ID", "==", person["User ID"]) ]
                    });

                    user.location = safeGet(user.location, ["0", "0"], {});

                    return user;
                }
            });

            person.user = safeGet(person.user, ["0", "0"], {});

            return person;
        }
    });


    return (
        <CardScroll title='Our Best Workers'>
            {data && data[0].map((item, index) => 
                <div key={index} data-aos="fade-in" className="relative">
                    <div className="w-[500px] h-[250px] max-[1165px]:w-[300px] max-[1165px]:h-[500px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative grid grid-cols-10">
                        <div className="image col-span-4 max-[1165px]:col-span-10 max-[1165px]:h-[250px]">
                            <img src={safeGet(item, ["User Pic"], "/images/pedwuma.jpg")} className="object-cover h-full w-full" />
                        </div>
                        <div className="col-span-6 bg-white p-4 max-[1165px]:col-span-10">
                                <div className="text-gray-600 flex items-center gap-2 mb-1 text-xs">
                                    <i className="bi bi-geo-alt border rounded-full h-[20px] w-[20px] flex items-center justify-center"></i>
                                    <span className="" style={{width: 'calc(100% - 35px)'}}>{safeGet(item.user, ["location", "Address"], "")}</span>
                                </div>
                                <div className="title orb text-lg my-1.5">{safeGet(item.user, ["First Name"], "")} {safeGet(item.user, ["Last Name"], "")}</div>

                            <div className="flex gap-2 items-center">
                                {Array.from({length: safeGet(item, ["Work Experience & Certification", "Rating"] )}, (item, index) => <i key={index} className="bi bi-star-fill text-yellow-400" />)}
                                {Array.from({length: 5 - safeGet(item, ["Work Experience & Certification", "Rating"], 0)}, (item, index) => <i key={index} className="bi bi-star-fill text-gray-400" />)}
                            </div>
                            <div className="font-semibold orb mt-2">{safeGet(item, ["Service Information", "Service Category"])}</div>
                            <div className="font-semibold orb text-xs mb-2">{safeGet(item, ["Service Information", "Service Provided"])}</div>
                            <div className="text-sm p-05 text-gray-600"> <span className="font-semibold text-xs">Experience: </span>{safeGet(item, ["Service Information", "Expertise"])}</div>
                            <div className="text-sm p-05 text-gray-600 mb-2"> <span className="font-semibold text-xs">Charge Rate: </span> Ghc {safeGet(item, ["Service Information", "Charge"])} / {safeGet(item, ["Service Information", "Charge Rate"])}</div>

                            <Btn.SmallBtn onClick={() => navigate(`/worker/${encrypt(item.id)}`)} >Book Now</Btn.SmallBtn>
                        </div>
                    </div>
                    <div className="absolute -top-3 -right-3 h-[40px] w-[40px] border border-gray-200 rounded-full bg-white shadow">
                        <img src="/images/verify-badge.png" alt="" className="object-cover h-full w-full" />
                    </div>
                </div>
            )}

            {!data && Array.from({length: 20}, (item, index) => 
                <div key={index} data-aos="fade-in" className="relative">
                    <div className="w-[500px] h-[250px] max-[1165px]:w-[300px] max-[1165px]:h-[500px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative grid grid-cols-10">
                        <div className="image col-span-4 max-[1165px]:col-span-10 p-2">
                            <Skeleton height="100%" width="100%"/>
                        </div>
                        <div className="col-span-6 bg-white p-4 max-[1165px]:col-span-10">
                                <div className="text-gray-600 flex items-center gap-2 mb-1 text-xs">
                                    <i className="bi bi-geo-alt border rounded-full h-[20px] w-[20px] flex items-center justify-center"></i>
                                    <span className="" style={{width: 'calc(100% - 35px)'}}><Skeleton /></span>
                                </div>
                                <div className="title orb text-lg my-3"><Skeleton /></div>

                                <p className="text-xs mb-3">
                                    <Skeleton height={100}/>
                                </p>

                                <div className="orb mb-3">
                                    <span className="orb"><Skeleton /></span>
                                    <span className="orb text-lg"><Skeleton /></span>
                                </div>

                            <Btn.SmallBtn ><Skeleton height={20}/></Btn.SmallBtn>
                        </div>
                    </div>
                    <div className="absolute -top-3 -right-3 h-[40px] w-[40px] border border-gray-200 rounded-full bg-white shadow">
                        <img src="/images/verify-badge.png" alt="" className="object-cover h-full w-full" />
                    </div>
                </div>
            )}
        </CardScroll>
    );
}