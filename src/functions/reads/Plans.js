import { db } from "../../config/firebase";

import { doc, getDoc } from "firebase/firestore";


export const getPlan = async (id) => {

    try {
        
        const planRef = doc(db, "Plans", id);
    
        const snapshot = await getDoc(planRef);
    
        if(snapshot.exists()) return snapshot.data();
    
        else return "not_exists";

    }
    catch( error ) {
        console.log(error);
        return false;
    }
}