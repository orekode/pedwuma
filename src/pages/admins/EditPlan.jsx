import { useState, useEffect }     from "react";
import { useNavigate, useParams }  from "react-router-dom";
import { QueryClient }             from "react-query";

import { Btn, Loading   }          from "components";
import { Input }                   from "components/Input";

import { errorAlert }   from "functions/utils/Alert";
import { editPlan }     from "functions/edits/Plans";
import { deleteById }   from "functions/deletes/General";
import { getPlan }      from "functions/reads/Plans";

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'


export default function () {

    const { id } = useParams();

    const navigate = useNavigate();

    const [ features, setFeatures ] = useState([]);

    const [ inputs, setInputs ]     = useState({rating: -1}); //specify that the select is a controlled input

    const [ load, setLoad ]         = useState(true);

    const queryClient = new QueryClient();


    useEffect(() => {

        getPlan(id).then( result => {
            if(!result) {
                errorAlert({
                    title: "Plan Unavailable",
                    text: "System is unable to display this plan at the moment, please try again later"
                });

                navigate("/admin/plans");

                return false;
            }

            setInputs({
                name: result.Name,
                amount: result.Amount,
                jobs: result.Jobs,
                applications: result.Applications,
                portfolios: result.Portfolios,
                rating: result["Default Rating"],
            })

            setFeatures(result.Features);
            
            setLoad(false);
        })


    }, []);


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

        editPlan({...inputs, id, features}).then( result => {

            if(result == "success") {
                errorAlert({
                    icon: 'success',
                    title: 'Plan Updated Successfully'
                });
                queryClient.invalidateQueries();
                
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

    const handleDelete = () => {

        
        deleteById("Plans", id, setLoad).then( result => {
            queryClient.invalidateQueries();
            if(result) navigate('/admin/plans');
        });

    }

    return (
        <div>
            <Loading load={load} />
            
            <Btn.SmallBtn onClick={() => navigate(-1)} >Back</Btn.SmallBtn>

            <div className="mx-auto max-w-[500px]">
                <div className="flex items-center justify-between">

                    <h1 className="orb text-xl mb-3">New Plan</h1>


                </div>
                <div className="w-full bg-white rounded shadow-lg p-5">
                    <Input 
                        name="name"
                        placeholder="What would you like to call this plan"
                        label="Plan Name"
                        size="small"
                        onChange={(e) => setInputs({...inputs, name: e.target.value})}
                        value={inputs.name}
                    />

                    <Input 
                        name="amount"
                        placeholder="How much are you charging for this plan"
                        label="Amount"
                        type="number"
                        size="small"
                        onChange={(e) => setInputs({...inputs, amount: e.target.value})}
                        value={inputs.amount}

                    />

                    <Input 
                        name="jobs"
                        placeholder="How many jobs per week will this plan allow"
                        label="Jobs"
                        type="number"
                        size="small"
                        onChange={(e) => setInputs({...inputs, jobs: e.target.value})}
                        value={inputs.jobs}
                    />

                    <Input 
                        name="applictations"
                        placeholder="How many applications per day will this plan allow"
                        label="Applications"
                        type="number"
                        size="small"
                        onChange={(e) => setInputs({...inputs, applications: e.target.value})}
                        value={inputs.applications}
                    />


                    <Input 
                        name="portfolios"
                        placeholder="How many portfolios will this plan allow"
                        label="Portfolios"
                        type="number"
                        size="small"
                        onChange={(e) => setInputs({...inputs, portfolios: e.target.value})}
                        value={inputs.portfolios}

                    />

                    <FormControl fullWidth sx={{marginBottom: "1.5rem"}}>
                        <InputLabel id="demo-simple-select-label" size="small">Default Rating</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={-1}
                            value={inputs?.rating}
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

                    <div className="flex items-center gap-2">
                        <Btn.SmallBtn onClick={handleSubmit} styles={{wi40dth: "calc(100% - 35px)"}} fullWidth>Update Plan</Btn.SmallBtn>
                        <i onClick={handleDelete} className="bi bi-trash text-lg bg-red-500 hover:bg-red-600 active:bg-red-700 w-[35px] h-[35px] rounded-md flex items-center justify-center text-white" />    
                    </div>
                </div>
            </div>
        </div>
    );
}