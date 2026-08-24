function SuccessModal({
complaintId,
close
}){


return (

<div
className="
fixed
inset-0
flex
items-center
justify-center
bg-black/40
"
>


<div
className="
rounded-xl
bg-white
p-8
text-center
shadow-xl
"
>


<h2
className="
text-2xl
font-bold
text-green-600
"
>

Complaint Submitted

</h2>



<p
className="
mt-4
text-slate-600
"
>

Your Complaint ID

</p>



<p
className="
mt-2
text-xl
font-bold
"
>

{complaintId}

</p>



<button

onClick={close}

className="
mt-6
rounded-lg
bg-blue-600
px-5
py-2
text-white
"

>

Continue

</button>



</div>


</div>

)

}


export default SuccessModal;