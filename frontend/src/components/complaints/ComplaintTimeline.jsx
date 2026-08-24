import {
CheckCircle,
Circle
}
from "lucide-react";


const steps=[

"Complaint Submitted",

"Verified By Admin",

"Assigned To Officer",

"Work In Progress",

"Completed"

];



function ComplaintTimeline(){


return (

<div
className="
space-y-6
"
>


{
steps.map((step,index)=>(


<div
key={step}
className="
flex
gap-4
"
>


<div>

{
index===0
?
<CheckCircle
className="text-green-600"
/>

:

<Circle
className="text-slate-400"
/>

}


</div>



<div>

<h3
className="
font-medium
text-slate-900
"
>

{step}

</h3>


<p
className="
text-sm
text-slate-500
"
>

Status update

</p>


</div>



</div>


))

}


</div>

)

}


export default ComplaintTimeline;