

import { Cards } from "components";
import { paddNumber } from "functions/utils/Fixers";
import { useTotal, useTotalUserType } from "functions/reads/General";
import { getAuth } from "firebase/auth";
import { Timestamp, where } from "firebase/firestore";

const startDate = Timestamp.fromDate(new Date(0));
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);

export default function () {

    const auth = getAuth();

    const stats = [
        {
            name: 'Total Jobs',
            icon: 'box',
            value: useTotal("Jobs", startDate, endDate, [
                where("Client ID", "==", typeof getAuth()?.currentUser?.uid == "undefined" ? "" : getAuth()?.currentUser?.uid)
            ]),

        },
        {
            name: 'Applications',
            icon: 'people',
            value: useTotal("Applications", startDate, endDate, [
                where("Receiver Id", "==", typeof getAuth()?.currentUser?.uid == "undefined" ? "" : getAuth()?.currentUser?.uid)
            ]),

        },
        {
            name: 'Total Bookings',
            icon: 'tag',
            value: useTotal("Bookings", startDate, endDate, [
                where("Requester ID", "==", typeof getAuth()?.currentUser?.uid == "undefined" ? "" : getAuth()?.currentUser?.uid)
            ])
        },
        {
            name: 'Accepted Bookings',
            icon: 'person-workspace',
            value: useTotal("Bookings", startDate, endDate, [
                where("Requester ID", "==", typeof getAuth()?.currentUser?.uid == "undefined" ? "" : getAuth()?.currentUser?.uid),
                where("Booking Status", "==", "Accepted"),
            ])

        },
    ]

    return (
        <div className="summary grid-box-fit gap-4 my-3" style={{"--width": "230px"}}>

            {stats.map( (item, index) => {
                    return <Cards.Stat key={index} title={item?.name} icon={item?.icon} value={paddNumber(item?.value?.data)} loading={ item?.value?.isLoading || item?.value?.isError } />
                }
            )}

        </div>
    );
}