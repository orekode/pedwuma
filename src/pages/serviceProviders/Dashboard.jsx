
import { Link, useNavigate } from "react-router-dom";
import { useTotal, useData, getData } from "functions/reads/General";
import { useTotalJobsBetween } from "functions/reads/Jobs";
import { useTotalBookingsBetween, useBookings } from "functions/reads/Bookings";
import { updateAllDocs } from "functions/updates/General";
import { getPast7Days, getHumanReadableDateDifference, readableDate, safeGet, encrypt } from "functions/utils/Fixers";
import { Btn, EmptyBox } from "components";
import { serverTimestamp, where, limit } from "firebase/firestore";

import { LineChart } from '@mui/x-charts/LineChart';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Skeleton } from "@mui/material";

import StatCards from "./dashboard/StatCards";
import { getAuth } from "firebase/auth";


export default function() {

    const navigate = useNavigate();

    const [ dayNames, dayTimestamps ] = getPast7Days();

    let jobsPast7Days = dayTimestamps.map( item => useTotalJobsBetween(item[0], item[1]));
    jobsPast7Days = jobsPast7Days.map( item => typeof(item?.data) == "undefined" ? 0 : item?.data );

    let bookingsPast7Days = dayTimestamps.map( item => useTotalBookingsBetween(item[0], item[1]));
    bookingsPast7Days = bookingsPast7Days.map( item => typeof(item?.data) == "undefined" ? 0 : item?.data );

    const user = getAuth();

    const { data, isLoading, isError } = useData({
        target: "Bookings",
        conditions: [ where("Worker ID", "==", typeof getAuth()?.currentUser?.uid == "undefined" ? "" : getAuth()?.currentUser?.uid), limit(10) ],
        callback: async (booking) => {

            booking.worker = await getData({
                target: "users",
                conditions: [ where("User ID", "==", booking["Requester ID"]) ],
            });

            booking.worker = safeGet(booking.worker, ["0", "0"], {});

            booking.bookingDetails = await getData({
                target: "Booking Profile",
                conditions: [ where("Booking Profile ID", "==", booking["Booking Profile ID"]) ]
            });

            booking.bookingDetails = safeGet(booking.bookingDetails, ["0", "0"], {});

            return booking
        }
    });

    // updateAllDocs("Handyman Jobs Applied", {"Start Date": serverTimestamp() });
    // updateAllDocs("Handyman Jobs Applied", {"End Date":   serverTimestamp() });


    return (
        <section>
            <h1 className="orb font-semibold text-xl">Dashboard</h1>
            
            <StatCards />

            <div className="grid grid-cols-2 max-[800px]:grid-cols-1 gap-3 mt-6">
                <div className="bg-white rounded-md shadow-lg relative">
                    <div className="title absolute top-2 left-2 text font-semibold orb">Bookings For The Last 7 Days</div>
                    <LineChart
                        xAxis={[{ scaleType: 'point', data: dayNames.map(day => day.slice(0,3) ).slice(0, bookingsPast7Days?.length) }]}
                        series={[
                            {
                            data: bookingsPast7Days,
                            },
                        ]}
                        height={300}
                        fullWidth
                    />
                </div>
                <div className="bg-white rounded-md shadow-lg relative">
                    <div className="title absolute top-2 left-2 text font-semibold orb">Jobs For The Last 7 Days</div>
                    <LineChart
                        xAxis={[{ scaleType: 'point', data: dayNames.map(day => day.slice(0,3) ).slice(0, jobsPast7Days?.length) }]}
                        series={[
                            {
                            data: jobsPast7Days,
                            },
                        ]}
                        height={300}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="orb font-semibold mt-6 mb-3">Recent Bookings</h1>
                <Link to="/admin/bookings" className="text-blue-600 underline">View All</Link>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Requester</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Charge</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {typeof(data) != 'undefined' && 
                        data[0]?.map((row) => (
                            <TableRow
                            key={row?.Name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell>
                                <div className="flex items-center font-semibold gap-3">
                                    <div className="h-[60px] w-[60px] rounded shadow overflow-hidden">
                                        <img src={safeGet(row, ["worker", "Pic"], "/images/user.png")} alt="" className="object-cover h-full w-full" />
                                    </div>
                                    {safeGet(row, ["worker", "First Name"], "") + " " + safeGet(row, ["worker", "Last Name"], "")}
                                </div>
                            </TableCell>
                            <TableCell>{safeGet(row, ["bookingDetails", "Service Information", "Service Provided"], "")}</TableCell>
                            
                            <TableCell>Ghc{
                                safeGet(row, ["Charge"], 
                                safeGet(row, ["bookingDetails", "Service Information", "Charge"], ""))} / {safeGet(row, ["Charge Rate"], safeGet(row, ["bookingDetails", "Service Information", "Charge Rate"], ""))}
                            </TableCell>

                            <TableCell>{readableDate(safeGet(row, ["Upload Timestamp"], Object))}</TableCell>

                            <TableCell>
                                <Btn.SmallBtn onClick={() => navigate(`/admin/booking/${encrypt(row.id)}`)}>View Details</Btn.SmallBtn>
                            </TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>

            {!data && Array.from({length: 5}, (item, index) => 
                <Skeleton key={index} height={100} />
            )}

            <EmptyBox load={typeof(data) != 'undefined' && data[0]?.length <= 0} title="No Bookings Yet" text=""/>
        </section>
    );
}