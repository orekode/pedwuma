import { useState } from "react";
import { Btn, Loading } from "components/";
import UserDetails from "./UserDetails";

import { changeEmail } from "functions/edits/Users";
import { errorAlert } from "functions/utils/Alert";
import { PasswordPrompt } from "components";


export default function ({ email }) {

    const [ display, setDisplay ] = useState("confirm");
    const [ load, setLoad ] = useState(false);
    const [ showPrompt, setShowPrompt ] = useState(false);
    const [ password, setPassword ] = useState("");
    const [ userDetails, setUserDetails ] = useState({});


    const handleChange = (userdetails) => {

        setUserDetails(userdetails);

        if(password.replaceAll(" ", "") == "") {
            setShowPrompt(true);
            return false;
        }

        setLoad(true);
        changeEmail(userdetails.email, password, email).then( result => {
            if(!result) {
                errorAlert({
                    title: "System Busy",
                    text: "System is currently unavailable, please try again later"
                });
            } else setDisplay("confirm");
            setLoad(false);
        })
    }

    const promptCallback = (password) => {
        setPassword(password);
        handleChange(userDetails);
        setShowPrompt(false);
    }

    return (
        <div className="p-5">

            <Loading load={load} />
            <PasswordPrompt open={showPrompt} callback={promptCallback}/>
            <div className="flex mx-auto min-h-[40vh] max-w-[400px] flex-col items-center justify-center ">
                <div className="h-[200px] w-[200px]">
                    <img src="/images/email.jpg" className="object-cover h-full w-full" />
                </div>

                {display == "confirm" &&
                    <>
                        <h1 className="orb text-2xl mb-3 font-semibold text-center">Email Verification</h1>

                        <p className=" mb-5 text-sm text-center">
                            Please open your email and click the link we sent to {email} to activate your account. After activation, log in to start using your account. Thank you!
                        </p>

                        <div className="grid gap-2 grid-col-1 w-[200px]">
                            <Btn.SmallBtn>Log In</Btn.SmallBtn>
                            <button onClick={() => setDisplay("email")} type="button" className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-600 active:bg-blue-900 hover:text-white rounded py-1.5 px-2 uppercase text-sm whitespace-nowrap">Change Email Address</button>
                        </div>
                    </>
                }

                {display == "email" && 
                    <div data-aos="fade-in">

                        <UserDetails title="Change Email Address" desc="Please type in your email address bellow" signUp="Change Email" callback={handleChange} prevCallback={() => setDisplay("confirm")} inputList={[
                            {
                                label: 'Email',
                                name: 'email',
                                placeholder: 'e.g pedwuma@email.com',
                                icon: 'envelope',
                                error: false,
                                helperText: '',
                            },
                        ]} />

                    </div>
                }
            </div>

        </div>
    );
}