import React, { useState } from "react";
import { Button } from "../ui/button";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { FcGoogle } from "react-icons/fc";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import { toast } from "sonner";
import { generateTravelPlan } from "../../services/AiModal"// ✅ import the helper
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from "axios";

import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const[openDialouge , setOpenDialouge]= useState(false);
  const [travelPlan, setTravelPlan] = useState(null); 
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const [formdata, setFormData] = useState({
    destination: "",
    days: "", 
    budget: "",
    travelWith: "",
  });

  const [autoCompleteKey, setAutoCompleteKey] = useState(0);

  // ✅ handle destination selection
  const handlePlaceSelect = (value) => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        destination: value.properties.formatted, // full address/city name
      }));
    }
  };

  // ✅ handle text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Login =useGoogleLogin({
    onSuccess: (response)=>{
      console.log(response);
      GetUserProfile(response);  
    },
    onerror: (error)=> console.log(error)
  });

  const handleSubmit = async() => {
   const user= localStorage.getItem("user");
   if(!user){
    setOpenDialouge(true);
    return console.log("usernot found") ;
   }
    toast("Congratulations! we have recorded your preferemces")

      console.log("Final formdata:", formdata);

    setLoading(true);
    try {
      // ✅ AI se plan lao
      const plan = await generateTravelPlan(formdata);
      console.log("Generated Travel Plan:", plan);
      SaveTripData(plan);
     
      // ✅ console me pura plan print karo
       // agar UI me dikhana hai to
    } catch (err) {
      console.error("❌ Error generating plan:", err);
    }
    setLoading(false);
    // reset formdata
    setFormData({
      destination: "",
      days: "",
      budget: "",
      travelWith: "",
    });

    // reset Geoapify
    setAutoCompleteKey((prev) => prev + 1);
  };

  const user= JSON.parse(localStorage.getItem("user"));
   const SaveTripData = async(TripData)=>{
    const docId=Date.now().toString();
   await setDoc(doc(db , "vacationplan",docId),{
    userSelection:formdata,
    tripdata:TripData,
    userEmail: user?.email,
    id:docId,

   }
  )
   navigate('/view-trip/' + docId);
   }

  const GetUserProfile=(tokenInfo)=>{
    axios.get(  `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
      headers:{
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((res)=>{
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res.data));
      setOpenDialouge(false);
      handleSubmit();
      
    }).catch((err)=>{
      console.log(err);
    });

  }

  return (
    <div className="sm:px-6 md:px-16 lg:px-32 xl:px-56 px-4 mt-10">
      <h2 className="font-bold text-3xl text-orange-500 text-center">
        Tell us your travel preferences
      </h2>
      <p className="text-gray-600 text-lg mt-3 text-center">
        Just provide some information to tailor best travel plans
      </p>

      <div className="mt-8 flex flex-col gap-6 items-center">
        {/* Destination */}
        <div className="w-full max-w-xl">
          <h2 className="text-lg font-medium mb-2">What is your Destination?</h2>
          <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_API_KEY}>
            <GeoapifyGeocoderAutocomplete
              key={autoCompleteKey} // 👈 reset on submit
              placeholder="Enter address, city, etc."
              type="city"
              debounceDelay={200}
              placeSelect={handlePlaceSelect}
            />
          </GeoapifyContext>
        </div>

        {/* Days */}
        <div className="w-full max-w-xl">
          <h2 className="text-lg font-medium mb-2">No of Days for vacation?</h2>
          <input
            type="number"
            name="days"
            value={formdata.days}
            onChange={handleChange}
            placeholder="Enter number of days"
            className="w-full border-2 rounded-xl p-2 text-base"
          />
        </div>

        {/* Budget */}
      <div className="w-full max-w-xl">
  <h2 className="text-lg font-medium mb-2">Whom you want to plan with?</h2>
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
    {[ "Low Budget", "Mid Range", "Luxury"].map((option) => (
      <label
        key={option}
        className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center text-sm font-medium transition-all
          ${
            formdata.budget === option
              ? "border-purple-500 bg-purple-500 shadow-lg"
              : "border-gray-300 hover:border-blue-400"
          }`}
      >
        <input
          type="radio"
          name="budget"
          value={option}
          checked={formdata.budget === option}
          onChange={handleChange}
          className="hidden"
        />
        {option}
      </label>
    ))}
  </div>
</div>
{/* Travel With */}
<div className="w-full max-w-xl">
  <h2 className="text-lg font-medium mb-2">Whom you want to plan with?</h2>
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
    {["Family", "Friends", "Solo", "Couple"].map((option) => (
      <label
        key={option}
        className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center text-sm font-medium transition-all
          ${
            formdata.travelWith === option
              ? "border-orange-500 bg-orange-500 shadow-lg"
              : "border-gray-300 hover:border-blue-300"
          }`}
      >
        <input
          type="radio"
          name="travelWith"
          value={option}
          checked={formdata.travelWith === option}
          onChange={handleChange}
          className="hidden"
        />
        {option}
      </label>
    ))}
  </div>
</div>



        {/* Submit */}
        <Button onClick={handleSubmit} className="bg-blue-600 w-full max-w-50 text-white">
          Submit Preferences
        </Button>

     
      </div>
     <Dialog open={openDialouge} onOpenChange={setOpenDialouge}>
  <DialogContent className="bg-white">
    <DialogHeader>
      <DialogTitle>Signin with Google</DialogTitle>
      <DialogDescription>
        <div className="flex flex-col items-center text-center">
          <img src="/logo1.svg" alt="logo" className="mb-3" />

          <h2 className="font-bold text-lg">Signin with Google</h2>
          <p className="text-gray-600">Signin with Google authentication securely</p>

          <Button
            onClick={Login}
            className="w-full mt-5 bg-black text-white flex gap-5 items-center"
          >
            <FcGoogle className="h-7 w-7" />
            Signin with Google
          </Button>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  );
}

export default CreateTrip;
