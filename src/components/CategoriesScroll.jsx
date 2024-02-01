
import { Btn } from "./";
import CardScroll from "./CardScroll";
import { limit }   from "firebase/firestore";
import { useData } from "functions/reads/General";
import { Cards }   from "components";
import { useNavigate } from "react-router-dom";

export default function () {
    const { data } = useData({
        target: "Category",
        conditions: [ limit(35) ],
        order: ["Category Name", "asc"],
    });

    const navigate = useNavigate();

    return (
        <CardScroll title='Worker Categories'>
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
                    btnText="See Workers"
                    onBtnClick={() => {navigate("/workers")}}
                    className="w-[400px] h-[500px] max-[1165px]:w-[300px] max-[1165px]:h-[400px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative group"
                />
            )}
        </CardScroll>
    );
}