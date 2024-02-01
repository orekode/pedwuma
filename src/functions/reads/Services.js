
import { useQuery } from "react-query";
import { query, where, and, or, orderBy, startAt, endAt, getDocs } from "firebase/firestore"
import refs from "../refs";
import { safeGet } from "functions/utils/Fixers";

export const useServiceSearch = (searchInput, state="active") => {

    return useQuery(["service search", searchInput, state ], async () => {


        const snapshot = await getDocs(refs.categories);

        let result = snapshot.docs.map( doc => { return { id: doc.id, ...doc.data() } });


        result = result.filter(item => {
            let match = false;

            if(safeGet(item, ["Category Name"], "").toLowerCase().indexOf(searchInput.toLowerCase().slice(0, 6)) >= 0) return true;

            for(let i = 0; i < safeGet(item, ["Services Provided"], []).length; i++) {

                let sub = item["Services Provided"][i];
                let check = sub.toLowerCase().indexOf(searchInput.toLowerCase().slice(0, parseInt(searchInput.length / 2))) >= 0;
                if(check) match = check;
            }

            return match;
        });

            
        return result;

    });
}


export const useServices = (state="active") => {

    return useQuery(["all services", state ], async () => {


        const snapshot = await getDocs(refs.categories);

        const result = snapshot.docs.map( doc => { return { id: doc.id, ...doc.data() } });
    
        return result;

    });
}

export const usePopularServices = () => {

    return useQuery(["popular services"], async () => {

        let services = [];

        const snapshot = await getDocs(refs.categories);

        const result = snapshot.docs.map( doc => { return { id: doc.id, ...doc.data() } });

        
        result.map( item => {
            services = [...services, ...item["Services Provided"]];
        });

        return services;
        
    });

}