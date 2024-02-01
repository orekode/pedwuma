import { useState, useRef, useEffect } from "react";
import { Btn } from "components";

import { getThumbnail, getUrlThumbnail }    from "functions/utils/Files";




export default function ({back=null, title="Experience", description="", btnOnClick=()=>{}, btnText="Click Me To Upload", checkFile=()=>{}, prevFiles=[], prevFilesUrl=[], callback=()=>{}, removeUrl=()=>{}}) {

    const inputRef = useRef();

    const [ filesUploaded, setFilesUploaded ] = useState([...prevFiles]);

    const handleBtnClick = () => {
        btnOnClick();
        inputRef.current.click();
    }
    
    const handleFileUpload = (e) => {

        const files = e.target.files;

        if(!checkFile(files)) return false;

        const tempFiles = [];

        for( let i = 0; i < files.length; i++) {

            let file = files[i];

            tempFiles.push({
                file,
                thumbnail: getThumbnail(file),
            });
        };

        callback([...filesUploaded, ...tempFiles]);
        setFilesUploaded([...filesUploaded, ...tempFiles]);
    }

    const removeFile = (file) => {
        let newFiles = filesUploaded.filter( item => item !== file);
        setFilesUploaded([...newFiles]);
        callback([...newFiles]);
    }

    const removeFileUrl = (url) => {
        removeUrl(url);
    }

    const clearAll = () => {
        setFilesUploaded([]);
        callback([]);
    }

    return (
        <div>
            {back &&
                <i onClick={back} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
            }

            <h1 className="orb text-3xl text-center font-medium mx-auto my-3">{title}</h1>
            <p className="max-w-[500px] text-base mx-auto text-center mb-3">{description}</p>
            
            <div className="mx-auto w-max flex flex-wrap gap-3">
                <Btn.SmallBtn onClick={handleBtnClick}>{btnText}</Btn.SmallBtn>
                {filesUploaded.length > 0 &&
                    <button onClick={clearAll} className="border-2 border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white rounded-md px-5 py-1 uppercase font-semibold">clear All</button>
                }
            </div>

            <div className="flex items-center gap-3 mt-6  justify-center flex-wrap">

                {filesUploaded.map( (item, index ) => 
                    <div key={index} className="h-[250px] w-[250px] rounded-lg overflow-hidden border shadow relative">
                        <img src={item.thumbnail} alt="" className="object-contain h-full w-full" />
                        <div onClick={() => {removeFile(item)}} className="absolute top-1 right-1 rounded-full h-[30px] w-[30px] bg-red-500 text-white text-lg flex items-center justify-center">
                            <i className="bi bi-x-lg"></i>
                        </div>
                    </div>
                )}

                {prevFilesUrl.map( (item, index ) => 
                    <div key={index} className="h-[250px] w-[250px] rounded-lg overflow-hidden border shadow relative">
                        <img src={getUrlThumbnail(item)} alt="" className="object-contain h-full w-full" />
                        <div onClick={() => {removeFileUrl(item)}} className="absolute top-1 right-1 rounded-full h-[30px] w-[30px] bg-red-500 text-white text-lg flex items-center justify-center">
                            <i className="bi bi-x-lg"></i>
                        </div>
                    </div>
                )}

            </div>

            <input onChange={handleFileUpload} multiple ref={inputRef} type="file" name="file_basket" className="h-0 w-0 overflow-hidden p-0 m-0" />
            
        </div>
    );
}