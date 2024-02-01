
import { Link } from "react-router-dom";
import { ImageBg, BoxSearch, SideScroll, Btn, WorkersScroll, CategoriesScroll, Testimonials } from "components";


export default function() {
    return (
        <>
            <ImageBg image={`/images/pedwuma.jpg`}>

                <div className="h-max bg-gradient-to-bl from-black relative ">
                    <BoxSearch />
                </div>

            </ImageBg>

            <WorkersScroll />

            <div className="" style={{background: 'url(/images/pedwuma.jpg)', backgroundSize: 'cover'}}>
                <div className="grid grid-cols-10 max-[1165px]:grid-cols-5 gap-10 p-10 max-[1165px]:p-5 my-10 backdrop-blur-xl bg-black bg-opacity-50">
                    <div data-aos="fade-in" className="col-span-5 max-[1165px]:hidden">
                        <img src="/images/pedwuma.jpg" alt="" className="object-cover w-full h-full rounded-md" />
                    </div>

                    <div data-aos="fade-in" className="col-span-5 mt-5 bg-white rounded-md p-5">
                        <h1 className="font-semibold text-5xl max-[475px]:text-3xl orb">
                            Are You An <span className="text-blue-600 orb">Experienced Worker</span>
                        </h1>

                        <p className="pt-5 text-lg max-[475px]:text-sm leading-relaxed">
                            Pedwuma is the best place to advertise your skills and services,
                            get access to our clients/employers, and find jobs close to you today.
                        </p>

                        <p className="py-5 text-lg max-[475px]:text-sm leading-relaxed">
                            With Pedwuma <span className="font-semibold text-blue-600">YOU ARE THE BOSS</span>, you can set your own time and price,
                            receive new jobs and you never have to worry about finding new clients/employers, 
                            <span className="font-semibold text-blue-600">"WE DE FOR YOU!"</span>
                        </p>

                        <Link to="/signup">
                            <Btn.BigBtn>Join Us Now</Btn.BigBtn>
                        </Link>
                    </div>
                </div>
            </div>

            <CategoriesScroll />

            <Testimonials />

        </>
    );
}