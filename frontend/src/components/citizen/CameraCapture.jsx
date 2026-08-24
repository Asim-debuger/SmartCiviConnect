import {
  useRef,
  useState,
  useEffect
} from "react";


import {
  Camera,
  X,
  RefreshCcw
} from "lucide-react";



function CameraCapture({

  onCapture

}) {



const videoRef = useRef(null);

const streamRef = useRef(null);



const [cameraOpen,setCameraOpen] =
useState(false);



const [capturedImage,setCapturedImage] =
useState(null);





const startCamera = async()=>{


try{


const stream =
await navigator.mediaDevices.getUserMedia({

video:{
 facingMode:"environment"
},

audio:false

});



streamRef.current = stream;



setCameraOpen(true);



setTimeout(()=>{


if(videoRef.current){


videoRef.current.srcObject = stream;


}


},300);



}

catch(error){


console.log(
"Camera Error:",
error
);


alert(
"Camera permission denied or unavailable"
);


}


};







const capturePhoto = ()=>{


const video =
videoRef.current;



if(
!video ||
video.readyState !== 4
){


alert(
"Camera is not ready yet"
);


return;

}




const canvas =
document.createElement("canvas");



canvas.width =
video.videoWidth;



canvas.height =
video.videoHeight;



const ctx =
canvas.getContext("2d");



ctx.drawImage(

video,

0,

0,

canvas.width,

canvas.height

);






canvas.toBlob(

(blob)=>{


const file =
new File(

[blob],

"camera-photo.jpg",

{
type:"image/jpeg"
}

);



setCapturedImage(
URL.createObjectURL(file)
);



onCapture(file);



},


"image/jpeg"

);



};







const stopCamera=()=>{


if(streamRef.current){


streamRef.current
.getTracks()
.forEach(
(track)=>
track.stop()
);


}



setCameraOpen(false);


};







useEffect(()=>{


return ()=>{


stopCamera();


};


},[]);







return (

<div className="space-y-5">


<h3 className="text-lg font-semibold">

Capture From Camera

</h3>





{
!cameraOpen &&

<button

type="button"

onClick={startCamera}

className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-white"

>


<Camera size={18}/>

Open Camera


</button>

}






{
cameraOpen &&


<div className="space-y-4">



<video

ref={videoRef}

autoPlay

muted

playsInline

className="h-72 w-full rounded-xl bg-black object-cover"

/>





<div className="flex gap-4">



<button

type="button"

onClick={capturePhoto}

className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white"

>


<Camera size={18}/>

Capture


</button>





<button

type="button"

onClick={stopCamera}

className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white"

>


<X size={18}/>

Close


</button>



</div>



</div>

}






{
capturedImage &&


<div className="rounded-xl bg-slate-50 p-4">


<div className="mb-3 flex items-center gap-2">


<RefreshCcw size={18}/>

Captured Image


</div>




<img

src={capturedImage}

className="h-52 w-full rounded-lg object-cover"

/>



</div>


}



</div>

);


}



export default CameraCapture;