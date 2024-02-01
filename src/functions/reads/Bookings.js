import { useQuery } from "react-query";
import { collection, getDocs, query, where, and, getCountFromServer, orderBy, Timestamp, limit, startAfter } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebase";
import refs from "../refs";


const startDate = Timestamp.fromDate(new Date(0));
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);

export const useTotalBookings = () => {

    const auth = getAuth();

    return useQuery(["pending bookings"], async () => {

        const queryBuild = query( refs.bookings, 
                where("Worker ID", "==", auth.currentUser.uid),
        );

        const snapshot = await getCountFromServer(queryBuild);

        const count = snapshot.data().count;

        return count;

    });
}

export const useTotalBookingsBetween = (start = startDate, end = endDate) => {

    const auth = getAuth();

    return useQuery(["total bookings between", start, end], async () => {

        const queryBuild  =  
            query( refs.bookings , 
                and(
                    where("Upload Timestamp", "<=", end), 
                    where("Upload Timestamp", ">=", start),
                    where("Worker ID", "==", auth.currentUser.uid)
                )
            );
        
        const snapshot = await getCountFromServer(queryBuild);

        const data = snapshot.data().count;

        return data;
    })
}

export const useBookings = (page=1) => {

    const auth = getAuth();

    return useQuery(['bookings', page], async () => {

        const queryBuild = query(refs.bookings, 
            where("Worker ID", "==", auth.currentUser.uid ),
            orderBy("Upload Timestamp", "desc"),
            limit(25)
        );

        const snapshot = await getDocs(queryBuild);
        

        return [
            //filters the result to include the document id
            snapshot.docs.map( (doc) => { return {id: doc.id , ...doc.data()} }), 

            //return the last document for pagination purposes
            snapshot.docs[snapshot.docs.length - 1]
        ]

    })

}

export const useBookingProfiles = ({
    order = ["Upload Date", "desc"],
    next = null,
}) => {

    const auth = getAuth();

    return useQuery(['booking profiles', order, next], async () => {

        let queryBuild;

        if(next)
        queryBuild = query(refs.bookingProfiles, 
            where("User ID", "==", auth.currentUser.uid ),
            orderBy(...order),
            startAfter(next),
            limit(25)
        );
        else
        queryBuild = query(refs.bookingProfiles, 
            where("User ID", "==", auth.currentUser.uid ),
            orderBy(...order),
            limit(25)
        );

        const snapshot = await getDocs(queryBuild);
        

        return [
            //filters the result to include the document id
            snapshot.docs.map( (doc) => { return {id: doc.id , ...doc.data()} }), 

            //return the last document for pagination purposes
            snapshot.docs[snapshot.docs.length - 1]
        ]

    })
}