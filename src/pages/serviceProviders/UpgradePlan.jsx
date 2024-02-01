import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormControl, OutlinedInput, InputLabel, InputAdornment, Skeleton } from "@mui/material";
import { Btn, Loading, Inputs, EmptyBox } from "components/";
import { userExists, useData, getDocById } from "functions/reads/General";
import { confirmPayment } from "functions/creates/Plans";
import { upgradePlan } from "functions/edits/Users";
import { errorAlert } from "functions/utils/Alert";
import { safeGet } from "functions/utils/Fixers";
import { PaystackConsumer } from 'react-paystack';
import {  orderBy, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ({callback = () => {}, prevCallback = () => {}, email}) {


    const { data , isLoading, isError } = useData({ target: "Plans", order: ["Amount", "asc"] });

    getAuth();
    
    const userdata = useData({
        target: "users",
        conditions: [
            where("User ID", "==", getAuth()?.currentUser?.uid)
        ],
        callback: async (user) => {
            console.log("i got executed");
            user.plan = await getDocById("Plans", user.Plan);
            console.log("i got executed again", user.plan);

            return user;
        }
    });


    const user = safeGet(userdata, ["data", "0", "0"], {});

    console.log(user, "user");
    
    const [ load, setLoad ] = useState(false);
    
    const [ plan, setPlan ] = useState("");

    const config = {
        reference: (new Date()).getTime().toString(),
        email: safeGet(user, "Email Address", "Upgrade"),
        currency: "GHS",
        publicKey: 'pk_test_3e5e2bf632f13d0d454ae88da3761e4246b180bb',
    };

    const navigate = useNavigate();
    
    // you can call this function anything
    const handleSuccess = (reference, plan) => {
        setLoad(true);
        confirmPayment(reference.reference).then( result => {

            if(result) {

                upgradePlan(plan.id, reference.reference).then( result => {

                    setLoad(false);

                    if(result) {
                        errorAlert({
                            icon: "success",
                            title: "Upgrade Successful",
                        }).then( () => location.reload());
                    }
                    else {
                        errorAlert({
                            icon: "warning",
                            title: "System Busy",
                            text: "Please contact PEDWUMA for further assistance, thank you!"
                        });
                    }

                });

            }

            else  {
                setLoad(false);

                errorAlert({
                    title: "Verify Payment",
                    text: "please contact pedwuma on +233508809987 to verify your payment and finish creating your account"
                });
            }

        });
    };
  
    // you can call this function anything
    const handleClose = () => {
      // implementation for  whatever you want to do when the Paystack dialog closed.
      setPlan("free");
    }


    const componentProps = {
        ...config,
        text: 'Paystack Button Implementation',
        
        onClose: handleClose
    };


    const handelChoose = (initializePayment, item) => {
        setPlan(item);
        initializePayment( (reference) => {handleSuccess(reference, item)}, handleClose);
    }

    return (
        <>
            <div className="flex items-center gap-1">
                <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                <h1 className="orb text-lg mb-1">Settings</h1>
            </div>

            <Loading load={load} />
            {((data && data[0]?.filter(item => item?.Amount > user?.plan?.Amount).length > 0) || !data) && 
                <h1 className="font-semibold orb text-3xl text-center py-5 ">Choose A Plan</h1>
            }

            <div className="flex flex-wrap items-center justify-center gap-5 my-6 mt-6">
                {!data && Array.from({length: 3}, (item, index) => 
                    <div key={index} className={`${index == 1 ? 'scale-100 shadow-xl ' : 'shadow-xs scale-95'} w-[350px] max-[400px]:w-[300px] p-6 rounded border hover:shadow-xl border hover:shadow-gray-200 hover:shadow-opacity-100`}>
                        <div className="mb-3">
                            <div className="bg-gray-100 text-gray-600 w-max py-1 px-2 font-semibold rounded text-sm">
                                <Skeleton />
                            </div>
                            <div className="price orb text-3xl pt-3 font-bold ">
                                <Skeleton />
                            </div>
                        </div>

                        <div className="features py-6 border-t">
                            {Array.from({length: 4}, (item, index) => 
                            
                                <div className="feature gap-2 py-2 text-gray-700">
                                    <Skeleton />
                                </div>
                            )}
                        </div>

                        <Skeleton />
                    </div>
                )}


                {data && data[0]?.filter(item => item?.Amount > user?.plan?.Amount).map((item, index) => 
                    <div key={index} className={`${index == 1 ? 'scale-100 shadow-xl ' : 'shadow-xs scale-95'} w-[350px] max-[400px]:w-[300px] p-6 rounded border hover:shadow-xl border hover:shadow-gray-200 hover:shadow-opacity-100`}>
                        <div className="mb-3">
                            <div className="bg-gray-100 text-gray-600 w-max py-1 px-2 font-semibold rounded text-sm">{item.Name}</div>
                            <div className="price orb text-3xl pt-3 font-bold ">{item.Amount > 0 ? `Ghc ${item.Amount}` : `Free`}</div>
                        </div>

                        <div className="features py-6 border-t">
                            {item?.Features.map((item, index) => 
                            
                                <div key={index} className="feature flex gap-2 py-2 text-gray-700">
                                    <i className="bi-check2-circle text-blue-600"></i>
                                    <span className="font-semibold text-sm">{item}</span>
                                </div>
                            )}
                        </div>

                        {item.Amount > 0 ? 
                            <PaystackConsumer {...componentProps} onSuccess={ (reference) => handleSuccess(reference, item) } amount={item.Amount * 100} >
                                {({initializePayment}) =><Btn.SmallBtn onClick={() => { handelChoose(initializePayment, item) }} fullWidth>Choose Plan</Btn.SmallBtn>}
                            </PaystackConsumer>
                            :
                            <Link to="/admin">
                                <Btn.SmallBtn onClick={() => {callback(item, "free")}} fullWidth>Choose Plan</Btn.SmallBtn>
                            </Link>
                        }

                    </div>
                )}

                {(data && data[0]?.filter(item => item?.Amount > user?.plan?.Amount).length <= 0) && 
                    <EmptyBox image={"/images/best.avif"} load={true} title="Congratulations" text="You are already on the best plan pedwuma has to offer!" />
                }

            </div>
        </>
    );
}