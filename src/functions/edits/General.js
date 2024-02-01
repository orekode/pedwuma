import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";


export const updateById = async (id, target, updateObj) => {

    try {

        const result = await updateDoc(doc( db, target, id), updateObj)

        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}