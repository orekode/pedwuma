import { doc, addDoc, updateDoc, serverTimestamp, Timestamp, arrayUnion, getDoc, increment } from "firebase/firestore"
import refs from "../refs"
import { db } from "../../config/firebase";
import { uploadFile } from "functions/utils/Files";
import { ipInfo } from "functions/utils/Locations";
import { getDocById } from "functions/reads/General";
import { geohashForLocation } from "geofire-common";
import { getAuth } from "firebase/auth";
import { newNotification } from "./Notifications";

export const newJob = async (jobInputs) => {

    try {

        let location = {};
        const latLng = await ipInfo();

        const date = new Date(jobInputs.date);

        if( typeof jobInputs?.location?.description !== "undefined" && typeof jobInputs?.location?.lat !== "undefined") {

            location.address = jobInputs.location.description;
            location.lat = jobInputs.location.lat;
            location.lng = jobInputs.location.lng;

        }
        else {
            location.address = latLng.location == '' ? jobInputs.address : latLng.location;
            location.lat = latLng.lat;
            location.lng = latLng.lng;
        }

        const hash = geohashForLocation([location.lat, location.lng]);

        const result = await addDoc(refs.jobs, {
            "Client ID": jobInputs.id,
            "Geohash": hash,
            "Address": location.address,
            "Latitude": location.lat,
            "Longitude": location.lng,
            "Job Details": {
                "title": jobInputs.title,
                "description": jobInputs.desc,
                "Applier IDs": [],
                "Deadline": Timestamp.fromDate(date),
                "Job Status": "Pending",
                "People Applied": 0,
            },
            "Job ID": "",
            "Optional": {
                "Portfolio Present": false,
                "References Present": false,
            },
            "Seen By": jobInputs.seenBy,
            "Service Information": {
                "Charge": parseFloat(jobInputs.amount),
                "Charge Rate": jobInputs.chargeRate,
                "Expertise": jobInputs.expertise,
                "Service Category": jobInputs.category,
                "Service Provided": jobInputs.service,
            },
            "Upload Timestamp": serverTimestamp(),
            "Work Detail & Rating": {
                "Portfolio": [],
                "Rating": 0,
            }
        });

        newNotification({
            sender: jobInputs.id,
            receiver: jobInputs.service,
            title: `New Job For Service ${jobInputs.service}`,
            content: `A requester is looking for someone to render the service ${jobInputs.service} at ${jobInputs.amount} ${jobInputs.chargeRate}, click the link bellow for further details.`,
            link: ``,
            type: "Booking",
        });
    
        await updateDoc( doc( db, "Jobs", result.id), {
            "Job ID": result.id,
        });
    
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }

}

export const newApplication = async (inputs) => {

    try {

        const date = new Date(inputs.date);
    
        const result = await addDoc(refs.applications, {
            "Accepted Date": null,
            "Applier ID": inputs.id,
            "Charge": inputs.charge,
            "Charge Rate": inputs.chargeRate,
            "Completed Date": null,
            "Job ID": inputs.jobId,
            "Job Status": "Pending",
            "Jobs Applied ID": "",
            "Note": inputs.note,
            "Receiver Id": inputs.receiver,
            "Reference Links": inputs.link,
            "Portfolio": [],
            "Schedule Date": Timestamp.fromDate(date),
            "Upload Timestamp": serverTimestamp(),
        });
    
        await updateDoc( doc( db, "Applications", result.id) , {
            "Jobs Applied ID": result.id + inputs.id,
            "Application ID": result.id,
        });

        if(inputs.portfolio) {
            const portfolio = await uploadFile("/JobPortfolio/job", inputs.portfolio);

            await updateDoc( doc(db, "Applications", result.id) , {
                "Portfolio": [portfolio],
            });
        }

        const job = await getDocById("Jobs", inputs.jobId);

        await updateDoc ( doc( db, "Jobs", inputs.jobId ), {
            "Job Details": {
                ...job["Job Details"],
                "Applier IDs": arrayUnion(inputs.jobId),
                "People Applied": increment(1)
            }
        });
    
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }

}

export const newReview = async (review) => {
    try {

        getAuth().currentUser;

        const result = await addDoc( refs.reviews , {
            "Booking Profile ID": review.profileId,
            "Comment": review.review,
            "Review Date": serverTimestamp(),
            "User ID": getAuth().currentUser.uid,
            "Likes": 0,
            "Replies": [],
            "Stars": review.stars,
        });

        updateDoc( doc( db, "Reviews", result.id), {
            "Review ID": result.id,
        });

        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}