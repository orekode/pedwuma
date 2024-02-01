import { getCountFromServer, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import refs from "../refs";
import { useQuery } from "react-query";
import { db } from "../../config/firebase";
import { useData } from "./General";


export const categoryExists = async (title, id=null) => {

    try {

        const queryBuild = query(refs.categories, where("Category Name", "==", title));
        const snapshot = await getDocs(queryBuild);

        const data = snapshot.docs.filter( doc => doc.id != id);

        if(data.length > 0) return true 

        return false;

    }
    catch (error) {
        console.log(error);
        return true;
    }
}

export const useCategory = (id) => {
    return useQuery(['category', id], async () => {
        
        try {

            const docRef = doc(db, "Category", id);
    
            const snapshot = await getDoc(docRef);
    
            if(snapshot.exists()) return snapshot.data();
    
            return false;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    
    });
}