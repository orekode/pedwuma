import { useState } from "react";
import { QueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getData, useData } from "functions/reads/General";
import { decrypt, safeGet, readableDate } from "functions/utils/Fixers";
import { errorAlert } from "functions/utils/Alert";
import { setApplicationState } from "functions/edits/Jobs"
import { and, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { MapShow, Btn, Loading } from "components";

import { useDispatch } from "react-redux";
import { toggleChat, setChatFocus, setRecipient } from "../../config/general";

export default function () {

    const [ load, setLoad ] = useState(false);

    const dispatch = useDispatch();

    const user = getAuth();

    const navigate = useNavigate();

    const queryClient = new QueryClient();

    const { id } = useParams();

    const { data, refetch } = useData({
        target: "Applications",
        conditions: [ and(
                        where("Application ID", "==", decrypt(id))
                      )
                   ],
        callback: async (job) => {

            job.worker = await getData({
                target: "users",
                conditions: [ where("User ID", "==", job["Receiver Id"]) ],
            });

            job.worker = safeGet(job.worker, ["0", "0"], {});

            job.jobDetails = await getData({
                target: "Jobs",
                conditions: [ where("Job ID", "==", job["Job ID"]) ]
            });

            job.jobDetails = safeGet(job.jobDetails, ["0", "0"], {});

            return job;
        }
    });

    // console.clear();y
    console.log(data, decrypt(id));

    const status = safeGet(data, ["0", "0", "Job Status"], "Pending");

    const handleCompleted = () => {
        setLoad(true);
        setApplicationState(decrypt(id), "Completed", safeGet(data, ["0", "0", "Job ID"], "")).then( result => {
            if(result) {
                errorAlert({
                    icon: "success",
                    title: "Job Completed Successfully"
                });

                refetch();
                queryClient.invalidateQueries();
            }
            else {
                errorAlert({
                    title: "System Busy",
                    text: "system is currently unable to complete this job, please try again later"
                });
            }

            setLoad(false);
        })
    }

    return (
        <div>
            <Loading load={load} />

            <div className="flex items-center gap-1">
                <i onClick={() => navigate(-1)} className="bi bi-chevron-left bg-blue-500 text-white h-[30px] w-[30px] rounded-md flex items-center justify-center"></i>
                <h1 className="orb text-lg mb-1">Job Details</h1>
            </div>

            <div className="mx-auto max-w-[800px] shadow-lg rounded-md p-3 mb-12">
                <div className="flex gap-2">
                    <div className="w-[150px] h-[150px] rounded-md shadow overflow-hidden">
                        <img src={safeGet(data, ["0", "0", "jobDetails", "User Pic"], safeGet(data, ["0", "0", "worker", "Pic"], "/images/user.png"))} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="details">
                        <div className="name orb font-semibold">{safeGet(data, ["0", "0", "worker", "First Name"], "") + " " + safeGet(data, ["0", "0", "worker", "Last Name"], "")}</div>
                        <div className="text-sm font-medium text-gray-700 my-1">Contact: {`${safeGet(data, ["0", "0", "worker", "Mobile Number"], "")}`}</div>
                        <div className="text-sm font-medium text-gray-700 my-1">Email: {`${safeGet(data, ["0", "0", "worker", "Email Address"], "")}`}</div>

                        <div className="flex gap-2 items-center max-[550px]:justify-center max-[550px]:text-center">
                            {Array.from({length: safeGet(data, ["0", "0", "jobDetails", "Work Experience & Certification", "Rating"], 0 )}, (item, index) => <i key={index} className="bi bi-star-fill text-yellow-400" />)}
                            {Array.from({length: 5 - safeGet(data, ["0", "0", "jobDetails", "Work Experience & Certification", "Rating"], 0)}, (item, index) => <i key={index} className="bi bi-star-fill text-gray-400" />)}
                        </div>

                        <div className="font-semibold orb mt-2">{safeGet(data, ["Service Information", "Service Category"])}</div>
                        <div className="font-semibold orb text-xs mb-2">{safeGet(data, ["Service Information", "Service Provided"])}</div>
                        <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Experience: </span>{safeGet(data, ["0", "0", "jobDetails", "Service Information", "Expertise"])}</div>
                        <div className="text-sm p-05 text-gray-500"> <span className="font-semibold text-xs">Charge Rate: </span> Ghc {safeGet(data, ["0", "0", "Charge"], "")} / {safeGet(data, ["0", "0", "Charge Rate"], "")}</div>
                    </div>
                </div>

                <div className="my-4">
                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
                        <span>Service:</span>
                        <span>{safeGet(data, ["0", "0", "jobDetails", "Service Information", "Service Provided"], "")}</span>
                    </div>

                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
                        <span>Deadline:</span>
                        <span>{safeGet(data, ["0", "0", "jobDetails", "Job Details", "Deadline"]) ? readableDate(safeGet(data, ["0", "0", "jobDetails", "Job Details", "Deadline"])) : ""}</span>
                    </div>

                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
                        <span>Status:</span>
                        <span className={`${status == "Pending" ? "bg-orange-500" : status == "Rejected" ? "bg-red-500" : status == "Completed" ? "bg-cyan-800" : "bg-blue-500"} px-3 py-1.5 rounded-lg text-white`}>{safeGet(data, ["0", "0", "Job Status"], "Pending")}</span>
                    </div>

                    <div className="my-1 flex gap-2 items-center font-semibold text-gray-600">
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
                                <a target="_blank" href={safeGet(data, ["0", "0", "Portfolio"], ["https://pedwuma.com"])[0]} className={``}><Btn.SmallBtn >Application Document</Btn.SmallBtn></a>
                            </div>
                        }

                        {safeGet(data, ["0", "0", "Reference Links"], "").length > 0 && 
                            <div className="my-2 flex flex-wrap gap-1 items-center font-semibold text-gray-600">
                                <a target="_blank" href={safeGet(data, ["0", "0", "Reference Links"], ["https://pedwuma.com"])[0]} className={``}>
                                    <Btn.SmallBtn >Application Reference</Btn.SmallBtn>
                                </a>
                            </div>
                        }
                    </div>
                </div>

                <MapShow showInput={false} lat={safeGet(data, ["0", "0", "jobDetails", "Latitude"], 0)} lng={safeGet(data, ["0", "0", "jobDetails", "Longitude"], 0)}/>

                {(safeGet(data, ["0", "0", "Job Status"]) && status !== "Pending" && status !== "Rejected" ) &&

                    <div className=" grid grid-cols-1 items-center gap-1 w-full bg-white p-2">
                        <div className="">
                            <Btn.SmallBtn onClick={() => {
                                let user_id = safeGet(data, ["0", "0", "Receiver Id"], "");

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
                                <span>Chat With Requester</span>
                                <i className="bi bi-chat-fill text-xl mx-2 "></i>
                            </Btn.SmallBtn>
                        </div>
                    </div>
                }

            </div>

            {(safeGet(data, ["0", "0", "Job Status"]) && status !== "Pending" && status !== "Rejected" && status !== "Completed" ) &&
                
                <div className=" grid grid-cols-1 items-center gap-1 absolute bottom-0 left-0 w-full bg-white p-2">
                    <div className="">
                        <Btn.SmallBtn onClick={handleCompleted} fullWidth>
                            <span>Complete Job</span>
                            <i className="bi bi-boxes text-xl mx-2 "></i>
                        </Btn.SmallBtn>
                    </div>
                </div>
            }

        </div>
    );
}