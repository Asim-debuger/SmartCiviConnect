import { Link } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";
import { LocationBlock } from "../../utils/formatValue";


function ComplaintCard({
  complaint
}) {


return (

<div
className="
rounded-xl
border
border-slate-200
bg-white
p-5
shadow-sm
transition
hover:shadow-md
"
>


<div className="flex justify-between">


<div>

<h3
className="
text-lg
font-semibold
text-slate-900
"
>

{complaint.title}

</h3>


<p
className="
mt-2
text-sm
text-slate-600
"
>

{complaint.description}

</p>


</div>


<span
className="
rounded-full
bg-yellow-100
px-3
py-1
text-xs
font-medium
text-yellow-700
"
>

{complaint.status}

</span>


</div>



<div
className="
mt-5
flex
flex-wrap
gap-5
text-sm
text-slate-500
"
>


<div className="flex items-center gap-2">
<MapPin size={16}/>
<LocationBlock value={complaint.location} />
</div>



<div className="flex gap-2 items-center">

<CalendarDays size={16}/>

{complaint.date}

</div>


</div>



<Link

to={`/citizen/complaint/${complaint.id}`}

className="
mt-5
inline-block
text-sm
font-medium
text-blue-600
hover:underline
"

>

View Details →

</Link>


</div>

)

}


export default ComplaintCard;