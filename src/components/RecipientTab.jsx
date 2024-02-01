import { safeGet, readableDate } from "functions/utils/Fixers";
import { ImageCircle } from "components";


export default function ({active=false, user={}, extraClass="", ...props}) {

    let type = safeGet(user, ["Message", "Message Type"], "text");

    let messageMap = {
        "text":  safeGet(user, ["Message", "Message"], "").slice(0, 50),
        "image": <span> <i className="bi bi-image text-xs"></i> image</span>,
        "file":  <span> <i className="bi bi-paperclip"></i> file</span>,
    }

    let message = messageMap[type];

    return (
        <div className={` ${active ? "bg-blue-700 text-white" : "bg-white"} ${extraClass}  group hover:bg-blue-500 active:bg-blue-600 hover:text-white shadow-md flex gap-3 px-3 py-2`} {...props}>

            <ImageCircle image={safeGet(user, ["Recipient", "Pic"], "/images/user.png")} />

            <div className="details flex-grow" style={{width: "calc(100% - 50px)"}}>

                <div className="">
                    <div className="name font-semibold orb leading-none text-sm">{`${safeGet(user, ["Recipient", "First Name"], "")} ${safeGet(user, ["Recipient", "Last Name"], "")}`}</div>
                    <span className={`${active ? "text-gray-200 " : "text-gray-500"}  group-hover:text-gray-200 text-xs`}>{readableDate(safeGet(user, ["Last Message Timestamp"]))}</span>
                </div>

                <p className={`${active ? "text-gray-200 " : "text-gray-700"} text-sm  group-hover:text-gray-100 my-1 font-medium `}>
                    <span className="font-semibold">{safeGet(user, ["Message", "you"]) ? "You:" : ""}</span> {message}{safeGet(user, ["Message", "Message"], "").length > 50 ? "..." : ""}
                </p>
                
            </div>

        </div>
    )
}