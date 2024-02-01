import { useState } from "react";
import { Skeleton } from "@mui/material";
import { Btn, EmptyBox, Cards } from "components";
import { Link, useNavigate } from "react-router-dom";

import { useBookingProfiles } from "functions/reads/Bookings";

import { encrypt, safeGet } from "functions/utils/Fixers";

export default function () {

    const [ parameters, setParameters ] = useState({
        next: null,
        back: null,
        history: [null],
        index: 0,
    });

    const navigate = useNavigate();

    const { data, isLoading, isError } = useBookingProfiles({
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
        <div>
            <div className="flex items-center justify-between mb-3">
                <h1 className="orb font-semibold mb-3">Profiles</h1>
                <Link to={"/admin/profile/new"}>
                    <Btn.SmallBtn>New Profile</Btn.SmallBtn>
                </Link>
            </div>

            <div className="profiles flex grid-box-fill gap-3" style={{"--width": "250px"}}>
                {(isLoading || isError ) && Array.from({length: 15}, (item, index) => 
                    <Cards.Profile key={index} item={item} loading={true} />
                )}
                
                { data && data[0].map( (item, index) => 
                    <Cards.Profile onBtnClick={(() => navigate(`/admin/profile/edit/${encrypt(item.id)}`))} key={index} item={item}  />
                )}

            </div>

            <EmptyBox load={typeof(data) != 'undefined' && data[0]?.length <= 0} image={"/images/profile.png"} title="No Booking Profiles " text="plese click the new profile button at the top right corner of the page to create a profile"/>

            <div className="flex items-center justify-between my-12">
                <Btn.SmallBtn onClick={handleBack}>Back</Btn.SmallBtn>
                <Btn.SmallBtn onClick={handleNext}>Next</Btn.SmallBtn>
            </div>

        </div>
    );
}