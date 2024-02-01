import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { getData, useData } from "functions/reads/General";
import { updateAllDocs } from "functions/updates/General";
import { getPast7Days, getHumanReadableDateDifference, readableDate, safeGet, encrypt } from "functions/utils/Fixers";
import { Btn, EmptyBox } from "components";
import { where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Skeleton } from "@mui/material";




export default function() {

    const user = getAuth();

    const navigate = useNavigate();

    const [ parameters, setParameters ] = useState({
        next: null,
        back: null,
        history: [null],
        index: 0,
    });

    const { data, isLoading, isError } = useData({
        target: "Bookings",

        conditions: [ 
            where("Worker ID", "==", user.currentUser.uid),
        ],

        order: ["Upload Timestamp", "desc"],

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
        },
        next: parameters.next,
    });

    const handleNext = () => {

        let oldHistory = [ ...parameters.history ];
        let oldIndex = parameters.index;
        let nextItem = safeGet(data, ["1"], null);


        if(oldHistory.indexOf(nextItem) < 0) {
            oldHistory = [...parameters.history, nextItem];
            oldIndex++;
        }
        
        setParameters({ ...parameters, history: oldHistory, index: oldIndex, next: nextItem });
        
    }

    const handleBack = () => {

        let oldHistory = [ ...parameters.history ];

        //if index is greater that the length of history list 
        //set to length of history list - 1
        //if index - 1 is less than 0 set to 0
        //else set to index - 1 to get previous element
        let nextIndex = parameters.index >= oldHistory.length ? oldHistory.length - 1 : parameters.index - 1 < 0 ? 0 : parameters.index - 1;

        if(oldHistory.length > 1 ) oldHistory.pop();

        setParameters({ ...parameters, next: parameters.history[nextIndex], history: [...oldHistory], index: nextIndex }); 
    }


    return (
        <section>

            <div className="flex items-center justify-between">
                <h1 className="orb font-semibold mb-3">Bookings</h1>
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

                            <TableCell>{readableDate(safeGet(row, ["Schedule Date"], Object))}</TableCell>

                            <TableCell>
                                <Btn.SmallBtn onClick={() => navigate(`/admin/booking/${encrypt(row.id)}`)}>View Details</Btn.SmallBtn>
                            </TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>

            {!data && Array.from({length: 10}, (item, index) => 
                <Skeleton key={index} height={100} />
            )}

            <EmptyBox load={typeof(data) != 'undefined' && data[0]?.length <= 0} title="No Bookings Yet" text=""/>

            <div className="flex items-center justify-between my-12">
                <Btn.SmallBtn onClick={handleBack}>Back</Btn.SmallBtn>
                <Btn.SmallBtn onClick={handleNext}>Next</Btn.SmallBtn>
            </div>

        </section>
    );

}