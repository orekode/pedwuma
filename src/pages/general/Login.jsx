import { useState } from "react";

import { FormControl, OutlinedInput, InputLabel, InputAdornment } from "@mui/material";
import { Btn, Inputs, Loading } from "components/";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "functions/reads/Users";
import { useDispatch } from "react-redux";
import { login } from "../../config/general";

export default function() {

    const [ inputs, setInputs ] = useState({});
    const [ load, setLoad ] = useState(false);

    const dispatch  = useDispatch();

    const navigate = useNavigate();

    const handelLogin = () => {

        setLoad(true);

        if(!checkInputs()) {
            setLoad(false);
            return false;
        }

        logIn(inputs.email, inputs.password).then( result => {
            if(result) {
        
                dispatch(login({
                    name: result["First Name"] + result["Last Name"],
                    loggedIn: true,
                    role: result["Role"],
                    plan: result.plan,
                }));
                navigate("/admin");
            }

            setLoad(false);
        })

    }

    const checkInputs = () => {
        let   inputValues = Object.values(inputs);

        inputValues = inputValues.filter( item => item.replaceAll(" ", "").length > 0 );

        if(inputValues.length < 2) {
            errorAlert({
                title: 'Empty Inputs',
                text: 'Please provide all inputs and try again',
            });

            return false;
        }

        return true;
    }

    return (
        <form className="min-h-[90vh] flex items-center justify-center">

            <Loading load={load} />

            <div className="form-box max-w-[500px] max-[600px]:p-5 flex-grow">
                <h1 className=" text-3xl orb mb-1">Welcome Back</h1>
                <p  className=" mb-6 text-sm text-gray-500 max-w-[320px]">Enter Your email and password to log into your account</p>

                
                <FormControl sx={{marginBottom: "1.5rem", width: "100%"}}>
                    <InputLabel htmlFor="outlined-adornment-amount">Email</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start"><i className="bi bi-person-circle"></i></InputAdornment>}
                        label="Email"
                        name="email"
                        placeholder="E.g KwameOfori@gmail.com"
                        onChange={(e) => setInputs({...inputs, email: e.target.value})}
                        sx={{background: ""}}
                        fullWidth
                    />
                </FormControl>

                <Inputs.Password2 
                    onChange={(e) => setInputs({...inputs, password: e.target.value})} 
                    containerStyle={{marginBottom: "1.5rem", width: "100%"}} 
                    label="Password"
                    helperText={<Link className="text-blue-600 my-2 block font-semibold w-full text-right" to="/password/reset">Forgot password?</Link>}
                />
                    

                <Btn.SmallBtn onClick={handelLogin} styles={{padding: ".25rem 0", height: '42px', fontSize: "0.85rem", width: "100%"}}>Log In</Btn.SmallBtn>

                <div className="py-3 text-sm text-gray-800 font-semibold text-center">Dont have an account? <Link to={'/signup'} className="text-blue-400 underline">Sign Up</Link></div>

            </div>
        </form>
    );
}