import { useState } from "react";
import { QueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getData, useData } from "functions/reads/General";
import { setApplicationState } from "functions/edits/Jobs";
import { decrypt, safeGet, readableDate } from "functions/utils/Fixers";
import { newReview } from "functions/creates/Jobs";
import { errorAlert } from "functions/utils/Alert";
import { and, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { InputAdornment } from "@mui/material";

import { MapShow, Btn, Loading } from "components";

import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { toggleChat, setChatFocus, setRecipient } from "../../config/general";

export default function () {

    const dispatch = useDispatch();

    const [load, setLoad] = useState(false);

    const [ review, setReview ] = useState(true);

    const [ reviewInfo, setReviewInfo ] = useState({
        review: "",
        stars: 0,
    })

    const user = getAuth();

    const navigate = useNavigate();

    const queryClient = new QueryClient();

    const { id } = useParams();

    const { data, refetch } = useData({
        target: "Applications",
        conditions: [and(
            where("Receiver Id", "==", user.currentUser.uid),
            where("Application ID", "==", decrypt(id))
        )
        ],
        callback: async (job) => {

            job.worker = await getData({
                target: "users",
                conditions: [where("User ID", "==", job["Applier ID"])],
            });

            job.worker = safeGet(job.worker, ["0", "0"], {});

            job.jobDetails = await getData({
                target: "Jobs",
                conditions: [where("Job ID", "==", job["Job ID"])]
            });

            job.jobDetails = safeGet(job.jobDetails, ["0", "0"], {});

            job.review = await getData({
                target: "Reviews",
                conditions: [
                    and(
                        where("User ID", "==", user.currentUser.uid),
                        where("Booking Profile ID", "==", job["Applier ID"]),
                    )
                ]
            })

            job.review = safeGet(job.review, ["0"], []);


            return job;
        }
    });

    // console.clear();
    console.log(data, decrypt(id));

    const status = safeGet(data, ["0", "0", "Job Status"], "Pending");

    const handleAccept = () => {
        setLoad(true);
        setApplicationState(decrypt(id), "Accepted", safeGet(data, ["0", "0", "Job ID"], "")).then(result => {
            if (result) {
                errorAlert({
                    icon: "success",
                    title: "Apllication Accepted Successfully"
                });

                refetch();
                queryClient.invalidateQueries();
            }
            else {
                errorAlert({
                    title: "System Busy",
                    text: "system is currently unable to accept this application, please try again later"
                });
            }

            setLoad(false);
        })
    }

    const handleReject = () => {

        errorAlert({
            icon: "question",
            title: "Are You Sure",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes, Reject it",

        }).then(result => {
            if (!result.isConfirmed) return false;

            setLoad(true);
            updateById(decrypt(id), "Applications", {
                "Job Status": "Rejected",
            }).then(result => {
                if (result) {
                    errorAlert({
                        icon: "success",
                        title: "Booking Rejected Successfully"
                    });

                    refetch();
                    queryClient.invalidateQueries();
                }
                else {
                    errorAlert({
                        title: "System Busy",
                        text: "system is currently unable to accept this booking, please try again later"
                    });
                }

                setLoad(false);
            })
        })
    }


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
            newReview({profileId: safeGet(data, ["0", "0", "Applier ID"], ""), ...reviewInfo }).then(result => {
                if (result) {
                    errorAlert({
                        icon: "success",
                        title: "Review Successful"
                    });

                    refetch();
                    queryClient.invalidateQueries();

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
                <h1 className="orb text-lg mb-1">Application Details</h1>
            </div>

            <div className="mx-auto max-w-[800px] shadow-lg rounded-md p-3 mb-12">
                <div className="flex gap-2 max-[550px]:block">
                    <div className="w-[150px] h-[150px] rounded-md shadow overflow-hidden">
                        <img src={safeGet(data, ["0", "0", "jobDetails", "User Pic"], safeGet(data, ["0", "0", "worker", "Pic"], "/images/user.png"))} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="details">
                        <div className="name orb font-semibold">{safeGet(data, ["0", "0", "worker", "First Name"], "") + " " + safeGet(data, ["0", "0", "worker", "Last Name"], "")}</div>
                        <div className="text-sm font-medium text-gray-700 my-1">Contact: {`${safeGet(data, ["0", "0", "worker", "Mobile Number"], "")}`}</div>
                        <div className="text-sm font-medium text-gray-700 my-1">Email: {`${safeGet(data, ["0", "0", "worker", "Email Address"], "")}`}</div>

                        <div className="flex gap-2 items-center  max-[550px]:justify-start max-[550px]:text-center">
                            {Array.from({ length: safeGet(data, ["0", "0", "jobDetails", "Work Experience & Certification", "Rating"], 0) }, (item, index) => <i key={index} className="bi bi-star-fill text-yellow-400" />)}
                            {Array.from({ length: 5 - safeGet(data, ["0", "0", "jobDetails", "Work Experience & Certification", "Rating"], 0) }, (item, index) => <i key={index} className="bi bi-star-fill text-gray-400" />)}
                        </div>

                        <div className="font-semibold orb mt-2">{safeGet(data, ["Service Information", "Service Category"])}</div>
                        <div className="font-semibold orb text-xs mb-2">{safeGet(data, ["Service Information", "Service Provided"])}</div>
                        <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Experience: </span>{safeGet(data, ["0", "0", "jobDetails", "Service Information", "Expertise"])}</div>
                        <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Charge Rate: </span> Ghc {safeGet(data, ["0", "0", "Charge"], "")} / {safeGet(data, ["0", "0", "Charge Rate"], "")}</div>
                    </div>
                </div>

                <div className="my-4">
                    <div className="my-2 flex flex-wrap gap-1 items-center font-semibold text-gray-600">
                        <span>Service:</span>
                        <span>{safeGet(data, ["0", "0", "jobDetails", "Service Information", "Service Provided"], "")}</span>
                    </div>

                    <div className="my-2 flex flex-wrap gap-1 items-center font-semibold text-gray-600">
                        <span>Deadline:</span>
                        <span>{safeGet(data, ["0", "0", "jobDetails", "Job Details", "Deadline"]) ? readableDate(safeGet(data, ["0", "0", "jobDetails", "Job Details", "Deadline"])) : ""}</span>
                    </div>

                    <div className="my-2 flex flex-wrap gap-1 items-center font-semibold text-gray-600">
                        <span>Status:</span>
                        <span className={`${status == "Pending" ? "bg-orange-500" : status == "Rejected" ? "bg-red-500" : status == "Completed" ? "bg-cyan-800" : "bg-blue-500"} px-3 py-1.5 rounded-lg text-white`}>{safeGet(data, ["0", "0", "Job Status"], "Pending")}</span>
                    </div>

                    <div className="my-2 flex flex-wrap gap-1 items-center font-semibold text-gray-600">
                        <span>Location:</span>
                        <span className={``}>{safeGet(data, ["0", "0", "jobDetails", "Address"], "")}</span>
                    </div>

                    {safeGet(data, ["0", "0", "Note"], "").length > 0 &&
                        <div className="my-2 font-semibold text-gray-600">
                            <div>Application Note:</div>
                            <p className={`font-normal`}>{safeGet(data, ["0", "0", "Note"], "")}</p>
                        </div>
                    }

                    <div className="flex flex-wrap gap-2">
                        {safeGet(data, ["0", "0", "Portfolio"], "").length > 0 &&
                            <div className="my-2 font-semibold text-gray-600">
                                <a target="_blank" href={safeGet(data, ["0", "0", "Portfolio"], ["https://pedwuma.com"])[0]} className={``}><Btn.SmallBtn>Application Document</Btn.SmallBtn></a>
                            </div>
                        }

                        {safeGet(data, ["0", "0", "Reference Links"], "").length > 0 &&
                            <div className="my-2 flex flex-wrap gap-1 items-center font-semibold text-gray-600">
                                <a target="_blank" href={safeGet(data, ["0", "0", "Reference Links"], ["https://pedwuma.com"])[0]} className={``}>
                                    <Btn.SmallBtn>Application Reference</Btn.SmallBtn>
                                </a>
                            </div>
                        }
                    </div>


                </div>

                <MapShow showInput={false} lat={safeGet(data, ["0", "0", "jobDetails", "Latitude"], 0)} lng={safeGet(data, ["0", "0", "jobDetails", "Longitude"], 0)} />

                <div className=" grid grid-cols-1 items-center gap-1 w-full bg-white p-2">
                    <div className="">
                        <Btn.SmallBtn onClick={() => {
                            let user_id = safeGet(data, ["0", "0", "Applier ID"], "");

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


            {(safeGet(data, ["0", "0", "Job Status"]) && status == "Pending") &&

                <div className=" grid grid-cols-5 items-center gap-1 absolute bottom-0 left-0 w-full bg-white p-2">
                    <div className="col-span-4 max-[500px]:col-span-3">
                        <Btn.SmallBtn onClick={handleAccept} fullWidth>Accept</Btn.SmallBtn>
                    </div>
                    <div className="col-span-1 max-[500px]:col-span-2">
                        <Btn.SmallBtn onClick={handleReject} style={{ background: "whitesmoke", color: "red", border: "red 2px solid", }} fullWidth>Reject</Btn.SmallBtn>
                    </div>
                </div>
            }




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