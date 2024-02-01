import { collection, doc, addDoc, getDoc, getDocs, query, onSnapshot, serverTimestamp, where, orderBy, setDoc, collectionGroup, or, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import refs from "../refs";
import { db } from "../../config/firebase";
import { getData } from "./General";
import { useQuery } from "react-query";
import { safeGet } from "../utils/Fixers";


export const notificationListener = (setRecipients, user_id, role, whereList=[], callback=null) => {

    let auth = getAuth();


    const q = 
        query(
            collection( db, "Notifications"),
            or(
                where("Receiver ID", "==", role),
                where("Receiver ID", "==", user_id),
                ...whereList
            ),
            orderBy("Upload Timestamp", "desc"),
            limit(105),
        );
        

    const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {

      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });

        for( let i = 0; i < fetchedMessages.length; i++ ) {

            if(callback) {
                fetchedMessages[i] = await callback(fetchedMessages[i]);
            }
            else break;

        }

      setRecipients(fetchedMessages);
      
    });

    return () => unsubscribe;
  
}

export const getServicesFromProfiles = async (user_id) => {
    const queryBuild = query( collection ( db, "Booking Profile" ), where("User ID", "==", user_id) );

    const snapshots = await getDocs(queryBuild);

    const result = snapshots.docs.map( doc => safeGet(doc.data(), ["Service Information", "Service Provided"], "") );

    return result;
}

