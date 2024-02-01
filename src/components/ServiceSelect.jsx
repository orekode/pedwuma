
import { Cards } from "components";

export default function ({ back=null, services=[], selectService=()=>{}, service , title="What Service Can You Render"}) {


    return (
        <div>
            {back &&
                <i onClick={back} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
            }

            <h1 className="orb text-3xl text-center font-medium mx-auto my-6">{title}</h1>
            
            <div data-aos="fade-in" className="grid-box-fill gap-3 p-5" style={{"--width": '250px'}}>
                {!services && Array.from({length: 20}, (item, index) => 
                    <Cards.Loading />
                )}


                {services && services.map( (item, index) => 
                    <Cards.Small
                        key={index}

                        title={item}

                        containerClass={`${ typeof(service) !== "undefined" && service === item ? " border-blue-500 shadow-blue-500 border-2 text-white " : ""}`}
                        onClick={() => {selectService(item)}}
                    />
                )}
            </div>
        </div>
    );
}