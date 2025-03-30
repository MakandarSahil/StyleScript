"use client"

import Footer from "@/components/Footer"
import { BackgroundLines } from "@/components/ui/background-lines"
import { Button } from "@/components/ui/button"
import { ThreeDMarquee } from "@/components/ui/ThreeDMarquee"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
import { Link } from "@tanstack/react-router"

export default function LandingPage() {
  // Sample images array for the 3D marquee
  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
    "https://assets.aceternity.com/github-globe.png",
    "https://assets.aceternity.com/glare-card.png",
    "https://assets.aceternity.com/layout-grid.png",
    "https://assets.aceternity.com/flip-text.png",
    "https://assets.aceternity.com/hero-highlight.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
    "https://assets.aceternity.com/signup-form.png",
    "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
    "https://assets.aceternity.com/spotlight-new.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
  ]

  const words = [
    {
      text: "Build",
    },
    {
      text: "awesome",
    },
    {
      text: "cloths",
    },
    {
      text: "with",
    },
    {
      text: "StyleScript.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];


  return (
    <div className="min-h-screen">
      <BackgroundLines className="w-full flex flex-col items-center py-6 lg:py-16 px-4">
        <Button className="bg-primary hover:bg-primary/90">New AI image generation</Button>
        <h1 className="text-4xl md:text-6xl font-normal text-center mt-6">
          Where style meets innovation ways of <br className="hidden md:block" /> meeting new fashion
        </h1>
        <h3 className="text-center mt-6 text-[14px] font-thin">
          Unveiling a fashion destination where trends blend seamlessly with your <br className="hidden md:block" />{" "}
          individual style aspirations. Discover today!
        </h3>
      </BackgroundLines>
      {/* <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          Sanjana Airlines, <br /> Sajana Textiles.
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
          Get the best advices from our experts, including expert artists,
          painters, marathon enthusiasts and RDX, totally free.
        </p>
      </BackgroundLines> */}


      <div className="w-full  rounded-xl">
        <ThreeDMarquee images={images} />
      </div>

      <div className="flex flex-col items-center justify-center h-[40rem]  ">
        <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
          The road to style starts here
        </p>
        <TypewriterEffectSmooth words={words} />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          <Link to='/chats'><Button className="bg-transparent hover:bg-white hover:text-black border-2 border-white px-10 rounded-md">Create Your Design</Button>
          </Link>
          <Button className="bg-white text-black hover:bg-gray-200 px-10 rounded-md">Signup</Button>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

