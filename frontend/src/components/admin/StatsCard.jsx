function StatsCard({

title,

value,

icon:Icon

}){


return (

<div

className="
rounded-xl
bg-white
p-6
shadow-sm
"

>


<div
className="
flex
items-center
gap-4
"
>


<div

className="
rounded-lg
bg-blue-50
p-3
text-blue-600
"

>

<Icon/>

</div>



<div>


<p

className="
text-sm
text-slate-500
"

>

{title}

</p>



<h2

className="
text-3xl
font-bold
"

>

{value}

</h2>



</div>



</div>



</div>

)

}


export default StatsCard;