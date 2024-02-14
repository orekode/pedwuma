

import { addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uploadFile } from "../utils/Files";
import { categoryExists } from "../reads/Categories";
import { db } from "../../config/firebase";
import refs from "../refs";

export const newCategory = async (categoryInputs) => {

    try {

        const exists = await categoryExists(categoryInputs.category);

        if(exists) return "exists";

        const categoryImage = await uploadFile(
            `categories/${categoryInputs.category}`, 
             categoryInputs.categoryImage
        );
        
        const result = await addDoc(refs.categories, {
            "Category Name": categoryInputs.category,
            "Desc": categoryInputs.description,
            "Pic": categoryImage,
            "Services Provided": []
        });


        categoryInputs.services.map( async service => {
            await newService(result.id, service);
        });

        return "success";
    }
    catch (error) {
        console.log(error);
        return false;
    }

}

export const newService = async (category, service) => {

    try {

        // const imageUrl = await uploadFile(`categories/services/${service.title}`, service.image);
    
        const categoryRef = doc( db, "Category", category );
    
        await updateDoc(categoryRef, {
            // "Services Provided" : arrayUnion({
            //     "Title": service.title,
            //     "Pic": imageUrl
            // })

            "Services Provided" : arrayUnion(service.title)
        })
    
        return true;

    }
    catch (error) {
        console.log(error);
        return false;
    }

}