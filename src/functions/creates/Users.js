import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, updateDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { geohashForLocation } from "geofire-common";

import refs from "../refs";

import { getDocById } from "../reads/General";

import { extractNames } from "../utils/Fixers";
import { uploadFile } from "../utils/Files";
import { ipInfo } from "functions/utils/Locations";


export const newUser = async (userdata) => {

    try {

        const auth = getAuth();
        auth.useDeviceLanguage();
    
        const result = await createUserWithEmailAndPassword(auth, userdata.email, userdata.password);

        const signIn = await signInWithEmailAndPassword(auth, userdata.email, userdata.password);

        sendEmailVerification(auth.currentUser);

        updateProfile(auth.currentUser, {
            displayName: userdata.name,
            phoneNumber: userdata.phone,
        });

        const { firstname, lastname } = extractNames(userdata.name)


        await addDoc(refs.users, {
            "Email Address": userdata.email,
            "First Name": firstname,
            "Last Name": lastname,
            "Mobile Number": userdata.phone,
            Pic: "",
            Plan: userdata.plan,
            Role: userdata.accountType,
            "User ID": auth.currentUser.uid,
            verified: false,
        });

        const latLng = await ipInfo();
        const hash = geohashForLocation([latLng.lat, latLng.lng]);

        await addDoc(refs.location, {
            "Geohash": hash,
            "Longitude": latLng.lng,
            "Latitude": latLng.lat,
            "Address": latLng.location,
            "User ID": auth.currentUser.uid,
        });

        if(userdata.plan !== "noplan") {
            await addDoc(refs.userPlans, {
                "Plan ID": userdata.plan,
                "User ID": auth.currentUser.uid,
                "reference": userdata.reference,
            });
        }

        return true;
    }

    catch(error) {
        console.log(error);
        return false;
    }

}

export const newProfile = async (profiledata) => {
    try {
        const auth = getAuth();

        let certificates = [];
        let experience = [];
        let pic = "";

        for(let i = 0; i < profiledata?.certificate?.length; i++) {
            let file = profiledata.certificate[i];
            let path = await uploadFile(`bookingProfile/certificates/${profiledata.service}_${i}`, file.file);
            certificates.push(path);
        }

        for(let i = 0; i < profiledata?.experience?.length; i++) {
            let file = profiledata.experience[i];
            let path = await uploadFile(`bookingProfile/experience/${profiledata.service}_${i}`, file.file);
            experience.push(path);
        }

        if(profiledata.pic) {
            pic = await uploadFile(`bookingProfile/pics/${profiledata.service}`, profiledata.pic);
        }

        const result = 
            await addDoc(refs.bookingProfiles, {
                Deadline: "",
                "Job Details": {
                    "Applier IDs": [],
                    "People Applied": 0,
                },
                "Service Information": {
                    Charge: parseFloat(profiledata?.amount),
                    "Charge Rate": profiledata?.chargeRate,
                    "Expertise": profiledata?.expertise,
                    "Service Category": profiledata?.category,
                    "Service Provided": profiledata?.service,
                },
                "Upload Timestamp": serverTimestamp(),
                "User ID": auth.currentUser.uid,
                "User Pic": pic,
                "Work Experience & Certification": {
                    "Certification": certificates,
                    "Experience": experience,
                    "Jobs Completed": 0,
                    "Portfolio": [],
                    "Rating": profiledata?.rating,
                    "Reference": typeof profiledata?.reference == "undefined" ? [] : profiledata.reference,
                }
            });

        const docRef = doc( db, "Booking Profile", result.id);


        let justInsertedProfile = await getDocById("Booking Profile", result.id);

        let uploadDate = justInsertedProfile["Upload Timestamp"].toDate();
        uploadDate.setFullYear(uploadDate.getFullYear() + 1);


        await updateDoc(docRef, {
            Deadline: Timestamp.fromDate(uploadDate),
            "Booking Profile ID": result.id
        });

        return result;

    }
    catch(error) {
        console.log(error);
        return false;
    }
}