import { getDoc , doc } from 'firebase/firestore';
import React from 'react'
import { db } from '@/services/firebaseConfig';
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import { useState ,useEffect } from 'react';
import InfoSection from '@/components/InfoSection';
import Hotels from '@/components/Hotels';
import Places from '@/components/Places';
import Footer from '@/components/Footer';


function ViewTrip() {
    const {tripId}=useParams();
    const [trip, setTrip] =useState([]);
    useEffect(()=>{
        tripId&&getTourData();
    },[tripId])
    const getTourData=async()=>{
        const docRef=doc(db,"vacationplan",tripId);
        const docSnap =await getDoc(docRef);
        if(docSnap.exists()){
            console.log("Document data:", docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No such document!");
            toast.error("No Trip Found");
        }
    }
  return (
    
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
{/* information of trip */}
<InfoSection trip={trip}/>
{/* hotel options */}
<Hotels trip={trip} />
{/* itineraries */}
<Places trip={trip}/>
{/* footer info */}
<Footer/>
    </div>
  )
}

export default ViewTrip