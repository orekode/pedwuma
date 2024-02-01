import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Header, Btn, Cards, PopularServices, EmptyBox } from "components";

import { LocationSearch, ServiceSearch } from "../../components/BoxSearch";

import { InputLabel, MenuItem, FormControl, Select, Skeleton } from '@mui/material'

import { useData, getData } from "functions/reads/General";

import { encrypt, safeGet } from "functions/utils/Fixers";

import { where, limit, orderBy, and, startAt, endAt } from "firebase/firestore";

import { jobRank, ipInfo } from "functions/utils/Locations";

import { geohashQueryBounds } from "geofire-common";


let lat = 5.7062137;
let lng = -0.3019281;

ipInfo().then( result => {
    lat = result?.lat;
    lng = result?.lng;
});


export default function() {

    const [ showMenu, setShowMenu ] = useState(false);
    const [ parameterChange, setParameterChange ] = useState(false);
    const navigate = useNavigate();
    const [ location, setLocation ] = useState({
        lat: lat,
        lng: lng,
        bounds: geohashQueryBounds([lat,lng], 50000000)

    });

    useEffect(() => {
        setLocation({
            lat: lat,
            lng: lng,
            bounds: geohashQueryBounds([lat,lng], 50000000)
        })
    }, [lat, lng]);



    const [ parameters, setParameters ] = useState({
        service: "",
        conditions: [where("Job Details.Job Status", "==", true), orderBy("Work Detail & Rating.Rating", "desc")],
        location: null,
        orderBy: ["Work Detail & Rating.Rating", "desc"],
        orderMap: {
            "More E": ["Work Detail & Rating.Rating", "desc"],
            "Less E": ["Work Detail & Rating.Rating", "asc"],
            "Low P":  ["Service Information.Charge", "asc"],
            "High P": ["Service Information.Charge", "desc"],
        },
        next: null,
        back: null,
        history: [null],
        index: 0,
    });

    const { data } = useData({
        target: "Jobs",
        conditions: parameters.conditions,
        callback: async (job) => {
            job.user = await getData({
                target: "users",
                conditions: [ where( "User ID", "==", job["User ID"]) ]
            });

            job.user = safeGet(job.user, ["0", "0"], {});

            return job;
        },
        next: parameters.next,

    });

    console.log(data);

    useEffect(() => {


        if(parameters.location != null) {
            setLocation({
                lat: safeGet(parameters, ["location", "lat"], 0),
                lng: safeGet(parameters, ["location", "lng"], 0),
                bounds: geohashQueryBounds([safeGet(parameters, ["location", "lat"], 0), safeGet(parameters, ["location", "lng"], 0)], 50000000)
            })
        }

        if(parameters.service !== "") {
            setParameters({ ...parameters, conditions: [ 
                and(
                    where("Job Details.Job Status", "==", true),
                    where("Service Information.Service Provided", "==", parameters.service),
                ),
                orderBy(...parameters.orderBy),
                limit(100),
            ]});
        }
        else {
            setParameters({ ...parameters, conditions: [ 
                and(
                    where("Job Details.Job Status", "==", true),
                    where("Job Details.Job Status", "==", true),
                ),
                orderBy(...parameters.orderBy),
                limit(100),
            ]});
        }

    }, [parameterChange]);

    const checkToDefault = (input) => {

        if (input.replaceAll(" ", "") == "") {
            setParameters({...parameters, service: "", conditions: [
            and(
                where("Job Details.Job Status", "==", true), 
                where("Work Detail & Rating.Rating", "desc"), 
            ),
            limit(100)]});
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
                image={`/images/jobs.jpg`} 
                title={<>Find <span className="text-blue-400 orb"> Jobs Closer To You </span></>}
                text={<>Are you looking for a job, check our list of jobs and apply for jobs that are right for you, apply now to start earning</>}
            />

            <div className="px-10 py-5 max-[1165px]:px-5">

                <h2 className="orb py-5 font-bold">Search For Jobs</h2>

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
                        <LocationSearch callback={(location) => {setParameters({...parameters, location}); setParameterChange(!parameterChange)}} sx={{boxShadow: "0 0 1px #2222223c"}} size="small" />
                    </div>

                    <div className="grid grid-cols-1 col-span-4 max-[850px]:col-span-6">
                        <ServiceSearch callback={(sub) => {setParameters({...parameters, service: safeGet(sub, "Title", "")}); setParameterChange(!parameterChange)}}  whatUserTypes={checkToDefault} sx={{boxShadow: "0 0 1px #2222223c"}} size="small" />
                    </div>
                </div>

            </div>

            <div className="px-10 max-[1165px]:px-5">

                <div className="flex items-center justify-end">
                    <i onClick={() => setShowMenu(!showMenu)} className={`bi bi-${showMenu ? 'x-lg' : 'list'} max-[1185px]:flex hidden mb-5 shadow h-[40px] w-[40px] rounded items-center justify-center text-xl`}></i>
                </div>

                <div className="overflow-hidden h-max splitboard flex gap-4 relative top-0 right-0" style={{"--menu": '300px'}}>
                    <div className="right min-h-screen">
                        {data && jobRank(data[0], location.lat, location.lng )?.map( (item, index) => 
                            <div key={index} className="min-h-[222px] max-h-[280px] mb-4 border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative grid grid-cols-10">
                                <div className="image col-span-2 max-[865px]:col-span-3 max-[550px]:col-span-10 max-[550px]:h-[250px] ">
                                    <img src={safeGet(item.user, ["Pic"], "/images/user.png")} className="object-cover h-full w-full " />
                                </div>
                                <div className="col-span-6 bg-white p-4 max-[865px]:col-span-7 max-[550px]:col-span-10">
                                    <div className="text-gray-600 flex items-center gap-2 mb-1 text-xs">
                                        <i className="bi bi-geo-alt border rounded-full h-[20px] w-[20px] flex items-center justify-center"></i>
                                        <span className="" style={{width: 'calc(100% - 35px)'}}>{safeGet(item, ["Address"], "")}</span>
                                    </div>
                                    <div className="title orb text-lg my-3">{safeGet(item, ["Job Details", "title"], `${safeGet(item, ["Service Information", "Service Category"], "")} (${safeGet(item, ["Service Information", "Service Provided"], "")})`)}</div>
    
                                    <p className="text-xs mb-3">{safeGet(item, ["Job Details", "description"], "")}</p>
    
                                    <div className="font mb-1 text-sm">
                                        Experience: {safeGet(item, ["Service Information", "Expertise"], "")}
                                    </div>

                                    <div className="font mb-1 text-sm">
                                        Service Needed: {safeGet(item, ["Service Information", "Service Provided"], "")}
                                    </div>

                                    <div className="font mb-1 text-sm">
                                        Service Category: {safeGet(item, ["Service Information", "Service Category"], "")}
                                    </div>
                                </div>
                                <div className="col-span-2 bg-blue-50 max-[865px]:col-span-10 max-[865px]:min-h-[150px] max-h-[280px] p-2 flex flex-col">

                                    <div className="flex flex-col items-center justify-center text-center flex-grow">
                                        <div className="orb mb-1">
                                            <span className="orb text-xs">Ghc</span>
                                            <span className="orb text-lg">{safeGet(item, ["Service Information", "Charge"], "")}</span>/{safeGet(item, ["Service Information", "Charge Rate"], "")}
                                        </div>

                                        <div className="orb text-xs">{safeGet(item, ["Job Details", "People Applied"], 0)} Applications</div>
                                    </div>
        
                                    <Link to={`/job/${encrypt(item.id)}`}>
                                        <Btn.SmallBtn fullWidth>Apply Now</Btn.SmallBtn>
                                    </Link>
                                </div>
                            </div>
                        )}
                        {!data &&  Array.from({length: 20}, (item, index) => 
                            <div key={index} className="min-h-[222px] mb-4 border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative grid grid-cols-10">
                                    <div className="image col-span-2 max-[865px]:col-span-3 max-[550px]:col-span-10 max-[550px]:h-[250px] px-2">
                                        <Skeleton height={"100%"} />
                                    </div>
                                <div className="col-span-6 bg-white p-4 max-[865px]:col-span-7 max-[550px]:col-span-10">
                                    <div className="text-gray-600 flex items-center gap-2 mb-1 text-xs">
                                        <i className="bi bi-geo-alt border rounded-full h-[20px] w-[20px] flex items-center justify-center"></i>
                                        <span className="" style={{width: 'calc(100% - 35px)'}}><Skeleton /></span>
                                    </div>
                                    <div className="title orb text-lg my-3"><Skeleton height={30}/></div>
    
                                    <p className="text-xs mb-3">
                                        <Skeleton height={50} />
                                    </p>
    
                                    <div className="font mb-1 text-sm">
                                        <Skeleton />
                                    </div>

                                    <div className="font mb-1 text-sm">
                                        <Skeleton />
                                    </div>
                                </div>
                                <div className="col-span-2 bg-blue-50 max-[865px]:col-span-10 max-[865px]:min-h-[150px] p-2 flex flex-col">

                                    <div className="flex flex-col items-center justify-center text-center flex-grow">
                                        <div className="orb mb-1"><Skeleton width={80}/></div>

                                        <div className="orb text-xs"><Skeleton width={80} /></div>
                                    </div>
        
                                    <Link>
                                        <Skeleton />
                                    </Link>
                                </div>
                            </div>
                        )}
                        <EmptyBox load={typeof(data) != 'undefined' && safeGet(data, ["0"], []).length <= 0} title="No Jobs On This Page" text="Please check other pages or try again later"/>

                        <div className="flex items-center justify-between my-12">
                            <Btn.SmallBtn onClick={handleBack}>Back</Btn.SmallBtn>
                            <Btn.SmallBtn onClick={handleNext}>Next</Btn.SmallBtn>
                        </div>

                    </div>
                    <div className={`left top-0 bg-white z-10 border shadow p-2 py-5 rounded-md h-max relative  ${ showMenu ? 'right-0' : 'max-[1185px]:-right-[200vw]' }`}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Workers with</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={"More E"}
                                label="Workers that are?"
                                size="small"
                                onChange={(e) => {setParameters({...parameters, orderBy: parameters.orderMap[e.target.value]}); setParameterChange(!parameterChange)}}
                            >
                                <MenuItem value={"More E"}>High Rank</MenuItem>
                                <MenuItem value={"Less E"}>Low Rank</MenuItem>
                                <MenuItem value={"Low P"}>Low Pay</MenuItem>
                                <MenuItem value={"High P"}>High Pay</MenuItem>
                            </Select>
                        </FormControl>

                        <h1 className="orb my-5">Popular Services</h1>

                        <PopularServices callback={(service) => {setParameters({...parameters, service}); setParameterChange(!parameterChange)}} />

                    </div>
                </div>
            </div>
        </>
    );
}