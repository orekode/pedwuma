
import { Link } from "react-router-dom";
import { useTotal, useData } from "functions/reads/General";
import { updateAllDocs } from "functions/updates/General";
import { getPast7Days, getHumanReadableDateDifference, readableDate } from "functions/utils/Fixers";
import { Btn, EmptyBox } from "components";
import { serverTimestamp } from "firebase/firestore";

import { LineChart } from '@mui/x-charts/LineChart';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import StatCards from "./dashboard/StatCards";




export default function() {

    // const [ dayNames, dayTimestamps ] = getPast7Days();

    // let jobsPast7Days = dayTimestamps.map( item => useTotal("Jobs", item[0], item[1]));
    // jobsPast7Days = jobsPast7Days.map( item => typeof(item?.data) == "undefined" ? 0 : item?.data );

    // let bookingsPast7Days = dayTimestamps.map( item => useTotal("Jobs", item[0], item[1]));
    // bookingsPast7Days = bookingsPast7Days.map( item => typeof(item?.data) == "undefined" ? 0 : item?.data );


    // const { data, isLoading, isError } = useData({target: "Jobs"});

    // updateAllDocs("Category", {"Start Date": serverTimestamp() });
    // updateAllDocs("Handyman Jobs Applied", {"End Date":   serverTimestamp() });


    // return (
    //     <section>
    //         <h1 className="orb font-semibold text-xl">Dashboard</h1>
            
    //         <StatCards />

    //         <div className="grid grid-cols-2 max-[800px]:grid-cols-1 gap-3 mt-6">
    //             <div className="bg-white rounded-md shadow-lg relative">
    //                 <div className="title absolute top-2 left-2 text font-semibold orb">Bookings For The Last 7 Days</div>
    //                 <LineChart
    //                     xAxis={[{ scaleType: 'point', data: dayNames.map(day => day.slice(0,3) ).slice(0, bookingsPast7Days?.length) }]}
    //                     series={[
    //                         {
    //                         data: bookingsPast7Days,
    //                         },
    //                     ]}
    //                     height={300}
    //                     fullWidth
    //                 />
    //             </div>
    //             <div className="bg-white rounded-md shadow-lg relative">
    //                 <div className="title absolute top-2 left-2 text font-semibold orb">Jobs For The Last 7 Days</div>
    //                 <LineChart
    //                     xAxis={[{ scaleType: 'point', data: dayNames.map(day => day.slice(0,3) ).slice(0, jobsPast7Days?.length) }]}
    //                     series={[
    //                         {
    //                         data: jobsPast7Days,
    //                         },
    //                     ]}
    //                     height={300}
    //                 />
    //             </div>
    //         </div>

    //         <div className="flex items-center justify-between">
    //             <h1 className="orb font-semibold mt-6 mb-3">Recent Bookings</h1>
    //             <Link className="text-blue-600 underline">View All</Link>
    //         </div>
    //         <TableContainer component={Paper}>
    //             <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //                 <TableHead>
    //                 <TableRow>
    //                     <TableCell>Service Provider</TableCell>
    //                     <TableCell>Start Date</TableCell>
    //                     <TableCell>Duration</TableCell>
    //                     <TableCell>Charge</TableCell>
    //                     <TableCell></TableCell>
    //                 </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                 {typeof(data) != 'undefined' && 
    //                     data[0]?.map((row) => (
    //                         <TableRow
    //                         key={row.name}
    //                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    //                         >
    //                         <TableCell>
    //                             {row.Name}
    //                         </TableCell>
    //                         <TableCell>{readableDate(row["Start Date"])}</TableCell>
    //                         <TableCell>{getHumanReadableDateDifference(row["Start Date"], row["End Date"])}</TableCell>
    //                         <TableCell>Ghc{row["Charge"]} / {row["Charge Rate"]}</TableCell>
    //                         <TableCell>
    //                             <Btn.SmallBtn>View Details</Btn.SmallBtn>
    //                         </TableCell>
    //                         </TableRow>
    //                     ))
    //                 }
    //                 </TableBody>
    //             </Table>
    //         </TableContainer>

    //         <EmptyBox load={typeof(data) != 'undefined' && data[0]?.length <= 0} title="No Bookings Yet" text=""/>
    //     </section>
    // );

    return <>hello</>
}