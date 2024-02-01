

import { Cards } from "components";
import { paddNumber } from "functions/utils/Fixers";
import { useTotal, useTotalUserType } from "functions/reads/General";



export default function () {

    const stats = [
        {
            name: 'Total Jobs',
            icon: 'box',
            value: useTotal("Jobs"),

        },
        {
            name: 'Total Bookings',
            icon: 'tag',
            value: useTotal("Jobs"),

        },
        {
            name: 'Total Workers',
            icon: 'person-workspace',
            value: useTotalUserType("Professional Handyman"),

        },
                {
            name: 'Total Employers',
            icon: 'people',
            value: useTotalUserType("Regular Customer"),

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