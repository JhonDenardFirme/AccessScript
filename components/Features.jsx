'use client'

import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Features = () => {

  useEffect(() => {
    AOS.init({duration: 1000, delay:100})
  }, []);

  return (
    <div className="flex flex-col h-[450px] justify-center items-center z-40 mt-52 mb-16">

      <h1 className="text-4xl font-medium"> YOUR <span className="text-gradient-blue font-extrabold" data-aos="fade-up"> NEXT STEP</span></h1>
      <h1 className="text-4xl font-medium mb-8">FOR EASIER ACCESS CONTROL</h1>

    <div className="px-32 grid grid-cols-4 gap-16 h-56 w-full relative mt-16">



      <div className="flex flex-col w-full justify-center items-center feature-card border-[1px] border-neutral-500"
        data-aos="fade-up" data-aos-delay="200"
      >
        <div className="rounded-full border-[1px] border-neutral-500 p-4 mb-6 absolute -top-8 bg-neutral-950 z-10">
          <img src="/shape.svg" className="w-8 object-cover"></img>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-gradient-blue">ROLE GROUPS</h1>
        <p className="text-white text-sm text-center w-[80%] font-light ">
        Organize multiple permissions under reusable groups to simplify complex access hierarchies
        </p>

      </div>


      <div className="flex flex-col w-full justify-center items-center feature-card border-[1px] border-neutral-500"
        data-aos="fade-up" data-aos-delay="400"
      >
        <div className="rounded-full border-[1px] border-neutral-500 p-4 mb-6 absolute -top-8 bg-neutral-950 z-10">
          <img src="/color.svg" className="w-8 object-cover"></img>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-gradient-blue">ACCESS RULES</h1>
        <p className="text-white text-sm text-center w-[80%] font-light ">
        Create condition-based access rules to protect routes, components, and actions

        </p>

      </div>


      <div className="flex flex-col w-full justify-center items-center feature-card border-[1px] border-neutral-500"
        data-aos="fade-up" data-aos-delay="600">
        <div className="rounded-full border-[1px] border-neutral-500 p-4 mb-6 absolute -top-8 bg-neutral-950 z-10">
          <img src="/emotion.svg" className="w-8 object-cover"></img>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-gradient-blue">EASY ROUTING</h1>
        <p className="text-white text-sm text-center w-[80%] font-light">
        Control access to pages and endpoints by assigning route-level permissions tied to user roles
        </p>

      </div>

      <div className="flex flex-col w-full justify-center items-center feature-card border-[1px] border-neutral-500"
        data-aos="fade-up" data-aos-delay="800">
        <div className="rounded-full border-[1px] border-neutral-500 p-4 mb-6 absolute -top-8 bg-neutral-950 z-10">
          <img src="/item.svg" className="w-8 object-cover"></img>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-gradient-blue">AUDIT TRAIL</h1>
        <p className="text-white text-sm text-center w-[80%] font-light">
        Track and log permission checks and access decisions for transparency and debugging
        </p>

      </div>





      <div className="absolute blue-gradient w-[200px] h-[200px] -z-10 -top-64 -right-32"></div>
        
      <div className="absolute lightblue-gradient w-[200px] h-[200px] -z-10 -top-64 -right-32"></div>


    </div>
    </div>
    
  )
}

export default Features