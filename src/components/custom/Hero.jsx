import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-56 flex flex-col items-center text-center gap-9">
      {/* Heading */}
      <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[35px] mt-12">
        <span className="text-purple-800">Discover your next adventure with AI:</span>
        <br />
        The Personalised Vacation Planner
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-6 max-w-3xl">
        Your personal trip planner and travel curator, creating custom itineraries
        tailored to your interests and budget — just for you.
      </p>

      {/* Button */}
      <Link to="/create-trip">
        <Button className="bg-purple-600 text-white mt-6 px-6 py-3 text-base md:text-lg">
          Get Started, It's Free
        </Button>
      </Link>

      {/* Hero Section with Image & Overlay */}
      <div className="relative mt-10 flex justify-center items-center w-full">
        {/* Text Overlay */}
        <div className="absolute text-center px-4 md:px-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sans text-black drop-shadow-lg">
            Ready To Travel?
          </h1>
          <h3 className="text-sm sm:text-black md:text-lg lg:text-xl font-semibold text-white mt-2 drop-shadow-md">
            Choose the best vacation planner for you at your fingertips
          </h3>
        </div>

        {/* Background Image */}
        <img
          src="/travel.jpg"
          alt="hero image"
          className="shadow-2xl rounded-lg w-full object-cover h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]"
        />
      </div>
    </div>
  )
}

export default Hero
