const categories=[

"Road Damage",
"Potholes",
"Garbage",
"Drainage Problems",
"Water Leakage",
"Street Light Problems",
"Electricity Problems",
"Sewage Issues",
"Traffic Problems",
"Other"

];


function CategorySelector({
value,
onChange
}){


return (

<div>


<label
className="
mb-2
block
font-medium
text-slate-700
"
>

Complaint Category

</label>



<select

value={value}

onChange={onChange}

className="
w-full
rounded-lg
border
border-slate-300
px-4
py-3
outline-none
focus:border-blue-600
"

>


<option value="">
Select Category
</option>


{
categories.map((cat)=>(

<option
key={cat}
value={cat}
>

{cat}

</option>

))

}


</select>


</div>

)

}


export default CategorySelector;