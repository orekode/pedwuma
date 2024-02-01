

import { doc, addDoc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";

import { ipInfo } from "../utils/Locations";

import refs from "../refs";
import { db } from "../../config/firebase";



export const newNotification = async ({
    sender,
    receiver,
    title,
    content,
    type,
    pic="",
    link="",
}) => {
    try {

        const res = await addDoc(refs.notifications, {
            "Sender ID": sender,
            "Receiver ID": receiver,
            "Title": title,
            "Message": content,
            "Notification Type": type,
            "Upload Timestamp": serverTimestamp(),
            "Pic": pic,
            "Link": link
        });

        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }


}