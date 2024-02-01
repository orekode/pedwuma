
import { Link        }  from "react-router-dom";
import { Btn, Cards  }  from "components";
import { useData     }  from "functions/reads/General";
import { useNavigate }  from "react-router-dom";
import { getDocById  }  from "functions/reads/General";

export default function () {

    const { data } = useData({
        target: "users",
        conditions: [],
        callback: async (doc) => {

            let plan = await getDocById("Plans", doc["Plan"]);
            doc["Plan"] = plan.Name;

            return doc;
        },
        order: ["Role", "asc"]
    });

    const navigate = useNavigate();

    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <h1 className="orb font-semibold">Users</h1>

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

                        image={typeof(item["Pic"]) == "undefined" || item["Pic"].replaceAll(" ", "") == "" ? "/images/user.png" : item["Pic"]}
                        title={<span className="text-lg orb">{`${item["First Name"]} ${item["Last Name"]}`}</span>}
                        description=
                        {<div className="text-xs">
                            <div className="my-1 text-gray-700 font-semibold whitespace-nowrap"><span className="text-xs font-light capitalize">role: </span>{item["Role"]}</div>
                            <div className="my-1 text-gray-700 font-semibold whitespace-nowrap"><span className="text-xs font-light capitalize">email: </span>{item["Email Address"]}</div>
                            <div className="my-1 text-gray-700 font-semibold whitespace-nowrap"><span className="text-xs font-light capitalize">contact: </span>{item["Mobile Number"]}</div>
                        </div>}

                        topInfo={item["Plan"]}
                        btnText="View Details"
                        onBtnClick={() => { navigate(`/admin/user/${item.id}`)}}
                        className="h-[400px] max-[1165px]:w-[300px] max-[1165px]:h-[400px] border border-gray-200 shadow-xs hover:shadow-lg bg-white rounded-md overflow-hidden relative group"
                    />
                )}
            </div>

            
        </section>
    );
}