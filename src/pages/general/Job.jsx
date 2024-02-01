import { useState } from "react";
import { QueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

import { LocationSearch } from "components/BoxSearch";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { FormControl, InputLabel, OutlinedInput, InputAdornment, Select, MenuItem } from "@mui/material";

import { Btn, Loading } from "components/";

import { useData, getData } from "functions/reads/General";
import { decrypt, safeGet, checkInputsOnObj } from "functions/utils/Fixers";
import { errorAlert } from "functions/utils/Alert";
import { newApplication } from "functions/creates/Jobs"
import { where } from "firebase/firestore";
import { getAuth } from "firebase/auth";


let minDate= new Date();
let maxDate= new Date();
maxDate.setFullYear(maxDate.getFullYear + 1);

export default function () {

    const role = useSelector((state) => state.general);

    const [ inDisplay, setInDisplay ] = useState("booking");
    const [ inputs, setInputs ] = useState({
        chargeRate: "Per Job",
        date: dayjs(minDate),
    });

    const [ load, setLoad ] = useState(false);

    const navigate = useNavigate();

    const queryClient = new QueryClient();

    const { id } = useParams();

    const { data } = useData({
        target: "Jobs",
        conditions: [ where("Job ID", "==", decrypt(id)) ],
        callback: async (job) => {
            job.user = await getData({
                target: "users",
                conditions: [ where( "User ID", "==", job["Client ID"]) ]
            });

            job.user = safeGet(job.user, ["0", "0"], {});

            return job;
        }
    });

    const job = safeGet(data, ["0", "0"], {});

    console.log(job, "job here", data, decrypt(id));

    const handleSubmit = () => {

        const user = getAuth();

        if(user.currentUser == null || role.role !== "Professional Handyman") {
            errorAlert({
                title: "Registered Workers Only",
                text: 'Please log in or sign up as a service worker to apply for this job',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Log In",
            }).then( result => {
                if(result.isConfirmed) {
                    navigate("/login");
                    return false;
                }
            });
            return false;
        }

    

        setLoad(true);

        const profile = { ...inputs, 
            jobId: decrypt(id), 
            id: user.currentUser.uid, 
            note: safeGet(inputs, ["note"], ""), 
            receiver: safeGet(job, ["Client ID"], ""), 
            link: safeGet(inputs, ["link"], []) };

        if(!checkInputsOnObj(profile, ["chargeRate", "charge", "date"])) {
            errorAlert({
                title: "Empty Inputs",
                text: "Please check your inputs and try again"
            });

            setLoad(false);

            return false;
        }

        newApplication(profile).then( result => {
            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Application Sent Successfully"
                });

                queryClient.invalidateQueries();

                setLoad(false);
                navigate("/admin/jobs");
                return false;
            }

            errorAlert({
                title: "System Busy",
                text: "system is currently unable to send this application, please try again later"
            });

            setLoad(false);
        });

    }



    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Loading load={load} />
            <div className="p-10 py-5 max-w-[1165px] mx-auto">

                <div className="py-1">
                    <Btn.SmallBtn onClick={() => navigate(-1)}>Back</Btn.SmallBtn>
                </div>

                <div className="min-h-[222px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative grid grid-cols-10 mb-6">
                    <div className="image col-span-2 max-[865px]:col-span-3 max-[550px]:col-span-10 max-[550px]:h-[250px] ">
                        <img src={safeGet(job.user, ["Pic"], "/images/user.png")} className="object-cover h-full w-full " />
                    </div>
                    <div className="col-span-6 bg-white p-4 max-[865px]:col-span-7 max-[550px]:col-span-10">
                        <div className="text-gray-600 flex items-center gap-2 mb-1 text-xs">
                            <i className="bi bi-geo-alt border rounded-full h-[20px] w-[20px] flex items-center justify-center"></i>
                            <span className="" style={{width: 'calc(100% - 35px)'}}>{safeGet(job, ["Address"], "")}</span>
                        </div>
                        <div className="title orb text-lg my-3">{safeGet(job, ["Job Details", "title"], `${safeGet(job, ["Service Information", "Service Category"], "")} (${safeGet(job, ["Service Information", "Service Provided"], "")})`)}</div>

                        <p className="text-xs mb-3">{safeGet(job, ["Job Details", "description"], "")}</p>

                        <div className="font mb-1 text-sm">
                            Experience: {safeGet(job, ["Service Information", "Expertise"], "")}
                        </div>

                        <div className="font mb-1 text-sm">
                            Service Needed: {safeGet(job, ["Service Information", "Service Provided"], "")}
                        </div>

                        <div className="font mb-1 text-sm">
                            Service Category: {safeGet(job, ["Service Information", "Service Category"], "")}
                        </div>
                    </div>
                    <div className="col-span-2 bg-blue-50 max-[865px]:col-span-10 max-[865px]:min-h-[150px] p-2 flex flex-col">

                        <div className="flex flex-col items-center justify-center text-center flex-grow">
                            <div className="orb mb-1">
                                <span className="orb text-xs">Ghc</span>
                                <span className="orb text-lg">{safeGet(job, ["Service Information", "Charge"], "")}</span>/{safeGet(job, ["Service Information", "Charge Rate"], "")}
                            </div>

                            <div className="orb text-xs">{safeGet(job, ["Job Details", "People Applied"], 0)} Applications</div>
                        </div>

                    </div>
                </div>

                <div className="col-span-7 min-h-[90vh]">
                    <h3 className="font-semibold orb mb-5">Application Information</h3>

                    <form className="my-3">
                        <div className="grid grid-cols-10 gap-3 mb-6 max-[550px]:grid-cols-1">

                            <div className="col-span-3">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">How do you charge?</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={inputs?.chargeRate}
                                        label="How do you charge?"
                                        startAdornment={<InputAdornment position="start">I Charge</InputAdornment>}
                                        onChange={(e) => {setInputs({...inputs, chargeRate: e.target.value})} }
                                    >
                                        <MenuItem value={"Per Job"}>Per Job</MenuItem>
                                        <MenuItem value={"Per Month"}>Per Month</MenuItem>
                                        <MenuItem value={"Per Day"}>Per Day</MenuItem>
                                        <MenuItem value={"Per Hour"}>Per Hour</MenuItem>
                                        <MenuItem value={"Every 6 hours"}>Every 6 hours</MenuItem>
                                        <MenuItem value={"Every 12 hours"}>Every 12 hours</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="col-span-7">
                                <FormControl sx={{ width: "100%"}}>
                                    <InputLabel htmlFor="outlined-adornment-amount">How much do you charge?</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">Ghc</InputAdornment>}
                                        label="How much do you charge?"
                                        name="fullname"
                                        type="number"
                                        sx={{background: ""}}
                                        fullWidth
                                        onChange={(e) => {setInputs({...inputs, charge: e.target.value})} }
                                        
                                    />
                                </FormControl>
                            </div>
                        </div>

                        <div className="mb-6 grid">
                                <DateTimePicker 
                                    varient="outlined" 
                                    label="When can you start work?" 
                                    onChange={(date) => setInputs({...inputs, date})}  
                                    defaultValue={dayjs(minDate)} 
                                    fullWidth
                                    maxDate={dayjs(maxDate)}
                                    minDate={dayjs(minDate)}
                                />
                        </div>

                        <div className="mb-6">
                            <FormControl sx={{ width: "100%"}}>
                                <InputLabel htmlFor="outlined-adornment-amount">Application Document (not compulsary)</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start"></InputAdornment>}
                                    label="Application Document (not compulsary)"
                                    name="document"
                                    type="file"
                                    sx={{background: ""}}
                                    placeholder="Images, PDFs, or other documents that can help with your application"
                                    fullWidth
                                    onChange={(e) => {setInputs({...inputs, portfolio: e.target.files[0]})} }
                                    
                                />
                            </FormControl>
                        </div>

                        <div className="mb-6">
                            <FormControl sx={{ width: "100%"}}>
                                <InputLabel htmlFor="outlined-adornment-amount">Reference Link (not compulsary)</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start"></InputAdornment>}
                                    label="Reference Link (not compulsary)"
                                    name="link"
                                    type="link"
                                    sx={{background: ""}}
                                    placeholder=""
                                    fullWidth
                                    onChange={(e) => {setInputs({...inputs, link: [e.target.value]})} }
                                    
                                />
                            </FormControl>
                        </div>

                        <div className="mb-6">
                            <FormControl fullWidth sx={{marginBottom: "1rem"}}>
                                <InputLabel htmlFor="outlined-adornment-amount">Booking Note / Message</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start"><i className="bi bi-boy-text"></i></InputAdornment>}
                                    label="Booking Note / Message"
                                    name="service"
                                    placeholder="Type your message here..."
                                    sx={{
                                        borderColor: 'blue'
                                    }}
                                    size="small"
                                    multiline
                                    rows={3}
                                    onChange={(e) => {setInputs({...inputs, note: e.target.value})} }
                                />
                            </FormControl>
                        </div>



                        <Btn.SmallBtn onClick={handleSubmit} styles={{padding: ".25rem 0", height: '42px', fontSize: "0.85rem", width: "100%"}}>Complete Application</Btn.SmallBtn>

                    </form>
                </div>
                




            </div>
        </LocalizationProvider>
        
    );
}