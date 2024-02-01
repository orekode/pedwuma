import { safeGet } from "functions/utils/Fixers";
import { getAuth } from "firebase/auth";
import { getUrlThumbnail, getThumbnail } from "functions/utils/Files";


export default function ({ message }) {

    const user_id = getAuth().currentUser.uid;

    const senderId = safeGet(message, "Sender ID");

    const forYou = senderId == user_id || !senderId;

    const idCheck = safeGet(message, "id") == "noidhere";


    let url;

    if(typeof message.Message == "object") url = getThumbnail(message.Message);
    else url = getUrlThumbnail(message.Message);


    if(message["Message Type"] == "text")
    return (
        <div className={`message text-sm my-1.5 max-w-[80%] w-max ${forYou ? `self-end rounded-tr-none ${idCheck ? "bg-orange-400" : "bg-blue-400"} text-white` : "self-start rounded-tl-none bg-white"}  rounded-xl  shadow p-2 font-medium `} style={{"transform": "translateZ(0)"}}>{message.Message}</div>
    );

    if(message["Message Type"] != "text" )
    return (
        <a href={url} target="_blank" className={`message text-sm my-1.5 max-w-[80%] h-[200px] w-max ${forYou ? `self-end rounded-tr-none ${idCheck ? "bg-orange-400" : "bg-blue-400"} text-white` : "self-start rounded-tl-none bg-white"}  rounded-xl  shadow p-2 font-medium `} style={{"transform": "translateZ(0)"}}>
            <img src={url} className="object-cover w-full h-full" />
        </a>
    );
}