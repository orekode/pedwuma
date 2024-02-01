import { useState, useEffect } from 'react';



import { FormControl, InputLabel, OutlinedInput, InputAdornment, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { BigBtn } from "./Buttons"; 
import NoResults from "./NoResults";

import { useServiceSearch } from "../functions/reads/Services";
import { safeGet, encrypt } from "functions/utils/Fixers";
import { userRank, ipInfo } from "functions/utils/Locations";
import { useLocationSearch, useLocationDetails, useData, getData } from "../functions/reads/General";
import { Search } from "../components/Search";

import{ where, orderBy, limit } from "firebase/firestore";

export function LocationSearch({ callback = console.log, typingCallback=()=>{}, ...props }) {

    const [ searchInput, setSearchInput ] = useState("");

    const { data, isLoading, isError } = useLocationSearch(searchInput);
    
    const handleSearching = (text) => {
        typingCallback(text)
        setSearchInput(text);
    }



    return (
        <Search
            data={data}
            isLoading={isLoading || isError}

            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start"><i className="bi bi-geo-alt"></i></InputAdornment>}
            label="Your Location"
            name="service"
            placeholder="E.g Accra, Amasaman, Tema, Ejisu"
            searchCallback={(data, setInput) => {callback(data); setInput(data?.description);}}
            searchingCallback={handleSearching}
            resultUi={ (item) =>
                <div onClick={() => {}} className="px-5 py-3 text-md hover:bg-gray-200 active:bg-blue-600 active:text-white">
                    {item.description}
                </div>
            }
            {...props}
        />
    );
}

export function ServiceSearch({ callback = console.log, status="active", whatUserTypes=()=>{}, ...props }) {

    const [ searchInput, setSearchInput ] = useState("");

    const { data, isLoading, isError } = useServiceSearch(searchInput, status);

    const asUserTypes = (input) => {
        setSearchInput(input);
        whatUserTypes(input);
    }


    return (
        <Search
            data={data}
            isLoading={isLoading || isError}
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start"><i className="bi bi-person-circle"></i></InputAdornment>}
            label="What Service do you need?"
            name="service"
            placeholder="E.g Mason, Carpenter, Fitter, Mechanic"
            searchCallback={(data, setInput) => {setInput(safeGet(data, ["Category Name"], ""))}}
            searchingCallback={asUserTypes}
            resultUi={ (item) =>
                <div>
                    {safeGet(item, ["Services Provided"], []).map( (sub, subIndex) => 
                        <div key={subIndex} onClick={() => {callback(sub); setSearchInput(sub)}} className="px-5 py-3 text-md hover:bg-gray-200 active:bg-blue-600 active:text-white">
                            {safeGet(item, ["Category Name"], "")}-({sub})
                        </div>
                    )}
                </div>
            }
            {...props}
        />
    );

}

let globalCordinates = {
    lat: 0,
    lng: 0,
};

ipInfo().then( result => {
        globalCordinates = {...result};
});

export default function() {

    const [ workers, setWorkers ] = useState([]);
    const [ searchData, setSearchData ] = useState(null);
    const [ fallbackLocation, setFallbackLocation ] = useState({
        lat: 0,
        lng: 0,
    });


    useEffect( () => {
        setFallbackLocation({...globalCordinates})
    }, [globalCordinates])
    

    const [ parameters, setParameters ] = useState({
        service: "",
        conditions: [where("User ID", "==", "nothing")],
        location: null,
    });

    const navigate = useNavigate();

    const { data } = useData({
        target: "Booking Profile",
        conditions: parameters.conditions,
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

    const conditionMatrix = () => {

        setSearchData(true);

        console.log(parameters);

        if(parameters.service !== "") {
            setParameters({ ...parameters, conditions: [ 
                where("Service Information.Service Provided", "==", parameters.service),
                orderBy("Work Experience & Certification.Rating", "desc"),
                limit(100),
            ]});
        }
        else if(parameters.service == "" && searchData !== null) {
            setParameters({ ...parameters, conditions: [ 
                orderBy("Work Experience & Certification.Rating", "desc"),
                limit(100),
            ]});
        }
        else {
            setParameters({ ...parameters, conditions: [ 
                where("User ID", "==", "nothing"),
                limit(100),
            ]});
        }
    }

    return (
        <div className="p-10 max-[1165px]:p-0 h-[700px] max-[1165px]:h-max max-[1165px]:flex-col max-[1165px]:gap-0 flex gap-5 z-10 relative">
            <form className="bg-white rounded-md h-max max-w-[570px] max-[1165px]:max-w-[100%] max-[1165px]:rounded-none shadow sticky">
                <h1 className="capitalize orb font-semibold text-6xl max-[475px]:text-4xl p-10 max-[475px]:p-5 border-b border-gray-200">Find The <span className="text-blue-700 orb">Best Workers</span> Now</h1>

                <div className="p-10 max-[475px]:p-5">

                    <div className="mb-10 relative z-30">
                        <LocationSearch callback={(loc) => setParameters({...parameters, location: loc })} />
                    </div>

                    <ServiceSearch  callback={(sub) => {setParameters({...parameters, service: sub })}} sx={{marginBottom: "2rem"}}/>

                    <div className="grid grid-cols-1 gap-2">

                        <BigBtn onClick={conditionMatrix}>
                            Find Service
                        </BigBtn>

                        <p className="text-sm">
                            Not finding the worker of your choice? <Link className="text-blue-600 inline font-semibold underline">Sign Up</Link> now to <Link className="text-blue-600 inline font-semibold underline">Post Your Job</Link> on pedwuma 
                            and receive notifications from interested workers
                        </p>
                    </div>
                </div>
            </form>

        { searchData !== null &&
            <div data-aos="fade-in" className="flex-grow bg-black bg-opacity-30 min-h-[500px] max-[1165px]:backdrop-blur-xl rounded overflow-y-scroll relative max-[1165px]:absolute top-0 left-0 max-[1165px]:w-full max-[1165px]:bg-opacity-50 scrollbar-thumb-rounded-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300">
                {data && userRank(safeGet(data, ["0"], []), safeGet(location, ["lat"], null), safeGet(location, ["lng"], null)).length <= 0 && 
                    <NoResults title="Skilled Workers Unavailable" text="Click the button to post your job, all skilled workers would be notified and would contact you as soon as possible" link={['Post Your Job', '/admin/job/new']} classname="min-h-[500px] flex items-center justify-center text-white"/>
                }
                {!data && 
                    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                        <CircularProgress />
                    </div>
                }
                {userRank(safeGet(data, ["0"], []), safeGet(fallbackLocation, ["lat"], 0), safeGet(fallbackLocation, ["lng"], 0)).map( (item, index) => 
                    <div key={index} onClick={() => navigate(`/worker/${encrypt(item.id)}`)} className="flex gap-3 bg-[#111] text-white hover:bg-[#333] mb-1.5 p-1.5 rounded-md">
                        <div className="image h-[100px] w-[100px] max-[400px]:w-[60px] max-[400px]:h-[60px] rounded-md overflow-hidden border shadow">
                            <img src={safeGet(item.user, ["Pic"], "/images/user.png")} className="object-cover h-full w-full " />
                        </div>
                        <div className="details text-sm">
                            <div>{safeGet(item.user, ["First Name"], "")} {safeGet(item.user, ["Last Name"], "")}</div>
                            <div className="flex gap-2 items-center">
                                {Array.from({length: safeGet(item, ["Work Experience & Certification", "Rating"] )}, (item, index) => <i key={index} className="bi bi-star-fill text-yellow-400" />)}
                                {Array.from({length: 5 - safeGet(item, ["Work Experience & Certification", "Rating"], 0)}, (item, index) => <i key={index} className="bi bi-star-fill text-gray-400" />)}
                            </div>
                            <div className="font-semibold orb mt-2">{safeGet(item, ["Service Information", "Service Category"])}</div>
                            <div className="font-semibold orb text-xs mb-2">{safeGet(item, ["Service Information", "Service Provided"])}</div>
                            <div className="text-sm p-05 text-gray-200"> <span className="font-semibold text-xs">Experience: </span>{safeGet(item, ["Service Information", "Expertise"])}</div>
                            <div className="text-sm p-05 text-gray-200"> <span className="font-semibold text-xs">Charge Rate: </span> Ghc {safeGet(item, ["Service Information", "Charge"])} / {safeGet(item, ["Service Information", "Charge Rate"])}</div>
                        </div>
                    </div>
                )}
                <i onClick={() => setSearchData(null)} className="absolute top-1 right-1 bg-white h-[30px] w-[30px] flex items-center justify-center rounded-full shadow-xl hover:bg-red-500 hover:text-white z-10 bi bi-x"></i>
            </div>
        } 

        
        </div>
    );
}


