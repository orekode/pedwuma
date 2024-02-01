import { useState, useRef }    from "react";
import { useNavigate      }    from "react-router-dom"
import { QueryClient      }    from "react-query";

import { safeGet, isValidURL, checkInputsOnObj }     from "functions/utils/Fixers";
import { errorAlert }           from "functions/utils/Alert";
import { newProfile }           from "functions/creates/Users";
import { profileForService }    from "functions/reads/Users";

import { Btn, ServiceSelect, CategorySelect, FileUpload, ImageSelect, Loading } from "components";
import { Input, ListInput }      from "components/Input";

import { InputLabel, MenuItem, FormControl, Select, InputAdornment } from '@mui/material'

import { useSelector } from "react-redux";

import { getAuth } from "firebase/auth";



export default function () {

    const role = useSelector((state) => state.general);

    const [ inDisplay, setInDisplay ] = useState("category");
    const [ inputs, setInputs ] = useState({
        chargeRate: "Per Job",
        expertise: "Intermidiate (2+ Years)",
    });
    const [ services, setServices ] = useState([]);
    const [ reference, setReference ] = useState([]);

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
            setInDisplay("experience");
        })
    }

    const handleFileTarget = (target) => {
        setInputs({...inputs, fileTarget: target});
    }

    const checkFile = (files) => {
        if(files.length > role.plan.Portfolios || safeGet(inputs, [inputs.fileTarget], []).length >= role.plan.Portfolios) {
            errorAlert({
                title: "Portfolio Limit Reached",
                text: `You have exceeded the maximum portfolio upload (${role.plan.Portfolios}) for your plan (${role.plan.Name} Plan), please upgrade your plan to upload more portfolios`,
            })
            
            return false;
        }

        return true;
    }
    
    const handleFileUpload = (files) => {  

        let newFileTarget = {};

        newFileTarget[inputs.fileTarget] = [...files];

        //just checking if say the state inputs has previous files for the file-target "experience"
        if(inputs[inputs.fileTarget]) newFileTarget[inputs.fileTarget] = [...inputs[inputs.fileTarget], ...files];


        setInputs({...inputs, ...newFileTarget})
    }

    const handleReference = (reference) => {
        setReference([...reference]);
    }

    const refferenceCheck = (item) => {

        if(!isValidURL(item)) {
            errorAlert({
                title: "Invalid Link",
                text: "Please provide a valid link and try again"
            });

            return false;
        }

        return true;
    }

    const handleSubmit = () => {

        setLoad(true);

        const profile = { ...inputs, ...reference, rating: role.plan["Default Rating"]};

        if(!checkInputsOnObj(profile, ["category", "service", "chargeRate", "amount", "expertise"])) {
            errorAlert({
                title: "Empty Inputs",
                text: "Please check your inputs and try again"
            });

            setLoad(false);
        }

        newProfile(profile).then( result => {
            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Booking Profile Created Successfully"
                });

                queryClient.invalidateQueries();

                navigate("/admin/profiles");
                return false;
            }

            errorAlert({
                title: "System Busy",
                text: "system is currently unable to create this profile, please try again later"
            });

            setLoad(false);
        });

    }

    

    return (
        <div>

            <Loading load={load} />

            {inDisplay == "category" && 
                <CategorySelect back={() => navigate(-1)} selectCategory={selectCategory} />
            }

            {inDisplay == "service" && 
                <ServiceSelect back={() => setInDisplay("category")} services={services} service={inputs?.service} selectService={selectService} />
            }


            {inDisplay == "experience" && 

                <div>
                    <FileUpload 
                        back={() => setInDisplay("service")} 
                        title="Experience"
                        description="Do you have pictures or documents that shows your experience delivering this service, it can be pictures of you at work or pictures/documents of the works you have done, if not click next to continue"
                        btnOnClick={() => handleFileTarget("experience")}
                        callback={handleFileUpload}
                        checkFile={checkFile}
                        btnText="Click Me To Upload"
                        prevFiles={inputs?.experience}
                    />

                    
                    <div className=" flex justify-end items-center gap-1 absolute bottom-0 left-0 w-full bg-white p-2">
                            <Btn.SmallBtn onClick={() => {setInDisplay("certificate")}}>Next</Btn.SmallBtn>
                    </div>
                    
                </div>
            }

            {inDisplay == "certificate" && 
                <div>
                    <FileUpload 
                        back={() => setInDisplay("experience")} 
                        title="Certificates"
                        description="Please click the button bellow to upload any certificates you have to render this service"
                        btnOnClick={() => handleFileTarget("certificate")}
                        callback={handleFileUpload}
                        checkFile={checkFile}
                        btnText="Click Me To Upload"
                        prevFiles={inputs?.certificate}
                    />

                    
                    <div className=" flex justify-end items-center gap-1 absolute bottom-0 left-0 w-full bg-white p-2">
                            <Btn.SmallBtn onClick={() => {setInDisplay("info")}}>Next</Btn.SmallBtn>
                    </div>
                    
                </div>
            }

            {inDisplay == "info" && 
                <div>
                    <i onClick={() => setInDisplay("certificate")} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>

                    <h1 className="orb text-3xl text-center font-medium mx-auto my-6">Booking Information</h1>
                    
                    <div className="mx-auto max-w-[500px]">

                        <div className="w-full bg-white rounded shadow-lg p-5">
                            <ImageSelect initImageUrl={user.currentUser.photoURL} initImage={inputs.pic} callback={(file) => setInputs({...inputs, pic: file})} containerClass="h-[190px] w-[190px] rounded-full mx-auto mb-6" />
                            <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                                <InputLabel id="demo-simple-select-label">How do you charge?</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inputs.chargeRate}
                                    label="How do you charge?"
                                    startAdornment={<InputAdornment position="start">I Charge</InputAdornment>}
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
                                label="How much do you charge?"
                                startAdornment={<InputAdornment position="start">Ghc</InputAdornment>}
                                type="number"
                                size="small"
                                onChange={(e) => setInputs({...inputs, amount: e.target.value})}
                            />

                            <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                                <InputLabel id="demo-simple-select-label">What is your level of Experience?</InputLabel>
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

                            <div className="w-full">

                                <div className="text-xs leading-tight mb-6 text-gray-700">Please provide any reference link you have for this service, (providing the links is not compulsary).</div>

                                <ListInput checkInsert={refferenceCheck} callback={handleReference} />
                            </div>

                            

                            <Btn.SmallBtn onClick={handleSubmit} fullWidth>Create Profile</Btn.SmallBtn>
                        </div>
                    </div>
                </div>
            }


        </div>
    );
}