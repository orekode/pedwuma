import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormControl, OutlinedInput, InputLabel, InputAdornment, Skeleton } from "@mui/material";
import { Btn, Loading, Inputs } from "components/";
import { userExists, useData } from "functions/reads/General";
import { confirmPayment } from "functions/creates/Plans";
import { errorAlert } from "functions/utils/Alert";
import { PaystackConsumer } from 'react-paystack';
import {  orderBy } from "firebase/firestore";


export default function ({callback = () => {}, prevCallback = () => {}, email}) {


    const { data , isLoading, isError } = useData({target: "Plans", conditions: [orderBy("Amount", "asc")]});
    
    const [ load, setLoad ] = useState(false);
    
    const [ plan, setPlan ] = useState("");

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        currency: "GHS",
        publicKey: 'pk_test_3e5e2bf632f13d0d454ae88da3761e4246b180bb',
    };


    
    // you can call this function anything
    const handleSuccess = (reference, plan) => {
        setLoad(true);
        confirmPayment(reference.reference).then( result => {

            setLoad(false);

            if(result)
            callback(plan, reference.reference);

            else 
                errorAlert({
                    title: "Verify Payment",
                    text: "please contact pedwuma on +233508809987 to verify your payment and finish creating your account"
                });

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
            <Loading load={load} />
            <h1 className="font-semibold orb text-3xl text-center py-5 ">Choose A Plan</h1>

            <div className="flex flex-wrap items-center justify-center gap-5 my-6 mt-12">
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


                {data && data[0]?.map((item, index) => 
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

            </div>

            <div className="flex items-center justify-between gap-3 p-2 max-w-[1080px] mx-auto">
                <Btn.SmallBtn onClick={() => prevCallback()}>Back</Btn.SmallBtn>
            </div>
        </>
    );
}