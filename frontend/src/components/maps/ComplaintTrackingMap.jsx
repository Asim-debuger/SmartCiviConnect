import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "450px",
};


function ComplaintTrackingMap({
  complaintLocation,
  staffLocation,
  directions,
}) {


  const { isLoaded } = useJsApiLoader({

    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY,

  });



  if (!isLoaded) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-xl bg-slate-100">
        Loading Map...
      </div>
    );
  }



  return (

    <GoogleMap

      mapContainerStyle={containerStyle}

      center={complaintLocation}

      zoom={14}

    >


      {/* Complaint Marker */}

      <Marker

        position={complaintLocation}

        label="C"

        title="Complaint Location"

      />



      {/* Staff Current Location */}

      {staffLocation && (

        <Marker

          position={staffLocation}

          label="S"

          title="Staff Current Location"

        />

      )}



      {/* Route */}

      {
        directions && (

          <DirectionsRenderer

            directions={directions}

          />

        )
      }


    </GoogleMap>

  );
}


export default ComplaintTrackingMap;