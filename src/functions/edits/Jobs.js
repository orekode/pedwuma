import { doc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import refs from "../refs"
import { db } from "../../config/firebase";
import { getDocById } from "../reads/General";

export const editJob = async (jobInputs) => {

    try {

        const old = await getDocById("Jobs", jobInputs.id);
    
        await updateDoc( doc( db, "Jobs", jobInputs.id), {
            "Seen By": jobInputs.seenBy,
            "Service Information": {
                ...old["Service Information"],
                "Charge": parseFloat(jobInputs.amount),
                "Charge Rate": jobInputs.chargeRate,
                "Expertise": jobInputs.expertise,
                "Service Category": jobInputs.category,
                "Service Provided": jobInputs.service
            },
            "Job Details": {
                ...old["Job Details"],
                "title": jobInputs.title,
                "description": jobInputs.desc,
            },
        });
    
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }

} 


export const setApplicationState = async (id, state, jobId) => {
    try {

        const result = await updateDoc(doc( db, "Applications", id), {
            "Job Status": state,
        })

        if(state == "Accepted" || state == "Completed") {

            const old = await getDocById("Jobs", jobId);
        
            await updateDoc( doc( db, "Jobs", jobId), {
                "Job Details": {
                    ...old["Job Details"],
                    "Job Status": state,
                },
            });
        }


        return true;
    }
    catch(error) {
        
        return false;
    }
}