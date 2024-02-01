import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getData, useData } from "functions/reads/General";
import { decrypt, safeGet, readableDate } from "functions/utils/Fixers";
import { errorAlert } from "../../functions/utils/Alert";
import { and, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { MapShow, Btn, Loading } from "components";

import { newReview } from "functions/creates/Jobs";

import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { InputAdornment } from "@mui/material";

import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { toggleChat, setChatFocus, setRecipient } from "../../config/general";

export default function () {

    const dispatch = useDispatch();

    const user = getAuth();

    const navigate = useNavigate();

    const { id } = useParams();

    const [load, setLoad] = useState(false);

    const [ review, setReview ] = useState(true);

    const [ reviewInfo, setReviewInfo ] = useState({
        review: "",
        stars: 0,
    })

    const { data, refetch } = useData({
        target: "Bookings",
        conditions: [ and(
                        where("Requester ID", "==", user.currentUser.uid),
                        where("Booking ID", "==", decrypt(id))
                     )
                   ],
        callback: async (booking) => {

            booking.worker = await getData({
                target: "users",
                conditions: [ where("User ID", "==", booking["Worker ID"]) ],
            });

            booking.worker = safeGet(booking.worker, ["0", "0"], {});

            booking.bookingDetails = await getData({
                target: "Booking Profile",
                conditions: [ where("Booking Profile ID", "==", booking["Booking Profile ID"]) ]
            });

            booking.bookingDetails = safeGet(booking.bookingDetails, ["0", "0"], {});

            booking.review = await getData({
                target: "Reviews",
                conditions: [
                    and(
                        where("User ID", "==", user.currentUser.uid),
                        where("Booking Profile ID", "==", booking["Booking Profile ID"]),
                    )
                ]
            })

            booking.review = safeGet(booking.review, ["0"], []);

            return booking
        }
    });

    const status = safeGet(data, ["0", "0", "Booking Status"], "Pending");

    const GiveReview = () => {

        setReview(false);

        if(reviewInfo.review.replaceAll(" ", "").length <= 0) {
            errorAlert({
                title: "Empty Review",
                text: "Please type your review and try again"
            }).then(() => setReview(true));

            return false;
        }

        errorAlert({
            icon: "question",
            title: "Are You Sure",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes, Give Review",

        }).then(result => {
            if (!result.isConfirmed) {
                setReview(true);
                return false;
            }
            setLoad(true);
            newReview({profileId: safeGet(data, ["0", "0", "Booking Profile ID"], ""), ...reviewInfo }).then(result => {
                if (result) {
                    errorAlert({
                        icon: "success",
                        title: "Review Successful"
                    });

                    refetch();

                    setReview(false);
                }
                else {
                    errorAlert({
                        title: "System Busy",
                        text: "system is currently unable to give your review, please try again later"
                    }).then( () => setReview(true));
                }

                setLoad(false);
            })
        })

       
    }

    return (
        <div>

            <Loading load={load} />

            <div className="flex items-center gap-1">
                <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                <h1 className="orb text-lg mb-1">Booking Details</h1>
            </div>

            <div className="mx-auto max-w-[800px] shadow-lg rounded-md p-3">
                <div className="flex gap-2">
                    <div className="w-[150px] h-[150px] rounded-md shadow overflow-hidden">
                        <img src={safeGet(data, ["0", "0", "bookingDetails", "User Pic"], safeGet(data, ["0", "0", "worker", "Pic"], "/images/user.png"))} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="details">
                        <div className="name orb font-semibold">{safeGet(data, ["0", "0", "worker", "First Name"], "") + " " + safeGet(data, ["0", "0", "worker", "Last Name"], "")}</div>
                        <div className="text-sm font-medium text-gray-700 my-1">Contact: {`${safeGet(data, ["0", "0", "worker", "Mobile Number"], "")}`}</div>
                        <div className="text-sm font-medium text-gray-700 my-1">Email: {`${safeGet(data, ["0", "0", "worker", "Email Address"], "")}`}</div>

                        <div className="flex gap-2 items-center max-[550px]:justify-center max-[550px]:text-center">
                            {Array.from({length: safeGet(data, ["0", "0", "bookingDetails", "Work Experience & Certification", "Rating"], 0 )}, (item, index) => <i key={index} className="bi bi-star-fill text-yellow-400" />)}
                            {Array.from({length: 5 - safeGet(data, ["0", "0", "bookingDetails", "Work Experience & Certification", "Rating"], 0)}, (item, index) => <i key={index} className="bi bi-star-fill text-gray-400" />)}
                        </div>

                        <div className="font-semibold orb mt-2">{safeGet(data, ["Service Information", "Service Category"])}</div>
                        <div className="font-semibold orb text-xs mb-2">{safeGet(data, ["Service Information", "Service Provided"])}</div>
                        <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Experience: </span>{safeGet(data, ["0", "0", "bookingDetails", "Service Information", "Expertise"])}</div>
                        <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Charge Rate: </span> Ghc {safeGet(data, ["0", "0", "Charge"], "")} / {safeGet(data, ["0", "0", "Charge Rate"], "")}</div>
                    </div>
                </div>

                <div className="my-4">
                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
                        <span>Service:</span>
                        <span>{safeGet(data, ["0", "0", "bookingDetails", "Service Information", "Service Provided"], "")}</span>
                    </div>

                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
                        <span>Start Date:</span>
                        <span>{safeGet(data, ["0", "0", "Upload Timestamp"]) ? readableDate(safeGet(data, ["0", "0", "Upload Timestamp"])) : ""}</span>
                    </div>

                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
                        <span>Status:</span>
                        <span className={`${status == "Pending" ? "bg-orange-500" : status == "Rejected" ? "bg-red-500" : status == "Completed" ? "bg-cyan-800" : "bg-blue-500"} px-3 py-1.5 rounded-lg text-white`}>{safeGet(data, ["0", "0", "Booking Status"], "Pending")}</span>
                    </div>

                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
                        <span>Location:</span>
                        <span className={``}>{safeGet(data, ["0", "0", "Address"], "")}</span>
                    </div>
                </div>

                <MapShow showInput={false} lat={safeGet(data, ["0", "0", "Latitude"], 0)} lng={safeGet(data, ["0", "0", "Longitude"], 0)}/>

                <div className=" grid grid-cols-1 items-center gap-1 w-full bg-white p-2">
                    <div className="">
                        <Btn.SmallBtn onClick={() => {
                            let user_id = safeGet(data, ["0", "0", "Worker ID"], "");

                            if (user_id <= 0) {
                                errorAlert({
                                    icon: "info",
                                    title: "Poor Internet Connection",
                                    text: "please check your connection and try again"
                                });
                                return false;
                            }

                            dispatch(setRecipient({ "Receiver ID": user_id }));
                            dispatch(setChatFocus("single-chat"));
                            dispatch(toggleChat());
                        }} fullWidth>
                            <span>Chat With Service Worker</span>
                            <i className="bi bi-chat-fill text-xl mx-2 "></i>
                        </Btn.SmallBtn>
                    </div>
                </div>
            </div>



        <Dialog open={review && safeGet(data, ["0", "0", "review"], []).length <= 0 && status == "Completed"} onClose={() => setReview(false)}>
            <DialogTitle>Give A Review For This Job</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Tell us what {safeGet(data, ["0", "0", "worker", "First Name"], "") + " " + safeGet(data, ["0", "0", "worker", "Last Name"], "")} did right handling your job, don't forget to click a star!
            </DialogContentText>
            <div className="my-4 ">
                {Array.from({length: 5}, (item, index) => 
                    <i onClick={() => setReviewInfo({...reviewInfo, stars: (index + 1)})} className={`bi bi-star-fill mr-2 text-4xl ${ (index + 1) <= reviewInfo.stars ? "text-yellow-400" : "text-gray-400"}`}></i>
                )}
            </div>
            <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start"><i className="bi bi-boy-text"></i></InputAdornment>}
                name="service"
                placeholder="Type your message here..."
                sx={{
                    borderColor: 'blue',
                    marginBottom: "1rem"
                }}
                value={reviewInfo.review}
                onChange={(e) => setReviewInfo({ ...reviewInfo, review: e.target.value })}
                size="small"
                multiline
                rows={3}
                fullWidth
            />
            <Btn.SmallBtn onClick={GiveReview} fullWidth>Give Review</Btn.SmallBtn>

            </DialogContent>
            <DialogActions>
            <Button onClick={() => setReview(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>

        </div>
    );
}