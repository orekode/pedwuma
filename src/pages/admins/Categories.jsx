
import { Link } from "react-router-dom";
import { Btn, Cards } from "components";
import { useData } from "functions/reads/General";
import { useNavigate } from "react-router-dom";


export default function () {

    const { data } = useData({
        target: "Category",
        conditions: [],
        order: ["Category Name", "asc"]
    });

    const navigate = useNavigate();

    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <h1 className="orb font-semibold">Service Categories</h1>

                <Link to="/admin/category/new">
                    <Btn.SmallBtn>New Category</Btn.SmallBtn>
                </Link>
            </div>

            <div className="grid-box-fill gap-3" style={{"--width": '250px'}}>
                {!data && Array.from({length: 20}, (item, index) => 
                    <Cards.Loading />
                )}


                {data && data[0].map( (item, index) => 
                    <Cards.Description
                        key={index}

                        image={item["Pic"]}
                        title={item["Category Name"]}
                        description={<div className="text-xs">{item["Desc"]}</div>}
                        btnText="Edit"
                        onBtnClick={() => { navigate(`/admin/category/${item.id}`)}}
                        className="h-[400px] max-[1165px]:w-[300px] max-[1165px]:h-[400px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative group"
                    />
                )}
            </div>

            
        </section>
    );
}