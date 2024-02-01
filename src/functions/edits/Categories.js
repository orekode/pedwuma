import { addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uploadFile } from "../utils/Files";
import { categoryExists } from "../reads/Categories";
import { newService } from "../creates/Categories";
import { db } from "../../config/firebase";
import refs from "../refs";


export const editCategory = async (categoryInputs) => {

    try {

        const exists = await categoryExists(categoryInputs.category, categoryInputs.id);

        if(exists) return "exists";

        let categoryImage;

        if(typeof(categoryInputs.categoryImage) !== "undefined")
            categoryImage = await uploadFile(
                `categories/${categoryInputs.category}`, 
                categoryInputs.categoryImage
            );
        else categoryImage = categoryInputs.imageUrl;
        
        await updateDoc(doc(db, "Category", categoryInputs.id), {
            "Category Name": categoryInputs.category,
            "Desc": categoryInputs.description,
            "Pic": categoryImage,
        });


        categoryInputs.services.filter( service => typeof(service.image) !== "undefined").map( async service => {
            await newService(categoryInputs.id, service);
        });

        return "success";
    }
    catch (error) {
        console.log(error);
        return false;
    }

}