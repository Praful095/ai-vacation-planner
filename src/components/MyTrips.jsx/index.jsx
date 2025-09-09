import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../../services/firebaseConfig";
import UserTripCard from '../UserTripCard';
import { Skeleton } from "@/components/ui/skeleton"

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate('/');
      return;
    }
    setUserTrips([]);
    const q = query(collection(db, "vacationplan"), where("userEmail", "==", user?.email));
    const querySnapshot = await getDocs(q);

    const trips = querySnapshot.docs.map((d) => {
      console.log(d.id, " => ", d.data());
      return {
        id: d.id,
        ...d.data(),
      };
    });

    setUserTrips(trips);
  };

  return (
    <div className='flex justify-center  flex-col items-center'>
      <h1 className='text-2xl font-bold  my-5 text-purple-600'>
        My   All Vacations Plans 🌴🧳
      </h1>

      <div className='grid items-center justify-center grid-cols-3 gap-20 p-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  '>
          {userTrips?.length>0?userTrips.map((trip, index) => (
          <div key={trip.id || index} className=' border-2 border-purple-200 shadow-2xl rounded-lg  hover:scale-105 transition-all p-4 cursor-pointer h-90'onClick={() => navigate(`/view-trip/${trip.id}`)}>
            
            <UserTripCard trip={trip} />
            <h1 className='text-xl text-purple-500 font-semibold my-3'>🌍 Destination :{trip?.userSelection?.destination}</h1>
            <h1 className='text-md font-medium my-2'> 🗓️ days :{trip?.userSelection?.days}</h1>
             <h1 className='text-md font-medium my-2'>  ❤️ company with :{trip?.userSelection?.travelWith}</h1>
          </div>
        )):<Skeleton className="h-[20px] w-[100px] rounded-full" />}
      </div>

      {/* Debugging only */}
      {console.log("User trips: ", userTrips)}
    </div>
  );
}

export default MyTrips
