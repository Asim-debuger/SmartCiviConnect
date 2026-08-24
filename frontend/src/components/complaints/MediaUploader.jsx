// function MediaUploader(){

// return (

// <div>


// <label
// className="
// mb-2
// block
// font-medium
// text-slate-700
// "
// >

// Upload Images / Videos

// </label>


// <input

// type="file"

// multiple

// accept="image/*,video/*"

// className="
// w-full
// rounded-lg
// border
// border-slate-300
// p-3
// "

//  />


// </div>

// )

// }


// export default MediaUploader;















import {
X,
UploadCloud
}
from "lucide-react";




function MediaUploader({

files,
setFiles

}) {



const handleFiles=(e)=>{

const selected=[
...e.target.files
];

setFiles(selected);

};



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

Upload Images / Videos

</label>



<label
className="
flex
cursor-pointer
flex-col
items-center
justify-center
rounded-xl
border-2
border-dashed
border-slate-300
p-8
hover:bg-slate-50
"
>


<UploadCloud
size={35}
className="text-blue-600"
/>


<p
className="
mt-3
text-sm
text-slate-600
"
>

Click to upload images or videos

</p>



<input

hidden

type="file"

multiple

accept="image/*,video/*"

onChange={handleFiles}

/>


</label>




{
files.length>0 &&

<div
className="
mt-5
space-y-3
"
>

{
files.map((file,index)=>(

<div

key={index}

className="
flex
items-center
justify-between
rounded-lg
bg-slate-100
px-4
py-3
"

>


<p
className="
truncate
text-sm
"
>

{file.name}

</p>



<button

type="button"

onClick={()=>{

setFiles(
files.filter(
(_,i)=>i!==index
)
)

}}

>

<X
size={18}
className="text-red-500"
/>


</button>



</div>


))

}

</div>

}



</div>

)

}


export default MediaUploader;