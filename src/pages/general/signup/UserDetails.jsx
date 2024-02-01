import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormControl, OutlinedInput, InputLabel, InputAdornment } from "@mui/material";
import { Btn, Loading, Inputs } from "components/";
import { userExists } from "functions/reads/General";
import { errorAlert } from "functions/utils/Alert";


const defaultInputs = [
    {
        label: 'Full Name',
        name: 'name',
        placeholder: 'e.g Kwesi Arthur',
        icon: 'person',
        error: false,
        helperText: '',
    },
    {
        label: 'Email',
        name: 'email',
        placeholder: 'e.g pedwuma@email.com',
        icon: 'envelope',
        error: false,
        helperText: '',
    },
    {
        label: 'Phone',
        name: 'phone',
        placeholder: 'e.g 0508888888',
        icon: 'phone',
        error: false,
        helperText: '',
    },
    {
        label: 'Password',
        name: 'password',
        placeholder: 'e.g p@@5M0rD',
        icon: 'shield',
        error: false,
        helperText: '',
    },
    {
        label: 'Confirm Password',
        name: 'confirm_password',
        placeholder: 'e.g p@@5M0rD',
        icon: 'shield-check',
        error: false,
        helperText: '',
    },
]

export default function ({callback = () => {}, prevCallback = () => {}, userDetails={}, inputList = defaultInputs, signUp=true, title="Sign Up", desc="Provide the details bellow to create your account"}) {

    const [ userInputs, setUserInputs ] = useState(userDetails);

    const [ load, setLoad ] = useState(false);

    const navigate = useNavigate();
    

    const [ inputs, setInputs ] = useState(inputList);

    const handleSubmit =  () => {

        setLoad(true);

        if(!checkInputs()) {

            setLoad(false);

            return false;
        }

        let phone = userInputs?.phone?.replaceAll(" ", "")?.replaceAll("+233", "0");


    
        userExists(userInputs.email.replaceAll(" ", ""), typeof(phone) == "undefined" ? "0" : phone ).then( exists => {
            if(exists) {    
                errorAlert({
                    title: 'This Account Exists',
                    text: 'click the button bellow to login',
                    confirmButtonText: 'Log In',
                    showCancelButton: true,
                    cancelButtonText: 'cancel',
                }).then((result) => {
                    if(result.isConfirmed) {
                        navigate('/login');
                    }
                });
    
                setLoad(false);
    
                return false;
            }

            setLoad(false);
            callback(userInputs);
        });
        
    }
    
    const checkInputs = () => {
        const inputFields = Object.keys(userInputs);
        let   inputValues = Object.values(userInputs);

        inputValues = inputValues.filter( item => item.replaceAll(" ", "").length > 0 );

        if(inputFields.length < inputs.length || inputValues.length < inputs.length) {
            errorAlert({
                title: 'Empty Inputs',
                text: 'Please provide all inputs and try again',
            }).then(() => {
                let newInputs = [...inputs];

                newInputs.forEach( (input, index) => {
                    if(inputFields.indexOf(input.name) < 0 || userInputs[input.name].replaceAll(" ", "").length <= 0) {
                        newInputs[index].error = true;
                        newInputs[index].helperText = "Please provide this input";
                    }
                });

                setInputs([...newInputs])
            });

            return false;
        }

        if(typeof(userInputs['phone']) !== "undefined" && userInputs['phone']?.replaceAll(" ", "")?.replaceAll("+233", "0")?.length != 10) {
            let newInputs = inputs.map( item => {
                if(item?.name == "phone") {
                    return {...item, error: true, helperText: "Phone-Number should be 10 digits"}
                }

                return item;
            })

            setInputs(newInputs);

            return false;
        }

        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Use the test() method to check if the email matches the pattern
        if(!emailPattern.test(userInputs.email)) {
            let newInputs = inputs.map( item => {
                if(item?.name == "email") {
                    return {...item, error: true, helperText: "Invalid email address"}
                }

                return item;
            })

            setInputs(newInputs);

            return false;
        }

        return true;
    }

    const inputOnChange = (e, item) => {

        setUserInputs({...userInputs, [item.name]: e.target.value});

        setInputs(inputs.map(input => {

            if(input.name == item.name) {
                return {...input, error: false, helperText: ''}
            }

            return input;

        }));
    }

    return (
        <div className="form-box max-w-[500px] max-[600px]:p-5 mx-auto">
            <h1 className=" text-3xl orb mb-1">{title}</h1>
            <p  className=" mb-6 text-sm text-gray-500 max-w-[320px]">{desc}</p>

            {inputs.map((item, index) => 
            
                item?.name?.indexOf("password") < 0 ?
                    <FormControl key={index} sx={{marginBottom: "1.5rem", width: "100%"}}>
                        <InputLabel htmlFor="outlined-adornment-amount">{item.label}</InputLabel>
                        <OutlinedInput

                            error={item.error}

                            id="outlined-adornment-amount"

                            startAdornment={<InputAdornment position="start"><i className={`bi bi-${item.icon}`}></i></InputAdornment>}

                            label={item.label}

                            name={item.name}

                            placeholder={item.placeholder}

                            onChange={(e) => inputOnChange(e, item)}

                            value={userInputs[item.name]}

                            fullWidth

                            size="small"

                        />
                        <div className="text-xs text-red-500">{item?.helperText}</div>
                    </FormControl>
                :
                    <Inputs.Password inputOnChange={inputOnChange} userInputs={userInputs} item={item} />

            )}

            {signUp == true && 
                <>
                    <Btn.SmallBtn onClick={handleSubmit} styles={{padding: ".25rem 0", height: '42px', fontSize: "0.85rem", width: "100%"}}>Sign Up</Btn.SmallBtn>

                    <div className="py-3 text-sm text-gray-800 font-semibold text-center">Already have an account? <Link to={'/login'} className="text-blue-400 underline">Log In</Link></div>
                </>
            }

            {
                signUp !== true &&
                
                <div className="grid gap-2">
                    <Btn.SmallBtn onClick={handleSubmit} styles={{padding: ".25rem 0", height: '42px', fontSize: "0.85rem", width: "100%"}}>{signUp}</Btn.SmallBtn>
                    <button onClick={prevCallback} type="button" className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-600 active:bg-blue-900 hover:text-white rounded py-1.5 px-2 uppercase text-sm whitespace-nowrap">Back</button>
                </div>

            }


            <Loading load={load} />
        </div>
    );
}