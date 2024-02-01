import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Header, Btn, Cards, EmptyBox } from "components";

import { LocationSearch, ServiceSearch } from "../../components/BoxSearch";

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'

import { useData } from "../../functions/reads/General";
import { limit } from "firebase/firestore";
import { encrypt, safeGet } from "functions/utils/Fixers";

export default function() {

    const [ showMenu, setShowMenu ] = useState(false);

    const [ parameters, setParameters ] = useState({
        next: null,
        back: null,
        history: [null],
        index: 0,
    });

    const navigate = useNavigate();

    const { data } = useData({
        target: "Category",
        conditions: [ limit(50) ],
        order:["Category Name", "asc"],
        next: parameters.next,
    });

    const handleNext = () => {

        let oldHistory = [ ...parameters.history ];
        let oldIndex = parameters.index;
        let nextItem = safeGet(data, ["1"], null);


        if(oldHistory.indexOf(nextItem) < 0) {
            oldHistory = [...parameters.history, nextItem];
            oldIndex++;
        }
        
        setParameters({ ...parameters, history: oldHistory, index: oldIndex, next: nextItem });
        
    }

    const handleBack = () => {

        let oldHistory = [ ...parameters.history ];

        //if index is greater that the length of history list 
        //set to length of history list - 1
        //if index - 1 is less than 0 set to 0
        //else set to index - 1 to get previous element
        let nextIndex = parameters.index >= oldHistory.length ? oldHistory.length - 1 : parameters.index - 1 < 0 ? 0 : parameters.index - 1;

        if(oldHistory.length > 1 ) oldHistory.pop();

        setParameters({ ...parameters, next: parameters.history[nextIndex], history: [...oldHistory], index: nextIndex }); 
    }


    return (
        <>
            <div className="px-10 py-5 max-[1165px]:px-5">

                <h2 className="orb py-5 font-bold">Find a service</h2>

                <div className="gap-2 max-[850px]:hidden items-center grid grid-cols-4 rounded">
                    <div className="grid grid-cols-1 col-span-4 ">
                        <ServiceSearch callback={(title) => navigate(`/service/${title}`)} sx={{boxShadow: "0 0 1px #2222223c"}}/>
                    </div>
                </div>

                <div className="gap-2 hidden max-[850px]:grid max-[850px]:gap-4  items-center grid-cols-4 rounded">
                    <div className="grid grid-cols-1 col-span-4 ">
                        <ServiceSearch callback={(title) => navigate(`/service/${title}`)} sx={{boxShadow: "0 0 1px #2222223c"}} size="small" />
                    </div>
                </div>

            </div>

            <div className="px-10 max-[1165px]:px-5">
                <div className="grid-box-fill gap-3" style={{"--width": '300px'}}>
                    {data && data[0].map( (item, index) => 
                        <Cards.Description
                            key={index}

                            image={item["Pic"]}
                            title={item["Category Name"]}
                            // description={<div className="text-xs">{item["Desc"].slice(0, 100)}...</div>}
                            description={""}
                            topInfo=""
                            btnText="See Workers"
                            onBtnClick={() => {navigate(`/category/${item["Category Name"]}`)}}
                            className="w-[400px] h-[500px] max-[1165px]:w-[300px] max-[1165px]:h-[400px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative group"
                        />
                    )}

                    {!data && Array.from({length: 20}, (item, index) => 
                        <Cards.Loading
                            key={index}
                        />
                    )}

                </div>

                <EmptyBox load={typeof(data) != 'undefined' && safeGet(data, ["0"], []).length <= 0} title="No Services On This Page" text="Please check other pages or try again later"/>

                <div className="flex items-center justify-between my-12">
                    <Btn.SmallBtn onClick={handleBack}>Back</Btn.SmallBtn>
                    <Btn.SmallBtn onClick={handleNext}>Next</Btn.SmallBtn>
                </div>
            </div>
        </>
    );
}