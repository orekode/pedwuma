import SideScroll from './SideScroll';

export default function () {
    const testimonials = [
        {
          location: "Kumasi",
          name: "Sarah J.",
          image: "sarah.jpg",
          testimonial: "Pedwuma has been a game-changer for my business. The platform connects me with amazing clients and provides a good experience!",
          project: "Seamstress"
        },
        {
          location: "Tema",
          name: "Mr Ofori",
          image: "pedwuma.jpg",
          testimonial: "I never thought finding workers could be this easy. Pedwuma has made finding workers very very easy, thank you very much!",
          project: "Carpenter"
        },
        {
          location: "Ghana, Darkumah",
          name: "Emily M.",
          image: "pedwuma.jpg",
          testimonial: "Pedwuma helped me find good workers. The quality of their services exceeded my expectations!",
          project: "Shop Owner"
        },
        {
          location: "Dansoman",
          name: "David Arthur.",
          image: "electrician.avif",
          testimonial: "Pedwuma is a the best. The process is straightforward, and they made it so easy to find new jobs!",
          project: "Electrician"
        },
    ];

    return (
        <div className="px-10 max-[475px]:px-0">
            <div data-aos="fade-in" className="title mx-auto w-max flex items-center mb-3">
                <hr className="w-[100px] max-[800px]:w-[10px] h-0.5 bg-black"/>
                <div className="uppercase text-lg text-blue-600 font-semibold orb">Testimonials</div>
                <hr className="w-[100px] max-[800px]:w-[10px] h-0.5 bg-black"/>
            </div>
            
            <div data-aos="fade-in" className="text-center text-5xl max-[1165px]:text-3xl orb mb-12">
                What Our Customers Say
            </div>

            <SideScroll>
                {testimonials.map((item, index) => 
                    <div key={index} data-aos="fade-up" className="">
                        <div className="w-[100px] h-[100px] rounded-full mx-auto shadow-lg relative overflow-hidden">
                            <img src={"/images/" + item.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="font-bold text-sm my-3 text-center leading-none orb">{item.name}</div>
                        <p className="w-[450px] max-[1165px]:w-[310px] min-h-[150px] shadow-xl rounded p-5 pt-6 text-center max-[1165px]:text-sm">
                            {item.testimonial}
                        </p>
                    </div>
                )}
            </SideScroll>
        </div>
    );
}