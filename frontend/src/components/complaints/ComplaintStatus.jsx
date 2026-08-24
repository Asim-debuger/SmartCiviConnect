function ComplaintStatus({
status
}){


const styles={

Pending:
"bg-yellow-100 text-yellow-700",

Verified:
"bg-blue-100 text-blue-700",

Assigned:
"bg-purple-100 text-purple-700",

"In Progress":
"bg-orange-100 text-orange-700",

Completed:
"bg-green-100 text-green-700",

Rejected:
"bg-red-100 text-red-700"

};


return (

<span

className={`
rounded-full
px-3
py-1
text-xs
font-medium

${styles[status]}

`}

>

{status}

</span>

)

}


export default ComplaintStatus;