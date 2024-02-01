import { useState, useRef }    from "react";
import { useNavigate      }    from "react-router-dom"
import { QueryClient      }    from "react-query";

import { safeGet, isValidURL, checkInputsOnObj }     from "functions/utils/Fixers";
import { errorAlert }           from "functions/utils/Alert";
import { newJob }               from "functions/creates/Jobs";
import { profileForService }    from "functions/reads/Users";

import { Btn, ServiceSelect, CategorySelect, FileUpload, ImageSelect, Loading } from "components";
import { Input, ListInput }      from "components/Input";
import { LocationSearch } from "components/BoxSearch";

import { InputLabel, MenuItem, FormControl, Select, InputAdornment } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { useSelector } from "react-redux";

import { getAuth } from "firebase/auth";



let minDate= new Date();
let maxDate= new Date();
maxDate.setFullYear(maxDate.getFullYear + 1);


export default function () {

    const role = useSelector((state) => state.general);

    const [ inDisplay, setInDisplay ] = useState("category");
    const [ inputs, setInputs ] = useState({
        chargeRate: "Per Job",
        expertise: "Intermidiate (2+ Years)",
        seenBy: "All",
        date: minDate,
    });
    const [ services,  setServices ]  = useState([]);
    const [ reference, setReference ] = useState([]);
    const [ location,  setLocation ]  = useState([]);

    const [ load, setLoad ] = useState(false);

    const user = getAuth();

    const navigate = useNavigate();

    const queryClient = new QueryClient();

    const selectCategory = (category) =>  {

        setInputs({...inputs, category: category["Category Name"]});

        setInDisplay("service");

        setServices(category["Services Provided"]);
    }

    const selectService = (service) => {

        profileForService(service.Title).then( result => {

            if(result.length > 0) {
                errorAlert({
                    title: "Profile Exists",
                    text: `Booking Profile for service "${service.Title}" already exists`
                });
                return false;
            }

            setInputs({...inputs, service: service["Title"]});
            setInDisplay("info");
        })
    }

    const handleSubmit = () => {

        setLoad(true);

        const profile = { ...inputs, id: user.currentUser.uid, location };

        if(!checkInputsOnObj(profile, ["category", "service", "chargeRate", "amount", "expertise", "title", "desc", "seenBy", "date"]) || (!checkInputsOnObj(profile, "address") && !checkInputsOnObj(profile, "location"))) {
            errorAlert({
                title: "Empty Inputs",
                text: "Please check your inputs and try again"
            });

            setLoad(false);

            return false;
        }

        console.log(profile, !checkInputsOnObj(profile, ["category", "service", "chargeRate", "amount", "expertise", "title", "desc"])); // setLoad(false); return false;

        newJob(profile).then( result => {
            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Job Created Successfully"
                });

                queryClient.invalidateQueries();

                navigate("/admin/jobs");
                return false;
            }

            errorAlert({
                title: "System Busy",
                text: "system is currently unable to create this job, please try again later"
            });

            setLoad(false);
        });

    }

    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <Loading load={load} />

            {inDisplay == "category" && 
                <CategorySelect back={() => navigate(-1)} selectCategory={selectCategory} title={"Please Choose A Category For Your Job"}/>
            }

            {inDisplay == "service" && 
                <ServiceSelect back={() => setInDisplay("category")} services={services} service={inputs?.service} selectService={selectService} title ={"What Kind Of Service Do You Need?"} />
            }


            {inDisplay == "info" && 
                <div>
                    <i onClick={() => setInDisplay("service")} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>

                    <h1 className="orb text-3xl text-center font-medium mx-auto my-6">Job Details</h1>
                    
                    <div className="mx-auto max-w-[500px]">

                        <div className="w-full bg-white rounded shadow-lg p-5">
                            <Input 
                                name="title"
                                placeholder="E.g Good Mechanic Needed"
                                label="A short title for this job"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                type="text"
                                size="small"
                                onChange={(e) => setInputs({...inputs, title: e.target.value})}
                            />

                            <Input 
                                name="description"
                                placeholder="E.g My car broke down on a bridge I need someone to help me start it up, I am at the accra kumasi main road"
                                label="Describe the job"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                type="text"
                                size="small"
                                multiline={true}
                                rows={3}
                                onChange={(e) => setInputs({...inputs, desc: e.target.value})}
                            />

                            <div className="grid mb-6">
                                <LocationSearch 
                                    typingCallback={(address) => { setInputs({...inputs, address}); setLocation({}); }} 
                                    callback={ (location) => {setLocation( {...location} ) } } 
                                    label="Where is the Job Located?" 
                                    sx={{boxShadow: "0 0 1px #2222223c"}} 
                                />
                            </div>


                            <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                                <InputLabel id="demo-simple-select-label">How are you paying?</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inputs.chargeRate}
                                    label="How do you charge?"
                                    startAdornment={<InputAdornment position="start">I Pay</InputAdornment>}
                                    onChange={(e) => setInputs({...inputs, chargeRate: e.target.value})}
                                    
                                    size="small"
                                >
                                    <MenuItem value={"Per Job"}>Per Job</MenuItem>
                                    <MenuItem value={"Per Month"}>Per Month</MenuItem>
                                    <MenuItem value={"Per Day"}>Per Day</MenuItem>
                                    <MenuItem value={"Per Hour"}>Per Hour</MenuItem>
                                    <MenuItem value={"Every 6 hours"}>Every 6 hours</MenuItem>
                                    <MenuItem value={"Every 12 hours"}>Every 12 hours</MenuItem>
                                </Select>
                            </FormControl>

                            <Input 
                                name="amount"
                                placeholder="E.g 300"
                                label="How much are you paying?"
                                startAdornment={<InputAdornment position="start">Ghc</InputAdornment>}
                                type="number"
                                size="small"
                                onChange={(e) => setInputs({...inputs, amount: e.target.value})}
                            />

                            <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                                <InputLabel id="demo-simple-select-label">What level of Experience do you need?</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inputs.expertise}
                                    label="What is your level of Experience?"
                                    startAdornment={<InputAdornment position="start"></InputAdornment>}
                                    onChange={(e) => setInputs({...inputs, expertise: e.target.value})}
                                    size="small"
                                >
                                    <MenuItem value={"Beginner (6+ Months)"}>Beginner (6+ Months)</MenuItem>
                                    <MenuItem value={"Intermidiate (2+ Years)"}>Intermidiate (2+ Years)</MenuItem>
                                    <MenuItem value={"Professional (4+ Years)"}>Professional (4+ Years)</MenuItem>
                                    <MenuItem value={"Expert (6+ Years)"}>Expert (6+ Years)</MenuItem>
                                </Select>
                            </FormControl>

                            <div className="mb-6 grid">
                                <DateTimePicker 
                                    varient="outlined" 
                                    label="Set a deadline for this job" 
                                    onChange={(date) => setInputs({...inputs, date})}  
                                    defaultValue={dayjs(minDate)} 
                                    fullWidth
                                    maxDate={dayjs(maxDate)}
                                    minDate={dayjs(minDate)}
                                />
                            </div>


                            <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                                <InputLabel id="demo-simple-select-label">Show this job to</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inputs.seenBy}
                                    label="Show this job to"
                                    startAdornment={<InputAdornment position="start"></InputAdornment>}
                                    onChange={(e) => setInputs({...inputs, seenBy: e.target.value})}
                                
                                    size="small"
                                >
                                    <MenuItem value={"All"}>All Workers</MenuItem>
                                    <MenuItem value={"Specific Category"}>Workers in your selected category</MenuItem>
                                </Select>
                            </FormControl>

                            

                            <Btn.SmallBtn onClick={handleSubmit} fullWidth>Create Job</Btn.SmallBtn>
                        </div>
                    </div>
                </div>
            }


        </LocalizationProvider>
    );
}