
import { useQuery } from "react-query";
import { collection, doc, getDoc, getDocs, getCountFromServer, Timestamp, query, where, and, or, orderBy, limit, startAfter, startAt, endAt } from "firebase/firestore";
import { db } from "../../config/firebase";
import refs from "../refs";
import { geohashQueryBounds } from "geofire-common";


const startDate = Timestamp.fromDate(new Date(0));
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);


export const getDocById = async (target, id) => {

    try {
        
        const planRef = doc(db, target, id);
 
        

        const snapshot = await getDoc(planRef);
    
        if(snapshot.exists()) return snapshot.data();
    
        else return "not_exists";

    }
    catch( error ) {
        console.log(error);
        return false;
    }

}

export const useDocById = (target, id, callback=()=>{}) => {

    return useQuery([ "getDoc", target, id ], async () => {
        const result = await getDocById(target, id);

        return result;
    }, {onCompleted: (data) => callback(data)});
}

export const useTotal = (target="", start = startDate, end = endDate, conditions=[]) => {

    return useQuery(["total", target, start, end], async () => {

        const queryBuild  =  
            query( collection(db, target) , 
                and(
                    where("Upload Timestamp", "<=", end), 
                    where("Upload Timestamp", ">=", start),
                    ...conditions
                ),
            );
        
        const snapshot = await getCountFromServer(queryBuild);

        const data = snapshot.data().count;

        return data;
    })
}

export const useData = ({
    target="", 
    page = null, 
    start = startDate, 
    end = endDate, 
    conditions=[
        and(
            where("Upload Date", "<=", end), 
            where("Upload Date", ">=", start)
        )
    ],
    callback = null,
    next = null,
    order = ["Upload Date", "asc"]
}) => {
    return useQuery(["data", target, page, start, end, conditions, callback, next], async () => {

        page = page == 1 ? null : page;

        let queryBuild;

        if(next)
        queryBuild  =  
            query( collection(db, target) , 
                ...conditions,
                orderBy(...order),
                startAfter(next),
                limit(35),
            );
        else
        queryBuild  =  
            query( collection(db, target) , 
                ...conditions,
                orderBy(...order),
                limit(35),
            );

        const snapshot = await getDocs(queryBuild);
        
        let result = snapshot.docs.map( (doc) => { return {id: doc.id , ...doc.data()} });

        if(callback) 

        for( let i = 0; i < result.length; i++ ) {
            let data = result[i];

            data = await callback(data);

            result[i] = data;
        }

        return [
            //filters the result to include the document id
            result, 

            //return the last document for pagination purposes
            snapshot.docs[snapshot.docs.length - 1]
        ]

    });
}

export const useLocationData = async ({ target, lat, lng, conditions, page=1, callback }) => {

    return useQuery(["data by loc", target, page, conditions, callback], async () => {

        const bounds = geohashQueryBounds([lat, lng], 637100000);

        const promises = [];

        for (const b of bounds) {
            const q = query(
            collection(db, target),
            ...conditions,
            orderBy('Geohash'), 
            startAt(b[0]), 
            endAt(b[1]));
        
            promises.push(getDocs(q));
        }

        const snapshots = await Promise.all(promises);

        const result = [];
        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                
                result.push({id: doc.id, ...doc.data()});
                
            }
        }

        if(callback) 
        for( let i = 0; i < result.length; i++ ) {
            let data = result[i];

            data = await callback(data);

            result[i] = data;
        }

        return result;
    });
      
}

export const getData = async ({
    target="", 
    page = null, 
    start = startDate, 
    end = endDate, 
    conditions=[
        and(
            where("Upload Timestamp", "<=", end), 
            where("Upload Timestamp", ">=", start)
        ),
        orderBy("Upload Timestamp", "desc"),
        limit(35)
    ],
    callback = null
}) => {
    

        page = page == 1 ? null : page;

        const queryBuild  =  
            query( collection(db, target) , 
                ...conditions
            );

        const snapshot = await getDocs(queryBuild);
        
        let result = snapshot.docs.map( (doc) => { return {id: doc.id , ...doc.data()} });

        if(callback) 

        for( let i = 0; i < result.length; i++ ) {
            let data = result[i];

            data = await callback(data);

            result[i] = data;
        }

        return [
            //filters the result to include the document id
            result, 

            //return the last document for pagination purposes
            snapshot.docs[snapshot.docs.length - 1]
        ]

}

export const useTotalUserType = (type) => {

    return useQuery(["total", type], async () => {

        const queryBuild    = query( refs.users, where("Role", "==", type));
        const snapshot      = await getCountFromServer(queryBuild);

        const data = snapshot.data().count;

        return data;
    })

}

export const useLocationSearch = (userInput) => {
    return useQuery(["location_search", userInput], async () => {
        let result = [];

        try {
          const autocomplete = new window.google.maps.places.AutocompleteService();
        
          await autocomplete.getPlacePredictions(
            {
              input: userInput,
              componentRestrictions: { country: 'GH' }, // Restrict to Ghana
              types: ["geocode"]
            },
            async (predictions, status) => {
                result = predictions;

                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    // Now, for each prediction, fetch place details to get lat/lng
                    const placeService = new window.google.maps.places.PlacesService(document.createElement("div"));
                    const promises = predictions.map((prediction) => {
                    return new Promise((resolve) => {
                        placeService.getDetails(
                        { placeId: prediction.place_id },
                        (place, placeStatus) => {
                            if (placeStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                            // Add lat/lng to the prediction
                            prediction.lat = place.geometry.location.lat();
                            prediction.lng = place.geometry.location.lng();
                            }
                            resolve();
                        }
                        );
                    });
                    });
            
                    // Wait for all place details requests to complete
                    await Promise.all(promises);
            
              }
            }
          );
        
          return result;
        } catch (error) {
          return result;
        }

    });
};

export const useLocationDetails = (prediction) => {

    return useQuery(["location_details", prediction], async () => {

        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    
        await placesService.getDetails({ placeId: prediction.place_id }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            prediction.lat = place.geometry.location.lat();
            prediction.lng = place.geometry.location.lng();
          }
        });

        return prediction;

    });

};

export const userExists = async (email, phone) => {

    const queryBuild = 
        query( refs.users, 
            or(
                where("Email Address", "==", email?.replaceAll(" ", "")), 
                where("Mobile Number", "==", phone?.replaceAll(" ", "")),
            )
        );


    const snapshot = await getCountFromServer(queryBuild);

    const count = snapshot.data().count;

    if (count > 0) return true;

    return false;
}



