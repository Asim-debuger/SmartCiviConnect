import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";



import {
    Search,
    Eye,
    FileWarning,
    Navigation,
    RefreshCcw
} from "lucide-react";


import { Link } from "react-router-dom";
import ComplaintDetailsModal from "../../components/citizen/ComplaintDetailsModal";


import {
    getMyComplaints
} from "../../api/complaintApi";





function MyComplaints(){



    const [complaints,setComplaints] = useState([]);


    const [loading,setLoading] = useState(true);


    const [error,setError] = useState("");



    const [search,setSearch] = useState("");



    const [statusFilter,setStatusFilter] = useState("All");



    const [selectedComplaint,setSelectedComplaint] = useState(null);







    /* obsolete loader effect */
    /* useEffect(()=>{


        fetchComplaints();


    },[fetchComplaints]); */







    const fetchComplaints = useCallback(async()=>{


        try{


            setLoading(true);

            setError("");



            const response = await getMyComplaints();
            setComplaints(response?.complaints || []);

        }
        catch(error){


            setError(
                "Unable to load complaints"
            );


        }
        finally{


            setLoading(false);


        }


    },[]);

    useEffect(()=>{
        // Loading remote data is the purpose of this effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchComplaints();
    },[fetchComplaints]);








    const filteredComplaints = useMemo(()=>{


        return complaints.filter((complaint)=>{



            const text = search.toLowerCase();




            const matchesSearch =


            (

                complaint.complaintId || ""

            )

            .toLowerCase()

            .includes(text)



            ||



            (

                complaint.title || ""

            )

            .toLowerCase()

            .includes(text)



            ||



            (

                complaint.category || ""

            )

            .toLowerCase()

            .includes(text);







            const matchesStatus =


            statusFilter === "All"

            ||

            complaint.status === statusFilter;





            return (

                matchesSearch

                &&

                matchesStatus

            );



        });



    },[
        complaints,
        search,
        statusFilter
    ]);










    if(loading){


        return (

            <div className="flex h-64 items-center justify-center">


                <p className="text-lg text-slate-600">

                    Loading complaints...

                </p>


            </div>

        );


    }









    return (

        <div>



            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">


                <div>


                    <h1 className="text-3xl font-bold text-slate-900">

                        My Complaints

                    </h1>


                    <p className="mt-2 text-slate-600">

                        Track all complaints submitted by you.

                    </p>


                </div>






                <button


                    onClick={fetchComplaints}


                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white"


                >

                    <RefreshCcw size={18}/>


                    Refresh


                </button>


            </div>









            {
                error &&


                <div className="mt-5 rounded-lg bg-red-100 p-4 text-red-700">


                    {error}


                </div>


            }









            <div className="mt-8 grid gap-4 rounded-xl bg-white p-5 shadow md:grid-cols-[1fr_220px]">


                <div className="relative">


                    <Search

                        size={20}

                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"

                    />



                    <input


                        type="text"


                        value={search}


                        onChange={(e)=>
                            setSearch(e.target.value)
                        }


                        placeholder="Search complaints..."


                        className="w-full rounded-lg border p-3 pl-12"


                    />


                </div>







                <select


                    value={statusFilter}


                    onChange={(e)=>
                        setStatusFilter(e.target.value)
                    }


                    className="rounded-lg border p-3"


                >


                    <option value="All">
                        All Status
                    </option>


                    <option value="Pending">
                        Pending
                    </option>


                    <option value="Verified">
                        Verified
                    </option>


                    <option value="Assigned">
                        Assigned
                    </option>


                    <option value="In Progress">
                        In Progress
                    </option>


                    <option value="Completed">
                        Completed
                    </option>


                    <option value="Rejected">
                        Rejected
                    </option>


                </select>



            </div>









            <div className="mt-6 space-y-5">



            {
                filteredComplaints.length === 0 ?


                (

                    <div className="rounded-xl bg-white p-12 text-center shadow">


                        <FileWarning

                            size={45}

                            className="mx-auto text-slate-400"

                        />



                        <h2 className="mt-4 text-lg font-semibold">

                            No Complaints Found

                        </h2>


                    </div>

                )

                :


                filteredComplaints.map((complaint)=>(


                    <div


                        key={
                            complaint._id ||
                            complaint.complaintId
                        }


                        className="rounded-xl bg-white p-5 shadow"


                    >



                        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">



                            <div>



                                <span className="text-sm font-semibold text-blue-600">


                                    {
                                        complaint.complaintId ||
                                        complaint._id
                                    }


                                </span>




                                <h3 className="mt-3 text-lg font-semibold">


                                    {
                                        complaint.title
                                    }


                                </h3>





                                <div className="mt-3 text-sm text-slate-500">


                                    <p>

                                    Category:
                                    {" "}
                                    {complaint.category}

                                    </p>



                                    <p>

                                    Status:
                                    {" "}
                                    {complaint.status}

                                    </p>



                                    <p>

                                    Priority:
                                    {" "}
                                    {complaint.priority}

                                    </p>



                                </div>


                            </div>







                            <div className="flex flex-wrap gap-3">


                                <Link
                                    to={`/citizen/complaint/${complaint.complaintId || complaint._id}`}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white"
                                >
                                    <Eye size={18}/>
                                    View
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setSelectedComplaint(complaint)}
                                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2 text-slate-700"
                                >
                                    Quick view
                                </button>
                                <Link
                                    to={`/citizen/tracking/${complaint.complaintId || complaint._id}`}
                                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white"
                                >


                                    <Navigation size={18}/>


                                    Track
                                </Link>



                            </div>




                        </div>




                    </div>


                ))


            }



            </div>








            {
                selectedComplaint &&


                <ComplaintDetailsModal


                    complaint={selectedComplaint}


                    onClose={()=>
                        setSelectedComplaint(null)
                    }


                />


            }



        </div>

    );


}



export default MyComplaints;