
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDocs, query, where, and } from "firebase/firestore";
import { db } from "../../config/firebase";
import { errorAlert } from "../utils/Alert";
import refs from "../refs";

import { getDocById } from "./General";

export const logIn = async (email, password) => {

    try {
        const auth = getAuth();
    
        const signIn = await signInWithEmailAndPassword(auth, email, password);
    
        const snapshot = await getDocs(query(refs.users, where("User ID", "==", signIn.user.uid)));

        const result = snapshot.docs;
    
        if(result.length <= 0) return false;
    
        errorAlert({
            icon: "success",
            title: "Welcome Back"
        });

        let data = result[0].data();


        // const plan = await getDocById("Plans", data["Plan"]);

        // data["plan"] = plan;
        
        data["plan"] = {
            Amount: 0,
            Applications: 20,
            'Default Rating': 1,
            Features: [
                "Basic rank boost",
                "20 booking portfolio uploads",
                "20 job applications per day",
                "50 jobs per week"
            ],
            Jobs: 50,
            Name: "Basic",
            Portfolio: "20",
        };

        
        return data;
    }
    catch (error) {
        console.log(error);

        errorAlert({
            title: "Invalid Email or Password",
            text: "Please check your email and password and try again."
        });

        return false;
    }
}

export const profileForService = async (service) => {
    try {
        const auth = getAuth();

        const queryBuild = query(refs.bookingProfiles, 
            and(
                where("Service Information.Service Provided", "==", service),
                where("User ID", "==", auth.currentUser.uid)
            )
        );

        const result = await getDocs(queryBuild);

        return result.docs;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}