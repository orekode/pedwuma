import { useEffect, useState }   from "react";
import { useNavigate }           from "react-router-dom";

import { Loading, ImageSelect, Btn }  from "components";
import { Input }                      from "components/Input";

import { safeGet }       from "functions/utils/Fixers";
import { errorAlert }    from "functions/utils/Alert";
import { useData }       from "functions/reads/General";
import { updateDetails } from "functions/edits/Users";


import { Box, BottomNavigation, BottomNavigationAction, InputLabel, MenuItem, FormControl, Select, InputAdornment  } from '@mui/material';


import { where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { checkInputsOnObj } from "../../functions/utils/Fixers";

import { useDispatch } from "react-redux";
import { login } from "../../config/general";

export default function() {

    const navigate = useNavigate();

    const dispatch  = useDispatch();

    const [ load, setLoad ] = useState(false);

    
    getAuth();
    
    const { data } = useData({
        target: "users",
        conditions: [
            where("User ID", "==", getAuth()?.currentUser?.uid)
        ],
        order: ["Role", "asc"],
    });
    
    const user = safeGet(data, ["0", "0"], {});
    
    const [ inputs, setInputs ] = useState({
        name: ``,
        email: ``,
        number: ``,
        role: ``,
        iniPic: ``,
    });

    useEffect( () => {
        if(!checkInputsOnObj(inputs, ["name", "role", "number"]))
        setInputs({
            name: `${safeGet(user, ["First Name"], "")} ${safeGet(user, ["Last Name"], "")}`,
            // email: `${safeGet(user, ["Email Address"])}`,
            number: `${safeGet(user, ["Mobile Number"], "")}`,
            role: `${safeGet(user, ["Role"], "")}`,
            iniPic: safeGet(user, ["Pic"], safeGet(getAuth(), ["currentUser", "photoURL"], "/images/user.png")),
        });

    }, [data]);

    // console.log(user);


    const handleUpdate = () => {
        setLoad(true);

        if(!checkInputsOnObj(inputs, ["name", "role", "number"])) {
            errorAlert({
                title: "Empty Inputs",
                text: "Please check your inputs and try again",
            });

            setLoad(false);

            return false;


        }

        updateDetails(inputs).then( result => {
            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Update Successful"
                }).then(() => {
                    dispatch(login({
                        name: inputs.name,
                        loggedIn: true,
                        role: inputs.role,
                        plan: user.Plan,
                    }));

                    location.reload();
                });
            }
            else {
                errorAlert({
                    title: "System Busy",
                    text: "System is currently unavailable, please try again later",
                });
            }

            setLoad(false);
        })
        
    }


    return (
        <section className="pb-12">
            <Loading load={load} />
            <div className="flex items-center gap-1">
                <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                <h1 className="orb text-lg mb-1">Settings</h1>
            </div>


            <ImageSelect initImageUrl={inputs.iniPic} initImage={inputs.pic} callback={(file) => setInputs({...inputs, pic: file})} containerClass="h-[190px] w-[190px] rounded-full mx-auto" />
            <div className="text-center text-xl font-semibold orb mt-3">{`${safeGet(user, ["First Name"], "")} ${safeGet(user, ["Last Name"], "")}`}</div>
            <div className="text-center text-lg mb-3">{`${safeGet(user, ["Email Address"], "")}`}</div>

            <div className="max-w-[500px] mx-auto shadow bg-white rounded border p-5">
                <h1 className="orb mb-6">Your Details</h1>

                <div className="">
                    <Input 
                        name="name"
                        placeholder="E.g David Nkrumah"
                        label="Full Name"
                        startAdornment={<InputAdornment position="start"> <i className="bi bi-person"></i></InputAdornment>}
                        type="text"
                        size="small"
                        value={inputs?.name}
                        onChange={(e) => setInputs({...inputs, name: e.target.value})}
                    />
                </div>

                <div className="">
                    <Input 
                        name="email"
                        placeholder="E.g 0500000099"
                        label="Phone Number"
                        startAdornment={<InputAdornment position="start"> <i className="bi bi-phone"></i></InputAdornment>}
                        type="text"
                        size="small"
                        value={inputs?.number}
                        onChange={(e) => setInputs({...inputs, number: e.target.value})}
                    />
                </div>

                <div className="">
                    <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                        <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={inputs?.role}
                            label="How do you charge?"
                            startAdornment={<InputAdornment position="start"><i className="bi bi-gear"></i></InputAdornment>}
                            onChange={(e) => setInputs({...inputs, role: e.target.value})}
                            size="small"
                        >
                            <MenuItem value={"Regular Customer"}>Requester Account</MenuItem>
                            <MenuItem value={"Professional Handyman"}>Service Provider Account</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {inputs?.role == "Professional Handyman" && 
                    <Btn.SmallBtn onClick={() => navigate('/admin/upgrade')}>Upgrade Plan</Btn.SmallBtn>
                }

            </div>

            <div className=" grid grid-cols-1 items-center gap-1 absolute bottom-0 left-0 w-full bg-white p-2 z-20">
                <div className="">
                    <Btn.SmallBtn onClick={handleUpdate} fullWidth>
                        <span>Update Details</span>
                        <i className="bi bi-person text-xl mx-2 "></i>
                    </Btn.SmallBtn>
                </div>
            </div>

        </section>
    );
}