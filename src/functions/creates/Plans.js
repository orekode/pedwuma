
import { db } from "../../config/firebase";
import { addDoc, updateDoc, query, where, getCountFromServer, serverTimestamp, doc } from "firebase/firestore";
import refs from "../refs";


export const newPlan = async (inputs) => {

    try {
        
        const queryBuild = query( refs.plans, where("Name", "==", inputs.name));
    
        const snapshot = await getCountFromServer(queryBuild);
    
        const count = snapshot.data().count;
    
        if(count > 0) return "exists";
    
        const docRef = await addDoc(refs.plans, {
            Amount: parseFloat(inputs.amount),
            Applications: parseFloat(inputs.applications),
            Features: inputs.features,
            Jobs: parseFloat(inputs.jobs),
            Name: inputs.name,
            Portfolios: parseFloat(inputs.portfolios),
            "Default Rating": parseFloat(inputs.rating),
            "Upload Timestamp": serverTimestamp(),
        });

        await updateDoc( doc( db, "Plans", docRef.id), {
            "Plan ID": docRef.id,
        });
    
        return "success";

    }

    catch (error) {
        console.log(error);
        return "error";
    }
}


export const confirmPayment = async (reference) => {

    let result = await fetch(`https://pedwuma.com/backend/uploads/check.php?reference=${reference}`);

    
    result = await result.json();
    
    if(result.status && result.data.status == "success") return true;
    
    return false;
}