import { doc, addDoc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";

import { ipInfo } from "../utils/Locations";

import refs from "../refs";
import { db } from "../../config/firebase";
import { newNotification } from "./Notifications";



export const newBooking = async (bookingData) => {
    try {

        let location = {};
        const latLng = await ipInfo();


        if( typeof bookingData?.location?.description !== "undefined" && typeof bookingData.location.lat !== "undefined") {

            location.address = bookingData.location.description;
            location.lat = bookingData.location.lat;
            location.lng = bookingData.location.lng;

        }
        else {
            location.address = latLng.location == '' ? bookingData.address : latLng.location;
            location.lat = latLng.lat;
            location.lng = latLng.lng;

        }

        const bookingDate = new Date(bookingData.date);

        console.log(bookingData, location, latLng); //return false;

        const result = await addDoc(refs.bookings, {
            "Accepted Date": null,
            "Completed Date": null,
            "In Progress Date": null,
            
            "Address": location.address,
            "Booking Status": "Pending",
            "Charge": parseFloat(bookingData.charge),
            "Charge Rate": bookingData.chargeRate,
            "Geo Hash": "",
            "Latitude": location.lat,
            "Longitude": location.lng,
            "Note": bookingData.note,
            "Requester ID": bookingData.userId,
            "Schedule Date": Timestamp.fromDate(bookingDate),
            "Upload Timestamp": serverTimestamp(),
            "Worker ID": bookingData.skilledId,
            "Booking Profile ID": bookingData.profileId,
        });

        newNotification({
            sender: bookingData.userId,
            receiver: bookingData.skilledId,
            title: `Booking For Service ${bookingData.service}`,
            content: `You have just been booked for the service ${bookingData.service} at ${bookingData.charge} ${bookingData.chargeRate}, please log into your worker dashboard for further details.`,
            type: "Booking",
        });
    
    
        await updateDoc( doc( db, "Bookings", result.id), {
            "Booking ID": result.id,
            "Jobs Applied ID": bookingData.userId + result.id,
        });

        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }


}