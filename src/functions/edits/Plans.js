


import { db } from "../../config/firebase";
import { updateDoc, doc, where, getCountFromServer, serverTimestamp } from "firebase/firestore";
import refs from "../refs";


export const editPlan = async (inputs) => {

    try {

        
        const docRef = doc( db, "Plans", inputs.id);

        await updateDoc(docRef, {
            Amount: parseFloat(inputs.amount),
            Applications: parseFloat(inputs.applications),
            Features: inputs.features,
            Jobs: parseFloat(inputs.jobs),
            Name: inputs.name,
            Portfolios: parseFloat(inputs.portfolios),
            "Default Rating": parseFloat(inputs.rating),
        });
    
        return "success";

    }

    catch (error) {
        console.log(error);
        return "error";
    }
}