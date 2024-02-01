import { useState, useEffect } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { Header, Btn, Cards, PopularServices, EmptyBox, NoResults } from "components";

import { LocationSearch, ServiceSearch } from "../../components/BoxSearch";

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'

import { useData, getData } from "functions/reads/General";

import { encrypt, safeGet } from "functions/utils/Fixers";

import { where, limit, orderBy } from "firebase/firestore";

import { userRank, ipInfo } from "functions/utils/Locations";


let lat = 0;
let lng = 0;

ipInfo().then( result => {
    lat = result?.lat;
    lng = result?.lng;
});

export default function() {

    const { service } = useParams();

    const [ showMenu, setShowMenu ] = useState(false);
    const [ refetchCheck, setRefetchCheck ] = useState(false);
    const [ parameterChange, setParameterChange ] = useState(false);
    const navigate = useNavigate();
    const [ fallbackLocation, setFallbackLocation ] = useState({
        lat: lat,
        lng: lng,
    });

    useEffect(() => {
        setFallbackLocation({
            lat: lat,
            lng: lng
        })
    }, [lat, lng]);



    const [ parameters, setParameters ] = useState({
        service: "",
        conditions: [orderBy("Work Experience & Certification.Rating", "desc"), limit(100)],
        location: null,
        orderBy: ["Work Experience & Certification.Rating", "desc"],
        orderMap: {
            "More E": ["Work Experience & Certification.Rating", "desc"],
            "Less E": ["Work Experience & Certification.Rating", "asc"],
            "Low P":  ["Service Information.Charge", "asc"],
            "High P": ["Service Information.Charge", "desc"],
        }
    });

    const { data } = useData({
        target: "Booking Profile",
        conditions: [
            where("Service Information.Service Provided", "==", service),
            orderBy(...parameters.orderBy),
            limit(100),
        ],
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

    useEffect(() => {

        console.log(parameters);

        if(parameters.service !== "") {
            setParameters({ ...parameters, conditions: [ 
                
            ]});
        }
        else {
            setParameters({ ...parameters, conditions: [ 
                orderBy(...parameters.orderBy),
                limit(100),
            ]});
        }

    }, [parameterChange]);

    return (
        <>

            <Header 
                image={`/images/workers.jpg`} 
                title={<><span className="text-blue-400 orb"> {service} </span> </>}
            />

            <div className="px-10 py-5 pt-12 max-[1165px]:px-5">

                <div className="w-full flex items-center gap-3">

                    <div className="flex-grow grid grid-col-1">
                        <ServiceSearch callback={(title) => navigate(`/service/${title.Title}`)} sx={{boxShadow: "0 0 1px #2222223c"}}/>
                    </div>

                    <div className="col-span-2 grid grid-col-1 w-[200px]">

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Find Workers with</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={"More E"}
                                label="Workers that are?"
                                onChange={(e) => {setParameters({...parameters, orderBy: parameters.orderMap[e.target.value]}); setParameterChange(!parameterChange)}}
                            >
                                <MenuItem value={"More E"}>High Rank</MenuItem>
                                <MenuItem value={"Less E"}>Low Rank</MenuItem>
                                <MenuItem value={"Low P"}>Low Pay</MenuItem>
                                <MenuItem value={"High P"}>High Pay</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                </div>

            </div>

            <div className="px-10 max-[1165px]:px-5 min-h-screen">
                    
                    <div className="right " >

                        <div className="h-max grid-box-fill gap-3" style={{"--width": "300px"}}>
                            {!data && Array.from({length: 20}, (item, index) => 
                                <Cards.Profile key={index} btnText="Book Now" onBtnClick={() => navigate("/worker")} loading={true} name={<div className="orb font-semibold mb-1">David Shalom</div>}/>
                            )}

                            {data && userRank(safeGet(data, ["0"], []), safeGet(fallbackLocation, ["lat"], 0), safeGet(fallbackLocation, ["lng"], 0)).map((item, index) => 
                                <Cards.Profile key={index} btnText="Book Now" onBtnClick={() => navigate(`/worker/${encrypt(item.id)}`)} item={item} name={<div className="orb font-semibold mb-1">{safeGet(item.user, ["First Name"], "")} {safeGet(item.user, ["Last Name"], "")}</div>}/>
                            )}
                        </div>

                        <NoResults load={typeof(data) != 'undefined' && safeGet(data, ["0"], []).length <= 0} title="Skilled Workers Unavailable" text="Click the button to post your job, all skilled workers would be notified and would contact you as soon as possible" link={['Post Your Job', '/admin/job/new']} classname="min-h-[500px] flex items-center justify-center"/>

                    </div>
            </div>
        </>
    );
}