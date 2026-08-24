const priorities=[
"Low",
"Medium",
"High",
"Emergency"
];


function PrioritySelector({
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

Priority

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
"

>


<option value="">
Select Priority
</option>


{
priorities.map((item)=>(

<option
key={item}
value={item}
>

{item}

</option>

))

}


</select>


</div>

)

}


export default PrioritySelector;