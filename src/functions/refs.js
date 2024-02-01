import { collection } from "firebase/firestore";
import { db } from "../config/firebase";



export const users              = collection(db, "users");
export const userPlans          = collection(db, "User Plans");
export const location           = collection(db, "Location");
export const plans              = collection(db, "Plans");
export const applications       = collection(db, "Applications");
export const bookings           = collection(db, "Bookings");
export const bookingProfiles    = collection(db, "Booking Profile");
export const categories         = collection(db, "Category");
export const jobs               = collection(db, "Jobs");
export const reviews            = collection(db, "Reviews");
export const notifications      = collection(db, "Notifications");

export default {
    users,
    userPlans,
    location,
    plans,
    applications,
    bookings,
    bookingProfiles,
    categories,
    jobs,
    reviews,
    notifications
};
