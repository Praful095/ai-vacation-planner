import React, { useEffect, useState } from 'react';


function UserTripCard({ trip }) {
  // Custom hook for fetching Unsplash images
  function useUnsplashImage(query) {
    const [photoUrl, setPhotoUrl] = useState("/placeholderimage.jpg");

    useEffect(() => {
      if (query) {
        const getPhoto = async () => {
          try {
            const res = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                query
              )}&per_page=10&client_id=${
                import.meta.env.VITE_UNSPLASH_ACCESS_KEY
              }`
            );
            const data = await res.json();

            if (data.results?.length) {
              const url =
                data.results[
                  Math.floor(Math.random() * data.results.length)
                ].urls.regular;
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

  // ✅ Call the hook here and pass trip info
  const photoUrl = useUnsplashImage(trip?.userSelection?.destination || "travel");

  return (
    <div>
      <img src={photoUrl} alt="trip" className="w-full h-48 object-cover rounded-lg" />
    </div>
  );
}

export default UserTripCard;
