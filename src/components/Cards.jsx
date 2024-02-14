import { useState } from "react";

import { Skeleton } from "@mui/material";

import { safeGet } from "functions/utils/Fixers";

import { Btn } from "./";

export function Stat({ title, value, icon, loading=false}) {
    if(!loading)
    return (
        <div className="rounded w-[200px] border border-black shadow hover:shadow-lg p-5 py-2.5 flex items-center hover:bg-blue-50 bg-opacity-10">
            <div className="flex-grow">
                <div className="title orb whitespace-nowrap">{title}</div>
                <div className="orb text-xl py-05 font-semibold">{value}</div>
            </div>

            <i className={`bi bi-${icon} text-2xl h-[50px] w-[50px] border border-black rounded-full flex items-center justify-center`}></i>
        </div>
    );

    return (
        <Skeleton height={70} variant="rounded"/>
    );
}


export function Profile({ item, loading=false, btnText="Edit Profile", name=<></>, onBtnClick=()=>{} }) {

    if(loading || !safeGet(item, ["Work Experience & Certification", "Rating"]) == "undefined")
    return (
        <div className="profile shadow rounded w-[250px] p-2">
            <Skeleton height={200} />
            <div className="details py-3">
                <div className="font-semibold orb"><Skeleton /></div>
                <div className="my-2">
                    <div className="flex gap-2 items-center">
                        {Array.from({length: 5}, (_, index) => <i key={index} className="bi bi-star-fill text-gray-400" />)}
                    </div>
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>

            <Skeleton height={40}/>
        </div>
    );

    else
    return (
        <div className="profile shadow rounded w-[300px] p-2 h-max">
            <div className="image h-[200px] overflow-hidden rounded">
                <img src={safeGet(item, ["User Pic"], "/images/pedwuma.jpg")} className="object-cover h-full w-full" />
            </div>
            <div className="details py-1.5">
                {name}
                <div className="my-2">
                    <div className="flex gap-2 items-center">
                        {Array.from({length: safeGet(item, ["Work Experience & Certification", "Rating"] )}, (item, index) => <i className="bi bi-star-fill text-yellow-400" />)}
                        {Array.from({length: 5 - safeGet(item, ["Work Experience & Certification", "Rating"], 0)}, (item, index) => <i className="bi bi-star-fill text-gray-400" />)}
                    </div>
                    <div className="font-semibold orb mt-2">{safeGet(item, ["Service Information", "Service Category"])}</div>
                    <div className="font-semibold orb text-xs mb-2">{safeGet(item, ["Service Information", "Service Provided"])}</div>
                    <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Experience: </span>{safeGet(item, ["Service Information", "Expertise"])}</div>
                    <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Charge Rate: </span> Ghc {safeGet(item, ["Service Information", "Charge"])} / {safeGet(item, ["Service Information", "Charge Rate"])}</div>
                </div>
            </div>

            <Btn.SmallBtn onClick={onBtnClick} fullWidth>{btnText}</Btn.SmallBtn>
        </div>
    )
}

export function Loading() {
    return (
        <div className="profile shadow rounded w-[250px] p-2">
            <Skeleton height={200} />
            <div className="details py-3">
                <div className="font-semibold orb"><Skeleton /></div>
                <div className="my-2">
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>

            <Skeleton height={40}/>
        </div>
    );
}

export function Description({ title="", description="", btnText="", image="/images/category.png", topInfo=<><span className="orb">123</span> workers</>, classname="", onBtnClick=()=>{}, ...props }) {
    return (
        <div className={`${classname} h-[400px] max-[1165px]:w-[300px] max-[1165px]:h-[400px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative group`} {...props}>
            <div className="image h-[90%] ">
                <img src={image} className="object-cover h-full w-full " />
            </div>
            <div className="absolute -bottom-[40px] max-[1165px]:-bottom-[0%] group-hover:bottom-0 max-[1165px]:group-hover:bottom-[40px] border-t left-0 w-full bg-white">
                <div className="p-5">
                    <div className="title orb text-3xl mb-3">{title}</div>
                    <p className="text-sm max-[1165px]:text-xs">
                        {description}
                    </p>
                </div>

                <Btn.MediumBtn onClick={onBtnClick} styles={{borderRadius: '0px', height: '40px', paddingTop: '1.25rem'}} fullWidth>{btnText}</Btn.MediumBtn>
            </div>

            <div className="absolute top-1 left-1 p-2 bg-black bg-opacity-90 text-white rounded-md group-hover:bg-blue-600 orb">{topInfo}</div>
        </div>
    );
}

export function Small({ image="/images/category.png", title="Amasaman, Temah, Kumasi, Accra...", containerClass, loading=false, onItemSelect=()=>{}, selected=false, ...props }) {
    
    if(loading) return (
        <div className={`${containerClass} relative flex border-2 mb-3 rounded-md overflow-hidden bg-white`} {...props}>
            <Skeleton height={60} width={100} />
            <div className="px-3 py-2 " style={{width: 'calc(100% - 100px)'}}>
                <div className="text-gray-600 flex items-center gap-2 text-xs">
                    <Skeleton width={60}/>
                </div>
            </div>
        </div>
    );

    return (
        <div onClick={(e) => {onItemSelect(e); }} className={`${containerClass} ${selected ? "border-blue-500" : ""} relative flex border-2 mb-3 rounded-md overflow-hidden bg-white`} {...props}>
            {/* <div className="image  h-[60px] w-[100px]">
                <img src={image} className="object-cover h-full w-full " />
            </div> */}
            <div className="px-3 py-2 " style={{width: 'calc(100% - 100px)'}}>
                <div className="text-gray-600 flex items-center gap-2 text-xs">
                    <span className="">{title}</span>
                </div>
            </div>
        </div>
    );
}