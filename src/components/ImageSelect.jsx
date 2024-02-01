import { useState, useRef, useEffect } from "react";



export default function ({ initImageUrl=null, initImage, callback=()=>{}, containerClass=" h-[190px] w-[300px] ", imageClass="text-7xl", textClass="", text="Click To Add An Image", ...props}) {

    const [ image, setImage ] = useState(null);

    const inputRef = useRef();

    const handleInput = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
        callback(e.target.files[0]);
    } 

    useEffect(() => {
        if(typeof(initImage) !== "undefined") {
            setImage(URL.createObjectURL(initImage));
        }
        else setImage(initImageUrl);

    }, [initImage, initImageUrl])

    return (
        <div className={`rounded border shadow text-gray-600 relative overflow-hidden group ${containerClass}`}>
            <div onClick={() => inputRef.current.click() } className={`h-full w-full flex flex-col text-center items-center justify-center ${image ? "bg-black bg-opacity-50" : "bg-white bg-opacity-20"} absolute top-0 left-0 z-10`}>
                <i className={`${imageClass}   ${image ? "text-white" : ""} group-hover:text-blue-500 bi bi-image-alt mb-2`}></i>
                <span className={`${textClass} ${image ? "text-white" : ""} group-hover:text-blue-500 text-xs font-semibold`}>{text}</span>
                <input type="file" className="h-0 w-0 m-0 p-0 overflow-hidden opacity-0" accept="image/*" ref={inputRef} onChange={handleInput} {...props}/>
            </div>

            { image && 
                <img src={image} className="object-cover h-full w-full relative z-0" />
            }
        </div>
    );
}