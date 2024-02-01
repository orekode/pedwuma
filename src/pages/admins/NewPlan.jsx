import { useState }     from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient } from "react-query";
import { Btn, Loading   }        from "components";
import { Input }        from "components/Input";

import { errorAlert } from "functions/utils/Alert";
import { newPlan } from "functions/creates/Plans";
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'


export default function () {

    const [ features, setFeatures ] = useState([]);

    const [ inputs, setInputs ]     = useState({});

    const [ load, setLoad ]         = useState(false);

    const navigate = useNavigate();

    const queryClient = new QueryClient();


    const handleFeature = () => {


        if(features.indexOf(inputs.feature) >= 0 || inputs.feature.replaceAll(" ", "") == "") return false;


        setFeatures([inputs.feature, ...features,]);
        setInputs({...inputs, feature: ""});
    }

    const removeFeature = (feature) => {
        setFeatures(features.filter((item) => item !== feature));
    }

    const handleSubmit = () => {

        setLoad(true);

        if(!checkInputs()) {
            setLoad(false);
            return false;
        } 

        newPlan({...inputs, features}).then( result => {

            if(result == "success") {
                errorAlert({
                    icon: 'success',
                    title: 'Plan Created Successfully'
                });
                
                queryClient.invalidateQueries();
                
                navigate('/admin/plans');
            }
            else if (result == "exists") {
                errorAlert({
                    title: 'Plan Exists',
                    text: `A plan with the name ${inputs.name} already exists, please use a different name and try again.`,
                });
            }

            else {
                errorAlert({
                    title: 'System Busy',
                    text: 'Please try again later'
                });
            }

            setLoad(false);
        });

    }

    const checkInputs = () => {
        const values = Object.values(inputs);
        const keys   = Object.keys(inputs);

        //prompt for empty inputs
        const empty_inputs = 
            () => errorAlert({
                title: 'Empty Inputs',
                text: 'Please check all inputs and try again'
            });


        if(values.length < 5) {
            empty_inputs();
            return false;
        }

        for(let i = 0; i < values.length; i++) {
            if(typeof(values[i]) == "string" && values[i].replaceAll(" ", "") == "" && keys[i] !== "feature" ) {
                empty_inputs();
                return false;
            }
        }

        if (features.length <= 0) {
            errorAlert({
                title: 'No Plan Features',
                text: 'Please provide this plan with some features and try again'
            });

            return false;
        }


        return true;
    }

    return (
        <div>
            <Loading load={load} />
            

            <div className="flex items-center mb-3 gap-3">
                <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                
                <h1 className="orb text-xl">New Plan</h1>
            </div>

            <div className="grid grid-cols-2 max-[730px]:grid-cols-1 gap-3">


                <div className="">

                    <div className="w-full bg-white rounded shadow-lg p-5">
                        <Input 
                            name="name"
                            placeholder="What would you like to call this plan"
                            label="Plan Name"
                            size="small"
                            onChange={(e) => setInputs({...inputs, name: e.target.value})}
                        />

                        <Input 
                            name="amount"
                            placeholder="How much are you charging for this plan"
                            label="Amount"
                            type="number"
                            size="small"
                            onChange={(e) => setInputs({...inputs, amount: e.target.value})}

                        />

                        <Input 
                            name="jobs"
                            placeholder="How many jobs per week will this plan allow"
                            label="Jobs"
                            type="number"
                            size="small"
                            onChange={(e) => setInputs({...inputs, jobs: e.target.value})}
                        />

                        <Input 
                            name="applictations"
                            placeholder="How many applications per day will this plan allow"
                            label="Applications"
                            type="number"
                            size="small"
                            onChange={(e) => setInputs({...inputs, applications: e.target.value})}
                        />


                        <Input 
                            name="portfolios"
                            placeholder="How many portfolios will this plan allow"
                            label="Portfolios"
                            type="number"
                            size="small"
                            onChange={(e) => setInputs({...inputs, portfolios: e.target.value})}
                        />

                        <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                            <InputLabel id="demo-simple-select-label">Default Rating</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={-1}
                                label="Default Rating"
                                size="small"
                                onChange={(e) => setInputs({...inputs, rating: e.target.value})}
                            >
                                <MenuItem value={-1} disabled>Select a default rating</MenuItem>
                                <MenuItem value={0}>No Star</MenuItem>
                                <MenuItem value={1}>1 Star</MenuItem>
                                <MenuItem value={2}>2 Stars</MenuItem>
                                <MenuItem value={3}>3 Stars</MenuItem>
                                <MenuItem value={4}>4 Stars</MenuItem>
                            </Select>
                        </FormControl>

                        <div className="max-[730px]:hidden">
                            <Btn.SmallBtn onClick={handleSubmit} fullWidth>Create Plan</Btn.SmallBtn>
                        </div>
                    </div>
                </div>

                <div className="">

                    <div className="w-full bg-white rounded shadow-lg p-5">

                        <div className="text-xs leading-tight mb-6 text-gray-700">Please input the plan's bullet points and use the plus button to separate each point.</div>

                        <div className="flex items-center gap-1">
                            <div className="grid grid-cols-1" style={{width: "calc(100% - 40px)"}}>
                                <Input 
                                    name="feature"
                                    placeholder="E.g 20 Job Applications / Day"
                                    label="Feature"
                                    size="small"
                                    containerStyle={{margin: 0}}
                                    value={inputs?.feature}
                                    onChange={(e) => setInputs({...inputs, feature: e.target.value})}
                                />
                            </div>

                            
                        
                            <i onClick={handleFeature} className="bi bi-plus text-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 w-[40px] h-[40px] rounded-md flex items-center justify-center text-white" />
                                
                        </div>

                        <div className="features mb-6">

                            {features.map( (item, index) => 
                                <div key={index} className="flex items-center gap-1 my-3 bg-gray-200 p-2 rounded-md ">
                                    <div className="grid grid-cols-1 text-sm" style={{width: "calc(100% - 30px)"}}>
                                        {item}
                                    </div>

                                    <i onClick={() => removeFeature(item)} className="bi bi-dash text-xl bg-red-500 hover:bg-red-600 active:bg-red-700 w-[30px] h-[30px] rounded-md flex items-center justify-center text-white" />    
                                </div>
                            )}
                        </div>

                        <div className="hidden max-[730px]:block">
                            <Btn.SmallBtn onClick={handleSubmit} fullWidth>Create Plan</Btn.SmallBtn>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}