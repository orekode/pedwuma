import { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';

import { useParams, useNavigate } from "react-router-dom";

import { useDocById } from "functions/reads/General";

import { safeGet } from "functions/utils/Fixers";

export default function () {

    const { id } = useParams();

    const { data } = useDocById("users", id);

    const [ focus, setFocus ] = useState("User");

    const navigate = useNavigate();


    return (
        <div>

            <div className="flex items-center gap-1">
                <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                <h1 className="orb text-lg mb-1">User</h1>
            </div>

            <div className="mx-auto h-[200px] w-[200px] rounded-full overflow-hidden border shadow">
                <img src={safeGet(data, ["Pic"], "/images/user.png")} className="object-cover h-full w-full" />
            </div>
            <div className="font-semibold text-lg orb text-center">{`${safeGet(data, ["First Name"], "")} ${safeGet(data, ["Last Name"], "")}`}</div>
            <div className="text-sm mb-2 flex flex-row flex-wrap text-center justify-center items-center gap-2">
                <div className="my-1 text-gray-700 font-semibold whitespace-nowrap"><span className="text-xs font-light capitalize">role: </span>{safeGet(data, ["Role"], "")},</div>
                <div className="my-1 text-gray-700 font-semibold whitespace-nowrap"><span className="text-xs font-light capitalize">email: </span>{safeGet(data, ["Email Address"], "")},</div>
                <div className="my-1 text-gray-700 font-semibold whitespace-nowrap"><span className="text-xs font-light capitalize">contact: </span>{safeGet(data, ["Mobile Number"], "")}</div>
            </div>

            <div className="mx-auto w-max rounded-lg overflow-hidden shadow border">
                <Box sx={{ width: 500 }}>
                    <BottomNavigation
                        showLabels
                        value={focus}
                        onChange={(event, newValue) => {
                            setFocus(newValue);
                        }}
                    >
                        <BottomNavigationAction value="User" label="Booking Profiles" icon={<i className="bi bi-person font-semibold" />} />
                        <BottomNavigationAction value="User's Bookings" label="User's Bookings" icon={<i className="bi bi-ticket font-semibold" />} />
                        <BottomNavigationAction value="User's Jobs" label="User's Jobs" icon={<i className="bi bi-box font-semibold " />} />
                    </BottomNavigation>
                </Box>
            </div>
        </div>
    );
}