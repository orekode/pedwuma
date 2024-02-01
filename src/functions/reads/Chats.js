import { collection, doc, addDoc, getDoc, getDocs, query, onSnapshot, serverTimestamp, where, orderBy, setDoc, collectionGroup, or, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import refs from "../refs";
import { db } from "../../config/firebase";
import { getData } from "./General";
import { useQuery } from "react-query";



export const getLastMessage = async (chat_room_id) => {

    let result;

    let lastMessage = await getDocs(
        query(
            collection( db, "Chat Room", chat_room_id, "Messages"),
            orderBy("Timestamp", "desc"),
            limit(1),
        )
    );

    lastMessage = lastMessage.docs;

    //handle cases where there are no messages in the chat room
    if(lastMessage.length > 0) {
        result = { 
           id: lastMessage[0].id, 
            ...lastMessage[0].data(),
        }
        
        const user_id = getAuth().currentUser.uid;

        result.you = result["Sender ID"] == user_id;
    } 
    else {
        result = {}
    }

    return result;
}

export const getRecipient = async (chatRoom) => {

    // console.log(chatRoom, "chatroom test");

    const user_id = getAuth().currentUser.uid;

    const recipient_id = chatRoom["Sender ID"] == user_id ? chatRoom["Receiver ID"] : chatRoom["Sender ID"];

    let recipient = await getDocs(
        query(
            collection( db, 'users'),
            where("User ID", "==", recipient_id),
            limit(1)
        ),
    );

    recipient = recipient.docs

    if(recipient.length > 0) {
        recipient = {
            id: recipient[0]["id"],
            ...recipient[0].data(),
        };
    }
    else recipient = {};

    return recipient;
}

export const recipients = async ({callback = null}) => {

    try {

        const auth = getAuth();

        const messages = await getDocs(
            query(
                collection( db, "Chat Room"),
                or(
                    where("Sender ID", "==", auth.currentUser.uid),
                    where("Receiver ID", "==", auth.currentUser.uid),
                ),
                orderBy("Last Message Timestamp", "desc"),
                limit(35),
            )
        );

        const result = messages.docs.map( message => {
            return {
                id: message.id,
                ...message.data(),
            };
        });

        for( let i = 0; i < result.length; i++ ) {

            if(callback) {
                result[i] = await callback(result[i]);
            }

            result[i]["Message"] = await getLastMessage(result[i]["id"]);

            result[i]["Recipient"] = await getRecipient(result[i]);

        }

        // console.log(result);

        return result;

    }
    catch(error) {
        // console.log(error);
        return false;
    }

    
}

export const useRecipients = ({  callback = null }) => {
    return useQuery(["recipients"], async () => {
        return await recipients({ callback });
    }, {
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
    });
}


export const recipientListener = (setRecipients, user_id, callback=null) => {

    let auth = getAuth();

    const q = 
        query(
            collection( db, "Chat Room"),
            or(
                where("Sender ID", "==", user_id),
                where("Receiver ID", "==", user_id),
            ),
            orderBy("Last Message Timestamp", "desc"),
            limit(105),
        );
        

    const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {

      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });

      if(auth.currentUser.uid !== null) user_id = auth.currentUser.uid;


    //   const fetchedMessages = fetchedMessages.sort(
    //     (a, b) => a.Timestamp - b.Timestamp
    //   );

        for( let i = 0; i < fetchedMessages.length; i++ ) {

            if(callback) {
                fetchedMessages[i] = await callback(fetchedMessages[i]);
            }

            fetchedMessages[i]["Message"] = await getLastMessage(fetchedMessages[i]["id"]);

            fetchedMessages[i]["Recipient"] = await getRecipient(fetchedMessages[i]);

        }

      setRecipients(fetchedMessages);
      
    });

    return () => unsubscribe;
  
}


export const messages = async ({ target = null }) => {

    

    const chat_room_id = [target, getAuth()?.currentUser?.uid].sort().join("_");

    // console.log(chat_room_id, "chat_room_id");

    let snapshots = await getDocs(
        query(
            collection( db, "Chat Room", chat_room_id,  "Messages"),
            orderBy("Timestamp", "desc"),
        )
    );

    snapshots = snapshots.docs.map( item => {
        return {
            id: item.id,
            ...item.data(),
        }
    });

    snapshots = snapshots.reverse();

    return snapshots;
}

export const messageListener = (setMessages, recipient, user_id) => {

        const chat_room_id = [recipient, user_id].sort().join("_");
    
        const q = query(
            collection( db, "Chat Room", chat_room_id,  "Messages"),
            orderBy("Timestamp", "desc"),
            limit(105),
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {

          const fetchedMessages = [];
          QuerySnapshot.forEach((doc) => {
            fetchedMessages.push({ ...doc.data(), id: doc.id });
          });

          setMessages(fetchedMessages.reverse());
          
        });

        return () => unsubscribe;
      
}

export const useMessages = ({ target = null }) => {
    return useQuery(["single chat messages", target], async () => {
        return await messages({ target });
    }, {
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
    });
}