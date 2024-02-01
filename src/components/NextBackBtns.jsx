
import { encrypt, safeGet } from "functions/utils/Fixers";

import { SmallBtn } from "components/Buttons";



export default function ({ parameters, setParameters, setParameterChange, parameterChange = () => {}, data={} }) {

    const handleNext = () => {

        let oldHistory = [ ...parameters.history ];
        let oldIndex = parameters.index;
        let nextItem = safeGet(data, ["1"], null);


        if(oldHistory.indexOf(nextItem) < 0) {
            oldHistory = [...parameters.history, nextItem];
            oldIndex++;
        }
        
        setParameters({ ...parameters, history: oldHistory, index: oldIndex, next: nextItem });
        setParameterChange(!parameterChange); 
        
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
        setParameterChange(!parameterChange);
    }

    return (
        <div className="flex items-center justify-between my-12">
            <SmallBtn onClick={handleBack}>Back</SmallBtn>
            <SmallBtn onClick={handleNext}>Next</SmallBtn>
        </div>
    );
}