function Input({
  label,
  type="text",
  placeholder,
  value,
  onChange,
  error
}) {


return (

<div>

<label
className="
mb-2
block
text-sm
font-medium
text-slate-700
"
>

{label}

</label>


<input

type={type}

placeholder={placeholder}

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
focus:ring-2
focus:ring-blue-100
"

/>


{
error &&

<p className="mt-1 text-sm text-red-600">
{error}
</p>

}


</div>

)


}


export default Input;