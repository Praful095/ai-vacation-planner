import React, { useEffect, useState } from 'react'
import { FaLocationArrow } from "react-icons/fa";
import { Button } from "./ui/button";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(trip?.photoUrl || "/placeholderimage.jpg");

  useEffect(() => {
    if (!trip?.photoUrl && trip?.userSelection?.destination) {
      const getPhoto = async () => {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${trip?.userSelection?.destination}&per_page=10&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
          );
          const data = await res.json();

          if (data.results?.length) {
            // ek random photo lo
            const url = data.results[Math.floor(Math.random() * data.results.length)].urls.regular;
            setPhotoUrl(url);
            trip.photoUrl = url; // trip ke object me save
          }
        } catch (err) {
          console.error("Error fetching photo:", err);
        }
      };

      getPhoto();
    }
  }, [trip]);

  return (
    <div>
      <img 
        src={photoUrl} 
        alt="Trip Image" 
        className="w-[1800px] h-78 object-cover mb-4 rounded-2xl shadow-2xl" 
      />
      <div>
        <h1 className='font-bold my-3 text-xl'>{trip.userSelection?.destination}</h1>
        <div className='flex justify-between items-center sm:grid-row-3 md:grid-row-1'>
          <div className='flex gap-5 '>
            <h1 className='my-3 text-xl p-1 rounded-md text-white shadow-xl bg-purple-400'>
              {trip.userSelection?.days} Days 📅
            </h1>
            <h1 className='my-3 text-xl p-1 rounded-md text-white shadow-xl bg-purple-400'>
              budget💸 : {trip.userSelection?.budget}
            </h1>
            <h1 className='my-3 text-xl p-1 rounded-md text-white shadow-xl bg-purple-400'>
              travelers 🥂: {trip.userSelection?.travelWith}
            </h1>
          </div>
          <Button>
            <FaLocationArrow />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
