import { getAuth, updateEmail, updateProfile, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { updateDoc, arrayUnion, doc, setDoc, query, where, getDocs, getCountFromServer, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getDocById } from "../reads/General";
import { uploadFile } from "../utils/Files";
import refs from "../refs";
import { extractNames } from "../utils/Fixers";

export const changeEmail = async (email, password, oldEmail) => {

    try {

        const auth = getAuth();
        auth.useDeviceLanguage();

        let result = await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(oldEmail, password) );

        await updateEmail(result.user, email);

        return true;
    }

    catch(error) {
        console.log(error);
        return false;
    }

}

export const resetPassword = async (email) => {
    try { 

        const auth = getAuth();

        await sendPasswordResetEmail(auth, email);

        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

export const upgradePlan = async (plan, reference) => {
    try {
        getAuth();

        let queryBuild = query( refs.users, where("User ID", "==", getAuth().currentUser.uid ) );

        let snapshot = await getDocs( queryBuild );
    
        await Promise.all( snapshot.docs.map( doc => {

            updateDoc(doc.ref, {
                "Plan": plan
            });

        } ));

        queryBuild = query( refs.userPlans, where("User ID", "==", getAuth().currentUser.uid ) );

        snapshot = await getDocs( queryBuild );
    
        await Promise.all( snapshot.docs.map( doc => {

            updateDoc(doc.ref,  {
                "Plan ID": plan,
                "reference": reference,
            });

        } ));

        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

export const updateDetails = async (inputs) => {
    try {
        getAuth();

        let queryBuild = query( refs.users, where("User ID", "==", getAuth().currentUser.uid ) );

        let snapshot = await getDocs( queryBuild );

        let pic = "";

        if(inputs?.pic) {
            pic = await uploadFile(`/users/${inputs.name}_${Math.random() * 10}`, inputs.pic);
        }
    
        await Promise.all( snapshot.docs.map( doc => {

            const { firstname, lastname } = extractNames(inputs.name);

            updateDoc(doc.ref, {
                "First Name": firstname,
                "Last Name": lastname,
                "Mobile Number": inputs.number,
            });

            if(pic.length > 0) {
                updateDoc(doc.ref, {
                    "Pic": pic,
                });
            }

        } ));

        await changeRole(inputs.role);

        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export const changeRole = async (role) => {

    try {

        getAuth();
    
        let plans, queryBuild, snapshot;
    
        if(role == "Professional Handyman") {
            plans = await getDocs( query(refs.userPlans), where("User ID", "==", getAuth().currentUser.uid) );
    
            if(plans.docs.length > 0) {
                queryBuild = query( refs.users, where("User ID", "==", getAuth().currentUser.uid ) );
    
                snapshot = await getDocs( queryBuild );
            
                await Promise.all( snapshot.docs.map( doc => {
    
                    updateDoc(doc.ref, {
                        "Plan": plans.docs[0].data()["Plan ID"]
                    });
    
                } ));
            }
            else {
                plans = await getDocs( query( refs.plans, orderBy("Amount", "desc") ) );
    
                if(plans.docs.length > 0) {
                    queryBuild = query( refs.users, where("User ID", "==", getAuth().currentUser.uid ) );
        
                    snapshot = await getDocs( queryBuild );
                
                    await Promise.all( snapshot.docs.map( doc => {
        
                        updateDoc(doc.ref, {
                            "Plan": plans.docs[0].id
                        });
    
                    } ));
                }
            }
        }
    
        queryBuild = query( refs.users, where("User ID", "==", getAuth().currentUser.uid ) );
    
        snapshot = await getDocs( queryBuild );
    
        await Promise.all( snapshot.docs.map( doc => {
    
            updateDoc(doc.ref, {
                "Role": role
            });
    
        } ));
    
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }

}

export const updateBookingProfile = async (profiledata, admin=false) => {
    try {

        const auth = getAuth();

        let previous = await getDocById("Booking Profile", profiledata.id);

        if(auth.currentUser.uid !== previous["User ID"] && !admin) return false;


        let certificates = previous["Work Experience & Certification"]["Certification"].filter( item => profiledata.certificateUrl.indexOf(item) >= 0);
        let experience   = previous["Work Experience & Certification"]["Experience"].filter( item => profiledata.experienceUrl.indexOf(item) >= 0);


        await updateDoc(doc( db, "Booking Profile", profiledata.id), {
            ...previous,
            "Service Information": {
                ...previous["Service Information"],
                Charge: parseFloat(profiledata?.amount),
                "Charge Rate": profiledata?.chargeRate,
                "Expertise": profiledata?.expertise,
                
            },
            "Work Experience & Certification": {
                ...previous["Work Experience & Certification"],
                "Certification": certificates,
                "Experience": experience,
                "Reference": typeof profiledata?.reference == "undefined" ? [] : profiledata.reference,
            }
        });


        certificates = [];
        experience = [];
        let pic = previous["User Pic"];

        previous = await getDocById("Booking Profile", profiledata.id);

        if(typeof profiledata?.certificate !== "undefined")
        for(let i = 0; i < profiledata.certificate.length; i++) {
            let file = profiledata.certificate[i];
            let path = await uploadFile(`bookingProfile/certificates/${previous["Service Information"]["Service Provided"]}_${i}`, file.file);
            certificates.push(path);
        }

        if(typeof profiledata?.experience !== "undefined")
        for(let i = 0; i < profiledata.experience.length; i++) {
            let file = profiledata.experience[i];
            let path = await uploadFile(`bookingProfile/experience/${previous["Service Information"]["Service Provided"]}_${i}`, file.file);
            experience.push(path);
        }

        if(profiledata.pic) {
            pic = await uploadFile(`bookingProfile/pics/${previous["Service Information"]["Service Provided"]}`, profiledata.pic);
        }

        await updateDoc(doc( db, "Booking Profile", profiledata.id), {
            ...previous,
            "User Pic" : pic,
            "Work Experience & Certification": {
                ...previous["Work Experience & Certification"],
                "Certification": arrayUnion(...certificates),
                "Experience": arrayUnion(...experience),
            }
        });


        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}