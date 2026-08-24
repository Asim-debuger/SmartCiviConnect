// import axiosInstance from "./axiosInstance";



// // ===============================
// // CREATE COMPLAINT
// // ===============================

// export const createComplaint = async (complaintData, authToken) => {

//     try {

//         const response = await axiosInstance.post(
//             "/complaints",
//             complaintData,
//             { authToken }
//         );


//         return response.data;


//     } catch (error) {


//         console.error(
//             "Create Complaint Error:",
//             error
//         );


//         throw error;


//     }

// };







// // ===============================
// // GET MY COMPLAINTS
// // ===============================

// export const getMyComplaints = async (authToken) => {


//     try {


//         const response = await axiosInstance.get(
//             "/complaints/my",
//             { authToken }
//         );


//         return response.data;



//     } catch (error) {


//         console.error(
//             "Get Complaints Error:",
//             error
//         );


//         throw error;


//     }


// };








// // ===============================
// // GET SINGLE COMPLAINT
// // ===============================

// export const getComplaintById = async (id, authToken) => {


//     try {


//         const response = await axiosInstance.get(

//             `/complaints/${id}`,
//             { authToken }

//         );


//         return response.data;



//     } catch(error){


//         console.error(
//             "Get Complaint Error:",
//             error
//         );


//         throw error;


//     }


// };









// // ===============================
// // UPDATE COMPLAINT
// // ===============================

// export const updateComplaint = async (
//     id,
//     data,
//     authToken
// )=>{


//     try{


//         const response = await axiosInstance.put(

//             `/complaints/${id}`,

//             data,
//             { authToken }

//         );


//         return response.data;



//     }catch(error){


//         console.error(
//             "Update Complaint Error:",
//             error
//         );


//         throw error;


//     }


// };




















import api from "./axiosInstance";

/**
 * Creates a new complaint.
 * @param {object} complaintData - The details of the complaint.
 */
export const createComplaint = async (complaintData) => {
    const { data } = await api.post("/complaints", complaintData);
    return data;
};

/**
 * Fetches all complaints filed by the currently logged-in user.
 */
export const getMyComplaints = async () => {
    const { data } = await api.get("/complaints/my");
    return data;
};

/**
 * Fetches a single complaint by its ID.
 * @param {string} id - The ID of the complaint.
 */
export const getComplaintById = async (id) => {
    const { data } = await api.get(`/complaints/${id}`);
    return data;
};

/**
 * Updates a complaint, typically for adding a rating or feedback.
 * @param {string} id - The ID of the complaint to update.
 * @param {object} updateData - The data to update (e.g., { rating: 5 }).
 */
export const updateComplaint = async (id, updateData) => {
    const { data } = await api.put(`/complaints/${id}`, updateData);
    return data;
};

export const suggestComplaint = async (text) => {
    const { data } = await api.get("/complaints/suggest", { params: { text } });
    return data;
};

/**
 * [Admin/Officer] Changes the core status of a complaint.
 * @param {string} id - The ID of the complaint.
 * @param {object} statusData - The new status and an optional note (e.g., { status: 'Verified', note: '...' }).
 */
export const changeComplaintStatus = async (id, statusData) => {
    const { data } = await api.patch(`/complaints/${id}/status`, statusData);
    return data;
};
