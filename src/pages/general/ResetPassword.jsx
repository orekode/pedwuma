import { useState } from "react";
import { Btn, Loading, Inputs } from "components/";

import { resetPassword } from "functions/edits/Users";
import { errorAlert } from "functions/utils/Alert";
import { useNavigate } from "react-router-dom";


export default function ({ email }) {

    const [ input, setInput ] = useState("");
    const [ load, setLoad ] = useState(false);

    const navigate = useNavigate();

    const handleReset = () => {
        setLoad(true);

        if(input.replaceAll(" ", "") == ""){
            errorAlert({
                title: "No Email Provided",
                text: "Please type your email address in the input-box and try again"
            });
            setLoad(false);
            return false;
        }

        resetPassword(input).then( result => {
            if(result) {
                errorAlert({
                    icon: 'success',
                    title: "Reset Link Sent To Your Email Successfully",
                });
                setLoad(false);
                navigate("/login");
                return true;
            }

            errorAlert({
                title: "System Busy",
                text: "Please try again later",
            });
            setLoad(false);
            return false;
        })
    }

    return (
        <div className="p-5">
            <Loading load={load} />
            <div className="flex mx-auto min-h-[50vh] max-w-[400px] flex-col items-center justify-center ">
                <div className="h-[200px] w-[200px]">
                    <img src="/images/email.jpg" className="object-cover h-full w-full" />
                </div>
            
                <h1 className="orb text-2xl mb-3 font-semibold text-center">Password Reset</h1>

                <p className=" mb-5 text-sm text-center">
                    Please provide your email address in the input filed and click the button bellow to recieve an email with your password reset link 
                </p>

                <Inputs.Password2 onChange={(e) => setInput(e.target.value)} icon="envelope" placeholder="E.g kwamejohn@gmail.com" type="email" endAdornment={<></>} label="Email" />

                <div className="grid gap-2 grid-col-1 w-[200px]">
                    <Btn.SmallBtn onClick={handleReset}>Send Reset Link</Btn.SmallBtn>
                </div>
            
            </div>

        </div>
    );
}