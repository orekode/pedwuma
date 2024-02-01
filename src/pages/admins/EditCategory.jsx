import { useEffect, useState }                from "react";
import { useNavigate, useParams }             from "react-router-dom";
import { QueryClient }                        from "react-query";

import { Btn, Loading, ImageSelect   }        from "components";
import { Input }                              from "components/Input";

import { TextField, MenuItem, FormControl, Select } from '@mui/material'

import { errorAlert }                        from "functions/utils/Alert";
import { checkInputsOnObj, checkObjInArray } from "functions/utils/Fixers";
import { editCategory }                      from "functions/edits/Categories";
import { deleteById }                        from "functions/deletes/General";
import { categoryExists, useCategory }       from "functions/reads/Categories";
import { safeGet }                           from "functions/utils/Fixers";



export default function () {

    const { id } = useParams();

    const { data } = useCategory(id);

    const [ load, setLoad ]  = useState(false);

    const navigate = useNavigate();

    const queryClient = new QueryClient();

    const [ services, setServices ]  = useState([]);

    const [ inputs, setInputs ]      = useState({});

    useEffect( () => {

            setInputs({
                category: safeGet(data, ["Category Name"]),
                description: safeGet(data, ["Desc"]),
                imageUrl: safeGet(data, ["Pic"]),
            });
    
    
            setServices(safeGet(data, ["Services Provided"]) ? safeGet(data, ["Services Provided"])?.map(service => {
    
                return {
                    title: service.Title,
                    imageUrl: service.Pic
                }
        
            } ).reverse() : []);
    
    }, [data]);

    const empty_inputs = 
            () => errorAlert({
                title: 'Empty Inputs',
                text: 'Please check all inputs and try again'
            });

    const empty_image = 
            () => errorAlert({
                title: 'No Image',
                text: 'Please upload an image and try again'
            });

    const empty_exists = 
            () => errorAlert({
                title: 'Plan Exists',
                text: `A plan with the name ${inputs.category} already exists, please use a different name and try again.`,
            });

    const handleSubmit = () => {

        setLoad(true);

        if(!checkInputs()) {
            setLoad(false);
            return false;
        } 

        editCategory({...inputs, services, id}).then( result => {

            if(result == "success") {
                errorAlert({
                    icon: 'success',
                    title: 'Category Updated Successfully'
                });
                
                queryClient.invalidateQueries();
                
                // navigate('/admin/categories');
            }
            else if (result == "exists") {
                empty_exists();
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

    const checkCategoryInputs = () => {

        if(!checkInputsOnObj(inputs, ["category", "description"])) {
            empty_inputs();
            return false;
        }

        return true;
    }

    const checkInputs = () => {
        if(!checkCategoryInputs()) return false;

        if(services.length <= 0) {
            errorAlert({
                title: "At Least One Service Is Needed",
                text: "please create a service for this category and try again"
            });

            return false;
        }

        return true;
    }

    const addService = () => {
        if(!checkInputsOnObj(inputs, ["service"])) {
            empty_inputs();
            return false;
        }

        if(!checkInputsOnObj(inputs, [["serviceImage", "name"]])) {
            empty_image();
            return false;
        }

        if(checkObjInArray(services, "title", inputs.service)) {

            errorAlert({
                title: "This Service Already Exists"
            });

            return false;
        }

        setServices([ {
            title: inputs.service,
            image: inputs.serviceImage, 
        }, ...services]);

        setInputs({ ...inputs, service: "", serviceImage: undefined});
    }

    const removeService = (service) => {
        setServices(services.filter((item) => item !== service));
    }


    const handleDelete = () => {
        
        deleteById("Category", id, setLoad).then( result => {
            queryClient.invalidateQueries();
            if(result) navigate('/admin/categories');
        });

    }

    return (
        <div>
            <Loading load={load || typeof(data) == "undefined"} />
            

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                    <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                    <h1 className="orb text-lg mb-1">Edit Category</h1>
                </div>

            </div>

            <div className="mx-auto grid grid-cols-2 gap-3 max-w-[2020px]">


                    <div data-aos="fade-in" className="">
                        <div className="w-full bg-white rounded shadow-lg p-5">

                            <div className="flex gap-3 mb-3">

                                <ImageSelect initImageUrl={inputs.imageUrl} initImage={inputs?.categoryImage} callback={(image) => setInputs({...inputs, categoryImage: image})} />

                                <div className="">

                                    <Input 
                                        name="name"
                                        placeholder="What would you like to call this plan"
                                        label="Category Name"
                                        size="small"
                                        value={typeof(inputs.category) == "undefined" ? "" : inputs.category}
                                        onChange={(e) => setInputs({...inputs, category: e.target.value})}
                                    />

                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Category Description"
                                        multiline
                                        rows={4}
                                        placeholder="A very short description"
                                        value={typeof(inputs.description) == "undefined" ? "" : inputs.description}
                                        onChange={(e) => setInputs({...inputs, description: e.target.value})}
                                        fullWidth
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                
                    <div data-aos="fade-in" className="">
                        <div className="w-full bg-white rounded shadow-lg p-5">
                            <div className="flex items-center mb-1 gap-1">
                                <h1 className="orb text-xl">Add Services</h1>
                            </div>

                            <div className="text-xs leading-tight mb-6 text-gray-700">Please provide an image, title and description to create this category .</div>


                            <div className="">
                                <div className="flex gap-3">

                                    <ImageSelect initImage={inputs?.serviceImage} callback={(image) => setInputs({...inputs, serviceImage: image})} text="Add Image" imageClass="text-2xl" containerClass="h-[100px] w-[100px]" />

                                    <div className="" style={{width: "calc(100% - 100px)"}}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Descriptive Title"
                                            multiline
                                            rows={3}
                                            placeholder="E.g A category titled 'Painting' can have services titled 'Furniture Painting' or 'Car Body Painting'"
                                            value={typeof(inputs.service) == "undefined" ? "" : inputs.service}
                                            onChange={(e) => setInputs({...inputs, service: e.target.value})}
                                            fullWidth
                                        />
                                    </div>

                                </div>

                                <div className="mt-3">
                                    <Btn.SmallBtn fullWidth onClick={addService} >Add Service</Btn.SmallBtn>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="services col-span-2 mt-6">
                        <h3 className="orb">Services</h3>

                        <div className="grid-box-fill gap-3" style={{"--width": "230px"}}>
                            {services.map( (item, index) => 
                                <div key={index} className="flex items-center gap-1 my-3 bg-gray-200 p-2 rounded-md relative">
                                    <div className="h-[85px] w-[85px] border rounded overflow-hidden">
                                        <img src={ typeof(item?.image) !== "undefined" ? URL.createObjectURL(item?.image) : item?.imageUrl} className="object-cover h-full w-full" />
                                    </div>
                                    <p className="text-sm mx-3" style={{width: "calc(100% - 85px)"}}>
                                        {item?.title}
                                    </p>
                                    <i onClick={() => removeService(item)} className="bi bi-dash text-xl bg-red-500 absolute top-0 right-0 hover:bg-red-600 active:bg-red-700 w-[30px] h-[30px] rounded-md flex items-center justify-center text-white" />    
                                </div>
                            )}
                        </div>
                    </div>
            </div>

            { services.length > 0 && 
                <div className=" flex justify-end items-center gap-1 absolute bottom-0 left-0 w-full bg-white p-2">
                    <div className="" style={{width: "calc(100% - 40px"}}>
                        <Btn.SmallBtn onClick={handleSubmit} fullWidth>Edit Category</Btn.SmallBtn>
                    </div>
                    <i onClick={handleDelete} className="bi bi-trash text-lg bg-red-500 hover:bg-red-600 active:bg-red-700 w-[35px] h-[35px] rounded-md flex items-center justify-center text-white" />    
                </div>
            }

        </div>
    );
}