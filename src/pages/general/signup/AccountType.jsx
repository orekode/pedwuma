import { useState } from "react";
import { Btn } from "components/";
import { errorAlert } from "functions/utils/Alert";



export default function ({callback = () => {}, prevCallback = () => {}}) {

    const [ accountType, setAccountType ] = useState("");

    const handleSelect = (type) => {
        setAccountType(type); 

        if(type == "") {
            errorAlert({
                title: "No Account Chosen",
                text: "Please choose an account be clicking on the account of your choice",
            });

            return false;
        }

        callback(type);
    }

    return (
        <>
            <h1 className="font-semibold orb text-3xl text-center py-5 mb-6">Choose An Account</h1>

            <div className="flex flex-wrap items-center justify-center gap-5 my-6 mt-12">

                <div onClick={() => {handleSelect("Regular Customer");}} className={`${ accountType == "Regular Customer" ? "border-blue-600" : "border-transparent"} w-[350px] max-[400px]:w-[300px] rounded shadow hover:shadow-lg border-2 hover:shadow-blue-200`}>
                    <img src="/images/requester.avif" alt="" className="h-[330px] max-[400px]:h-[280px] w-full object-cover" />
                    <div className="orb text-xl p-5 text-center">Requester Account</div>
                </div>

                <div onClick={() => {handleSelect("Professional Handyman");}} className={`${ accountType == "Professional Handyman" ? "border-blue-600" : "border-transparent"} w-[350px] max-[400px]:w-[300px] rounded shadow hover:shadow-lg border-2 hover:shadow-blue-200`}>
                    <img src="/images/worker.jpg" alt="" className="h-[330px] max-[400px]:h-[280px] w-full object-cover" />
                    <div className="orb text-xl p-5 text-center">Worker Account</div>
                </div>

            </div>

            <div className="flex items-center justify-between gap-3 p-2 max-w-[730px] mx-auto">
                <Btn.SmallBtn onClick={() => prevCallback()}>Back</Btn.SmallBtn>
            </div>
        </>
    );
}