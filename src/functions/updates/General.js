import { db } from "../../config/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";


export const updateAllDocs = async (target, value) => {

    try {

        let queryBuild = query( collection(db, target) );
        let snapshot   = await getDocs( queryBuild );
    
        await Promise.all( snapshot.docs.map( doc => {

            updateDoc(doc.ref, value);
        } ));
    
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }

    // updateAllDocs("Handyman Jobs Applied", {"Upload Timestamp": serverTimestamp() });

} 