import { collection, doc, addDoc, getDoc, getDocs, query, serverTimestamp, where, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import refs from "../refs";
import { db } from "../../config/firebase";
import { uploadFile } from "functions/utils/Files";

export const sendMessage = async (recipient, message, type) => {

    try {

        // console.log(recipient, "it's me");
        if (recipient == "") return false;

        const auth = getAuth();

        const recipients = [recipient, auth.currentUser.uid];

        const messageRef = await initMessage(recipients);

        if (type == "image" || type == "file") {
            message = await uploadFile(`/chats/${type}_${Math.random() * 10}`, message);
        }

        message = await addDoc(messageRef, {
            "Message": message,
            "Message Type": type,
            "Timestamp": serverTimestamp(),
            "Sender ID": auth.currentUser.uid,
            "Receiver ID": recipient,
        });

        return message;

    }
    catch (error) {
        console.log(error);
        return false;
    }


}

export const initMessage = async (recipients) => {

    try {

        console.log("I started");

        const chat_room_id = recipients.sort().join("_");

        const roomRef = doc(db, "Chat Room", chat_room_id);

        const room = await getDoc(roomRef);

        if (!room.exists()) {
            await setDoc(roomRef, {
                "Sender ID": recipients[1],
                "Receiver ID": recipients[0],

            });
        }

        updateDoc(roomRef, {
            "Last Message Timestamp": serverTimestamp(),
        });

        let messageRef = collection(roomRef, "Messages");

        console.log(messageRef);

        return messageRef;

    }
    catch (error) {
        console.log(error);
        return false;
    }

}