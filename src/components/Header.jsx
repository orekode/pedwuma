import { ImageBg } from "./";

export default function ({ title = <></>, text=<></>, image="", button=<></>}) {
    return (
        <ImageBg image={image}>

            <div className="h-max bg-black bg-opacity-70 relative text-white py-12 px-10 max-[1165px]:px-5">

                <div className="max-w-[700px] h-full mx-auto text-center justify-center items-center flex flex-col">
                    <h1 className="font-black orb text-5xl max-[700px]:text-3xl mb-2">{title}</h1>
                    <p className="max-w-[600px] max-[700px]:text-sm">{text}</p>
                </div>
                {button}
            </div>

        </ImageBg>
    );
}