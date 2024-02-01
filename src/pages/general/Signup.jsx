import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "components/";
import { newUser } from "functions/creates/Users";
import { errorAlert } from "../../functions/utils/Alert";
import AccountType from "./signup/AccountType";
import SelectPlan  from "./signup/SelectPlan";
import UserDetails from "./signup/UserDetails";

import { useDispatch } from "react-redux";
import { login } from "../../config/general";


export default function() {

    const [ inDisplay, setInDisplay ] = useState("user_details");

    const [ userDetails, setUserDetails ] = useState({});

    const [ accountType, setAccountType ] = useState("");

    const [ plan, setPlan ] = useState("noplan");

    const [ reference, setReference ] = useState("free");
    
    const [ load, setLoad ] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleUserDetails = (userDetails) => {

        setUserDetails(userDetails);
        
        setInDisplay("account_type");
    }

    const handleAccountType = (type) => {
        setAccountType(type);

        if(type !== "Regular Customer") {

            setPlan(plan);
            setReference(reference);
            createUser(plan, reference, type);
            // setInDisplay("select_plan");
        }
    
        else createUser(plan, reference, type);
    }

    const handleSelectedPlan = (plan, reference) => {
        setPlan(plan);
        setReference(reference);
        createUser(plan, reference);
    }

    const createUser = (userPlan=plan, userReference=reference, type=accountType) => {
        setLoad(true);
        newUser({...userDetails, plan:typeof(userPlan.id) !== "undefined" ? userPlan.id : "noplan", reference: userReference, accountType: type}).then((result) => {
            setLoad(false);

            if(result) {
                dispatch(login({name: userDetails.name, loggedIn: true, role: type, plan: userPlan}));
                navigate("/admin");
            }
            else {
                errorAlert({
                    title: "System Busy",
                    text: "Unable to create account at the moment, please contact pedwuma for further assistance",
                });
            }
        });
    }


    return (
        <form className=" py-10 " >

            <Loading load={load} />
    
            {inDisplay == "user_details" && 
            
                <div data-aos="fade-in" className={` ${accountType}`}>
                    <UserDetails userDetails={userDetails} callback={handleUserDetails}  />
                </div>
            }

            {inDisplay == "account_type" &&
            
                <div data-aos="fade-in" className={`my-6`}>
                    <AccountType callback={handleAccountType} prevCallback={() => setInDisplay("user_details")} />
                </div>
            }

            {inDisplay == "select_plan" && 
            
                <div data-aos="fade-in" className={`my-6`}>
                    <SelectPlan email={userDetails.email} callback={handleSelectedPlan} prevCallback={() => setInDisplay("account_type")}/>
                </div>
            }

        </form>
    );
}
