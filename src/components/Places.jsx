import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ✅ Unsplash Image Component
function UnsplashImage({ query }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholderimage.jpg");

  useEffect(() => {
    if (query) {
      fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results?.length) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            setPhotoUrl(data.results[randomIndex].urls.regular);
          }
        })
        .catch((err) => console.error("Unsplash error:", err));
    }
  }, [query]);

  return (
    <img
      src={photoUrl}
      alt={query}
      className="w-[200px] h-[150px] object-cover rounded-xl shadow-md"
    />
  );
}

function Places({ trip }) {
  return (
    <div>
      <h1 className="font-bold text-xl mt-8">Places to Visit 🌍</h1>

      <div>
        {trip?.tripdata?.itinerary?.map((item, index) => (
          <div key={index}>
            <h1 className="font-semibold text-xl mt-4">Day {item.day}</h1>

            {item?.plan?.map((place, idx) => (
              <Link
                key={idx}
                to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.place_name)}`}
                target="_blank"
              >
                <div className='flex justify-between items-center gap-5 border-2 border-purple-200 my-4 p-3 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer sm:grid-cols-1'>
                  
                  {/* ✅ Left Side → Text */}
                  <div>
                    <h2 className="font-medium text-lg mt-2">
                      🌐 {place.place_name}
                    </h2>
                    <h2 className="text-sm text-orange-500 mt-1">
                      ⏱️ {place.best_time_to_visit}
                    </h2>
                    <h2 className="text-md text-black-500 mt-1">
                      💲 {place.ticket_pricing}
                    </h2>
                    <h2 className="text-md text-black-500 mt-1">
                      {place.travel_time}
                    </h2>
                  </div>

                  {/* ✅ Right Side → Image */}
                  <div className='mb-5 p-2'>
                    <UnsplashImage query={place.place_name} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Places
