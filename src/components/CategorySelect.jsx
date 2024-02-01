import { useState }   from "react";
import { limit }      from "firebase/firestore";
import { useData }    from "functions/reads/General";
import { Cards, Btn } from "components";
import { safeGet }    from "functions/utils/Fixers";




export default function ({ back=null, selectCategory=()=>{}, title="Please Choose A Category For Your Profile" }) {

    const [ parameters, setParameters ] = useState({
        next: null,
        back: null,
        history: [null],
        index: 0,
    });


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
        <div>
            {back && 
                <i onClick={back} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
            }
            
            <h1 className="orb text-3xl text-center font-medium mx-auto my-6">{title}</h1>
    
            <div data-aos="fade-in" className="grid-box-fill gap-3 p-5" style={{"--width": '250px'}}>
                {!data && Array.from({length: 20}, (item, index) => 
                    <Cards.Loading />
                )}


                {data && data[0].map( (item, index) => 
                    <Cards.Description
                        key={index}

                        image={item["Pic"]}
                        title={item["Category Name"]}
                        // description={<div className="text-xs">{item["Desc"].slice(0, 100)}...</div>}
                        description={""}
                        topInfo=""
                        btnText="Choose Me"
                        onBtnClick={() => {selectCategory(item);}}
                        className="h-[320px] max-[1165px]:w-[300px] max-[1165px]:h-[320px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative group"
                    />
                )}
            </div>

            <div className="flex items-center justify-between my-12">
                <Btn.SmallBtn onClick={handleBack}>Back</Btn.SmallBtn>
                <Btn.SmallBtn onClick={handleNext}>Next</Btn.SmallBtn>
            </div>
        </div>

    );
}