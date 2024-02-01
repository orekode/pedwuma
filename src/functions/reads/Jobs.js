import { useQuery } from "react-query";
import { collection, getDocs, query, where, and, getCountFromServer, Timestamp, startAt, endAt } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebase";
import refs from "../refs";
import { geohashQueryBounds } from "geofire-common";


const startDate = Timestamp.fromDate(new Date(0));
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);

export const useJobs = (page=1) => {
    return useQuery(["jobs", page], async () => {
        const jobsCollection = db.collection("Customer Job Upload");
        const snapshot = await jobsCollection.get();

        const jobs = [];
        snapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
        });

        return jobs;
    })
}




export const useTotalJobsByStatus = (status="Applied") => {

    const auth = getAuth();

    return useQuery(["total jobs", status], async () => {

        const queryBuild = query( refs.applications, 
            and( 
                where("Applier ID", "==", auth.currentUser.uid),
                where("Job Status", "==", status)
            ) 
        );

        const snapshot = await getCountFromServer(queryBuild);

        const count = snapshot.data().count;

        return count;

    });
}

export const useTotalJobsBetween = (start = startDate, end = endDate) => {

    const auth = getAuth();

    return useQuery(["total jobs between", start, end], async () => {

        const queryBuild  =  
            query( refs.applications , 
                and(
                    where("Upload Timestamp", "<=", end), 
                    where("Upload Timestamp", ">=", start),
                    where("Applier ID", "==", auth.currentUser.uid)
                )
            );
        
        const snapshot = await getCountFromServer(queryBuild);

        const data = snapshot.data().count;

        return data;
    })
}

export const useTotalApplications = () => {

    const auth = getAuth();

    return useQuery(["total applications"], async () => {

        const queryBuild = query( refs.applications, where("Applier ID", "==", auth.currentUser.uid) );

        const snapshot = await getCountFromServer(queryBuild);

        const count = snapshot.data().count;

        return count;

    });
}