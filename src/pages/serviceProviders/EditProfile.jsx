import { useState, useEffect }    from 'react';
import { useSelector }            from "react-redux";
import { QueryClient      }       from "react-query";
import { useParams, useNavigate } from "react-router-dom";


import { Box, BottomNavigation, BottomNavigationAction, InputLabel, MenuItem, FormControl, Select, InputAdornment  } from '@mui/material';


import { useDocById }                                      from "functions/reads/General";
import { safeGet, isValidURL, checkInputsOnObj, decrypt }  from "functions/utils/Fixers";
import { getUrlThumbnail }                                 from "functions/utils/Files";
import { errorAlert }                                      from "functions/utils/Alert";
import { updateBookingProfile }                                   from "functions/edits/Users";

import { Btn, FileUpload, ImageSelect, Loading } from "components";
import { Input, ListInput }                      from "components/Input";

import { getAuth } from "firebase/auth";





export default function () {

    const { id } = useParams();

    const { data } = useDocById("Booking Profile", decrypt(id));

    const role      = useSelector((state) => state.general);
    const navigate  = useNavigate();
    const queryClient = new QueryClient();
    

    const [ focus, setFocus ]   = useState("info");
    const [ inputs, setInputs ] = useState({});
    const [ load, setLoad ] = useState(false);


    const user = getAuth();

    const [ reference, setReference ] = useState([]);

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
    };

    const handleFileTarget = (target) => {
        setInputs({...inputs, fileTarget: target});
    };

    const checkFile = (files) => {
        if(files.length > role.plan.Portfolios || ( safeGet(inputs, [inputs.fileTarget], []).length + safeGet(inputs, [`${inputs.fileTarget}Url`], []).length ) >= role.plan.Portfolios) {
            errorAlert({
                title: "Portfolio Limit Reached",
                text: `You have exceeded the maximum portfolio upload (${role.plan.Portfolios}) for your plan (${role.plan.Name} Plan), please upgrade your plan to upload more portfolios`,
            })
            
            return false;
        }

        return true;
    };
    
    const handleFileUpload = (files) => {  

        let newFileTarget = {};

        newFileTarget[inputs.fileTarget] = [...files];

        //just checking if say the state inputs has previous files for the file-target "experience"
        if(inputs[inputs.fileTarget] && files.length > 0) newFileTarget[inputs.fileTarget] = [...inputs[inputs.fileTarget], ...files];

        if(files.length == 0 && inputs.fileTarget == "experience")
            setInputs({...inputs, ...newFileTarget, experienceUrl: []})

        else if(files.length == 0 && inputs.fileTarget == "certificate")
            setInputs({...inputs, ...newFileTarget, certificateUrl: []})

        else
            setInputs({...inputs, ...newFileTarget})
    };

    const handleRemoveUrl = (url) => { 
        let newUrlList = inputs.experienceUrl.filter( item => item !== url);
        setInputs({ ...inputs, experienceUrl: [...newUrlList]});
    };

    const removeCertUrl = (url) => {
        let newUrlList = inputs.certificateUrl.filter( item => item !== url);
        setInputs({ ...inputs, certificateUrl: [...newUrlList]});
    }


    const handleSubmit = () => {
        setLoad(true);

        console.log(inputs);

        updateBookingProfile({ ...inputs, reference, id: decrypt(id) }).then( result => {
            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Booking Profile Updated Successfully"
                });

                queryClient.invalidateQueries();

                navigate("/admin/profiles");
                return false;
            }

            errorAlert({
                title: "System Busy",
                text: "system is currently unable to update this profile, please try again later"
            });

            setLoad(false);
        })

    }

    const handleDelete = () => {

    }


    useEffect( () => {
        if(typeof inputs.amount == "undefined" || inputs.amount == "")
        setInputs({
            chargeRate:     safeGet(data, ["Service Information", "Charge Rate"], ""),
            amount:         safeGet(data, ["Service Information", "Charge"], ""),
            expertise:      safeGet(data, ["Service Information", "Expertise"], ""),
            experienceUrl:  safeGet(data, ["Work Experience & Certification", "Experience"], []),
            certificateUrl: safeGet(data, ["Work Experience & Certification", "Certification"], []),
        });

        setReference(safeGet(data,["Work Experience & Certification", "Reference"], []));
    }, [data]);

    


    return (
        <div>

            <Loading load={load} />
            <div className="flex items-center gap-1">
                <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                <h1 className="orb text-lg mb-1">Booking Profile</h1>
            </div>

            
            <ImageSelect initImageUrl={safeGet(data, ["User Pic"], safeGet(user, ["currentUser", "photoURL"], "/images/user.png"))} initImage={inputs.pic} callback={(file) => setInputs({...inputs, pic: file})} containerClass="h-[190px] w-[190px] rounded-full mx-auto mb-6" />
            
            <div className="font-semibold text-lg orb text-center my-3">{`${safeGet(data, ["Service Information", "Service Category"], "")} (${safeGet(data, ["Service Information", "Service Provided"], "")})`}</div>
           

            <div className="mx-auto w-max rounded-lg overflow-hidden shadow border">
                <Box sx={{ width: 300 }}>
                    <BottomNavigation
                        showLabels
                        value={focus}
                        onChange={(event, newValue) => {
                            setFocus(newValue);
                        }}
                    >
                        <BottomNavigationAction value="info"        label="Profile"  icon={<i className="bi bi-person font-semibold" />} />
                        <BottomNavigationAction value="certs"       label="Certificates"         icon={<i className="bi bi-patch-check font-semibold" />} />
                        <BottomNavigationAction value="experience"  label="Experience"           icon={<i className="bi bi-wrench-adjustable-circle font-semibold "   />} />
                    </BottomNavigation>
                </Box>
            </div>

            <div className=" mt-3">
                {focus == "info" && 
                    <div className="mx-auto max-w-[500px]">

                        <div className="w-full bg-white rounded shadow-lg p-5">
                            <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                                <InputLabel id="demo-simple-select-label">How do you charge?</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={safeGet(inputs, ["chargeRate"], "")}
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
                                value={inputs.amount}
                                onChange={(e) => setInputs({...inputs, amount: e.target.value})}
                            />

                            <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                                <InputLabel id="demo-simple-select-label">What is your level of Experience?</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={safeGet(inputs, ["expertise"], "")}
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

                                <ListInput initList={safeGet(data, ["Work Experience & Certification", "Reference"], [])} checkInsert={refferenceCheck} callback={handleReference} />

                            </div>

                            

                        </div>
                    </div>
                }

                { focus == "experience" && 
                    <div>
                        <FileUpload 
                            title="Experience"
                            description={<span className="text-sm">Upload pictures of you working or pictures of works you have done</span>}
                            btnOnClick={() => handleFileTarget("experience")}
                            callback={handleFileUpload}
                            checkFile={checkFile}
                            btnText="Click Me To Upload"
                            prevFiles={inputs?.experience}
                            prevFilesUrl={[...inputs?.experienceUrl]}
                            removeUrl={handleRemoveUrl}
                        />
                    </div>
                }

                { focus == "certs" && 
                    <div>
                        <FileUpload 
                            title="Certificates"
                            description={<span className="text-sm">Click the btn bellow to upload any certificate</span>}
                            btnOnClick={() => handleFileTarget("certificate")}
                            callback={handleFileUpload}
                            checkFile={checkFile}
                            btnText="Click Me To Upload"
                            prevFiles={inputs?.certificate}
                            prevFilesUrl={[...inputs?.certificateUrl]}
                            removeUrl={removeCertUrl}
                        />
                    </div>
                }
            </div>

            <div className=" flex justify-end items-center gap-1 absolute bottom-0 left-0 w-full bg-white p-2 z-10">
                <div className="" style={{width: "calc(100% - 40px"}}>
                    <Btn.SmallBtn onClick={handleSubmit} fullWidth>Update Profle</Btn.SmallBtn>
                </div>
                <i onClick={handleDelete} className="bi bi-trash text-lg bg-red-500 hover:bg-red-600 active:bg-red-700 w-[35px] h-[35px] rounded-md flex items-center justify-center text-white" />    
            </div>

        </div>
    );
}