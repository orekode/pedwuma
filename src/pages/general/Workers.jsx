import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Header, Btn, Cards, PopularServices, EmptyBox } from "components";

import { LocationSearch, ServiceSearch } from "../../components/BoxSearch";

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'

import { useData, getData } from "functions/reads/General";

import { encrypt, safeGet } from "functions/utils/Fixers";

import { where, limit, orderBy } from "firebase/firestore";

import { userRank, ipInfo } from "functions/utils/Locations";

import { t } from "../../functions/utils/Translator";

import { useSelector } from 'react-redux';
import { SmallBtn } from "../../components/Buttons";


let lat = 0;
let lng = 0;

ipInfo().then( result => {
    lat = result?.lat;
    lng = result?.lng;
});

export default function() {

    const lang = useSelector((state) => state.general.lang);

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
        conditions: [orderBy("Work Experience & Certification.Rating", "desc") ],
        location: null,
        orderBy: ["Work Experience & Certification.Rating", "desc"],
        orderMap: {
            "More E": ["Work Experience & Certification.Rating", "desc"],
            "Less E": ["Work Experience & Certification.Rating", "asc"],
            "Low P":  ["Service Information.Charge", "asc"],
            "High P": ["Service Information.Charge", "desc"],
        },
        next: null,
        back: null,
        history: [null],
        index: 0,
    });

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
        },
        next: parameters.next,
    });


    useEffect(() => {

        console.log(parameters);

        if(parameters.service !== "") {
            setParameters({ ...parameters, conditions: [ 
                where("Service Information.Service Provided", "==", parameters.service),
                orderBy(...parameters.orderBy),
            ]});
        }
        else {
            setParameters({ ...parameters, conditions: [ 
                orderBy(...parameters.orderBy),
            ]});
        }

    }, [parameterChange]);

    const checkToDefault = (input) => {



        if (input.replaceAll(" ", "") == "") {
            setParameters({...parameters, service: "", conditions: [where("Work Experience & Certification.Rating", "desc"), limit(100)]});
            setParameterChange(!parameterChange);
        }
    }

    const handleNext = () => {

        let oldHistory = [ ...parameters.history ];
        let oldIndex = parameters.index;
        let nextItem = safeGet(data, ["1"], null);


        if(oldHistory.indexOf(nextItem) < 0) {
            oldHistory = [...parameters.history, nextItem];
            oldIndex++;
        }
        
        setParameters({ ...parameters, history: oldHistory, index: oldIndex, next: nextItem });
        setParameterChange(!parameterChange); 
        
    }

    const handleBack = () => {

        let oldHistory = [ ...parameters.history ];

        //if index is greater that the length of history list 
        //set to length of history list - 1
        //if index - 1 is less than 0 set to 0
        //else set to index - 1 to get previous element
        let nextIndex = parameters.index >= oldHistory.length ? oldHistory.length - 1 : parameters.index - 1 < 0 ? 0 : parameters.index - 1;

        if(oldHistory.length > 1 ) oldHistory.pop();

        setParameters({ ...parameters, next: parameters.history[nextIndex], history: [...oldHistory], index: nextIndex }); 
        setParameterChange(!parameterChange);
    }

    return (
        <>

            <Header 
                image={`/images/workers.jpg`} 
                title={<>{t(lang, "Find")}<span className="text-blue-400 orb"> {t(lang, "The Workers You Need")} </span>{t(lang, "For All Your Jobs")}</>}
                text={<>{t(lang, "Are you looking for people to help with plumbing, carpentry, sewing, catering, or other jobs? You can check our list of workers and choose the right people for your job")}</>}
            />

            <div className="px-10 py-5 max-[1165px]:px-5">

                <h2 className="orb py-5 font-bold">{t(lang, "Search For Workers")}</h2>

                <div className="gap-2 max-[850px]:hidden items-center grid grid-cols-6 rounded">
                    <div className="grid grid-cols-1 col-span-2 max-[850px]:col-span-6">
                        <LocationSearch callback={(location) => {setParameters({...parameters, location}); setParameterChange(!parameterChange)}} sx={{boxShadow: "0 0 1px #2222223c"}} />
                    </div>

                    <div className="grid grid-cols-1 col-span-4 max-[850px]:col-span-6">
                        <ServiceSearch callback={(sub) => {setParameters({...parameters, service: safeGet(sub, "Title", "")}); setParameterChange(!parameterChange)}} whatUserTypes={checkToDefault} sx={{boxShadow: "0 0 1px #2222223c"}}/>
                    </div>
                </div>

                <div className="gap-2 hidden max-[850px]:grid max-[850px]:gap-4 items-center grid-cols-6 rounded">
                    <div className="grid grid-cols-1 col-span-2 max-[850px]:col-span-6">
                        <LocationSearch sx={{boxShadow: "0 0 1px #2222223c"}} size="small" />
                    </div>

                    <div className="grid grid-cols-1 col-span-4 max-[850px]:col-span-6">
                        <ServiceSearch whatUserTypes={(input) => { input.replaceAll(" ", "") == "" ? setParameters({...parameters, conditions: [where("Work Experience & Certification.Rating", "desc"), limit(100)]}) : ""}} sx={{boxShadow: "0 0 1px #2222223c"}} size="small" />
                    </div>
                </div>

            </div>

            <div className="px-10 max-[1165px]:px-5">
                <i onClick={() => setShowMenu(!showMenu)} className={`bi bi-${showMenu ? 'x-lg' : 'list'} max-[1185px]:flex hidden mb-5 shadow h-[40px] w-[40px] rounded items-center justify-center text-xl`}></i>
                <div className="overflow-hidden h-max splitboard flex gap-4 relative top-0 right-0" style={{"--menu": '300px'}}>
                    <div className={`left top-0 bg-white z-10 border shadow p-2 py-5 rounded-md h-max  ${ showMenu ? 'left-0' : 'max-[1185px]:-left-[200vw]' }`}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{t(lang, "Workers with")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={"More E"}
                                label="Workers that are?"
                                size="small"
                                onChange={(e) => {setParameters({...parameters, orderBy: parameters.orderMap[e.target.value], next: null, back: null, history: [null], index: 0 }); setParameterChange(!parameterChange)}}
                            >
                                <MenuItem value={"More E"}>{t(lang, "High Rank")}</MenuItem>
                                <MenuItem value={"Less E"}>{t(lang, "Low Rank")}</MenuItem>
                                <MenuItem value={"Low P"}> {t(lang, "Low Pay")}</MenuItem>
                                <MenuItem value={"High P"}>{t(lang, "High Pay")}</MenuItem>
                            </Select>
                        </FormControl>

                        <h1 className="orb my-5">{t(lang, "Popular Services")}</h1>

                        <PopularServices callback={(sub) => {setParameters({...parameters, service: sub, next: null, back: null, history: [null], index: 0}); setParameterChange(!parameterChange)}} />
                    </div>
                    <div className="right " style={{"--width": "240px"}}>

                        <div className="h-max grid-box-fill gap-3">
                            {!data && Array.from({length: 20}, (item, index) => 
                                <Cards.Profile key={index} btnText="Book Now" onBtnClick={() => navigate("/worker")} loading={true} name={<div className="orb font-semibold mb-1">David Shalom</div>}/>
                            )}

                            {data && userRank(safeGet(data, ["0"], []), safeGet(fallbackLocation, ["lat"], 0), safeGet(fallbackLocation, ["lng"], 0)).map((item, index) => 
                                <Cards.Profile key={index} btnText="Book Now" onBtnClick={() => navigate(`/worker/${encrypt(item.id)}`)} item={item} name={<div className="orb font-semibold mb-1">{safeGet(item.user, ["First Name"], "")} {safeGet(item.user, ["Last Name"], "")}</div>}/>
                            )}
                        </div>

                        <EmptyBox load={typeof(data) != 'undefined' && safeGet(data, ["0"], []).length <= 0} title="No Workers On This Page" text="Please check other pages or try again later"/>

                        <div className="flex items-center justify-between my-12">
                            <SmallBtn onClick={handleBack}>Back</SmallBtn>
                            <SmallBtn onClick={handleNext}>Next</SmallBtn>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}