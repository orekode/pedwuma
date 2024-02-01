import { useState, useRef, useEffect }    from "react";
import { useNavigate, useParams }         from "react-router-dom"
import { QueryClient      }               from "react-query";

import { safeGet, decrypt, checkInputsOnObj }     from "functions/utils/Fixers";
import { errorAlert }                             from "functions/utils/Alert";
import { editJob }                                from "functions/edits/Jobs";
import { useData }                                from "functions/reads/General";
import { deleteById }                             from "functions/deletes/General";

import { Btn, Loading }        from "components";
import { Input }      from "components/Input";

import { InputLabel, MenuItem, FormControl, Select, InputAdornment } from '@mui/material'

import { getAuth }    from "firebase/auth";
import { where, and } from "firebase/firestore";



export default function () {

    
    const { id } = useParams();


    const [ load, setLoad ] = useState(false);

    const user = getAuth();

    const navigate = useNavigate();

    const queryClient = new QueryClient();

    const { data } = useData({
        target: "Jobs",
        conditions: [
            and(
                where("Client ID", "==", user.currentUser.uid),
                where("Job ID", "==", decrypt(id)),
            )
        ],
    });

    const job = safeGet(data, ["0", "0"], {});

    const [ inputs, setInputs ] = useState({
        chargeRate: safeGet(job, ["Service Information", "Charge Rate"], ""),
        amount:     safeGet(job, ["Service Information", "Charge"], ""),
        expertise:  safeGet(job, ["Service Information", "Expertise"], ""),
        category:   safeGet(job, ["Service Information", "Service Category"], ""),
        service:    safeGet(job, ["Service Information", "Service Provided"], ""),
        seenBy:     safeGet(job, ["Seen By"], ""),
        title:      safeGet(job, ["Job Details", "title"], ""),
        desc:       safeGet(job, ["Job Details", "description"], ""),
    });
    
    useEffect( () => {
        const job = safeGet(data, ["0", "0"], {});

        setInputs({
            chargeRate: safeGet(job, ["Service Information", "Charge Rate"], ""),
            amount:     safeGet(job, ["Service Information", "Charge"], 0),
            expertise:  safeGet(job, ["Service Information", "Expertise"], ""),
            category:   safeGet(job, ["Service Information", "Service Category"], ""),
            service:    safeGet(job, ["Service Information", "Service Provided"], ""),
            seenBy:     safeGet(job, ["Seen By"], ""),
            title:      safeGet(job, ["Job Details", "title"], ""),
            desc:       safeGet(job, ["Job Details", "description"], ""),
        })

    }, [data])


    const handleSubmit = () => {

        setLoad(true);

        const profile = { ...inputs, id: decrypt(id) };

        if(!checkInputsOnObj(profile, ["chargeRate", "amount", "expertise", "title", "desc", "seenBy"])) {
            errorAlert({
                title: "Empty Inputs",
                text: "Please check your inputs and try again"
            });

            setLoad(false);

            return false;
        }

        console.log(profile, !checkInputsOnObj(profile, ["category", "service", "chargeRate", "amount", "expertise", "title", "desc"])); // setLoad(false); return false;

        editJob(profile).then( result => {
            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Job Edited Successfully"
                });

                queryClient.invalidateQueries();

                navigate("/admin/jobs");
                return false;
            }

            errorAlert({
                title: "System Busy",
                text: "system is currently unable to edit this job, please try again later"
            });

            setLoad(false);
        });

    }

    const handleDelete = () => {
        deleteById("Jobs", decrypt(id), setLoad).then( result => {

            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Job Deleted Successfully"
                });
                queryClient.invalidateQueries();
                navigate("/admin/jobs");
                return false;
            }

            errorAlert({
                icon: "error",
                title: "System Busy",
                text: "System is unable to delete this job now, please try again later",
            });
        });
    }

    return (
        <div>
            <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
            <Loading load={load} />
            <div className="mx-auto max-w-[500px]">

                <div className="w-full bg-white rounded shadow-lg p-5">

                    <div className="text-xl font-semibold mb-6">
                        <span className="orb">{safeGet(job, ["Service Information", "Service Category"])} ({safeGet(job, ["Service Information", "Service Provided"])})</span>
                    </div>
                     

                    <Input 
                        name="title"
                        placeholder="E.g Good Mechanic Needed"
                        label="A short title for this job"
                        startAdornment={<InputAdornment position="start"></InputAdornment>}
                        type="text"
                        size="small"
                        value={inputs.title}
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
                        value={inputs.desc}
                        onChange={(e) => setInputs({...inputs, desc: e.target.value})}
                    />

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
                        value={inputs.amount}
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

                    

                    <div className="flex items-center gap-2">
                        <Btn.SmallBtn onClick={handleSubmit} styles={{wi40dth: "calc(100% - 35px)"}} fullWidth>Update Job</Btn.SmallBtn>
                        <i onClick={handleDelete} className="bi bi-trash text-lg bg-red-500 hover:bg-red-600 active:bg-red-700 w-[35px] h-[35px] rounded-md flex items-center justify-center text-white" />    
                    </div>
                </div>
            </div>
        </div>
    );
}