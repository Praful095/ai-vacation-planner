import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function useUnsplashImage(query) {
  const [photoUrl, setPhotoUrl] = useState("/placeholderimage.jpg");

  useEffect(() => {
    if (query) {
      const getPhoto = async () => {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&client_id=${
              import.meta.env.VITE_UNSPLASH_ACCESS_KEY
            }`
          );
          const data = await res.json();

          if (data.results?.length) {
            const url =
              data.results[Math.floor(Math.random() * data.results.length)].urls.regular;
            setPhotoUrl(url);
          }
        } catch (err) {
          console.error("Error fetching photo:", err);
        }
      };

      getPhoto();
    }
  }, [query]);

  return photoUrl;
}

function Hotels({ trip }) {
  return (
    <div>
      <h1 className="font-bold text-xl mt-8">Hotels Recommendations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
        {trip?.tripdata?.hotels?.map((item, index) => {
          // yaha hook use kar rahe hain
          const photoUrl = useUnsplashImage(item.hotel_name);

          return (
            <Link
              key={index}
              to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                item.hotel_name
              )} ${encodeURIComponent(item.address)}`}
              target="_blank"
            >
              <div className="hover:scale-105 transition-all cursor-pointer p-3 border-2 border-purple-200 shadow-xl">
                <img
                  src={photoUrl}
                  alt={item.hotel_name}
                  className="w-[400px] h-[200px] object-cover mb-4 rounded-2xl"
                />
                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold text-lg">{item.hotel_name}</h1>
                  <h1 className="text-sm my-2">📍 {item.address}</h1>
                  <h1 className="text-sm my-2">💰 {item.price}</h1>
                  <h1 className="text-sm my-2">⭐ {item.rating}</h1>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}

export default Hotels
