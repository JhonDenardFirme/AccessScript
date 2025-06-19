'use client'

import { useEffect } from "react"
import AOS from 'aos';
import 'aos/dist/aos.css';



const Intro = () => {

  useEffect (() => {
    AOS.init({duration:1000});
  }, []);




  return (
    <div className="h-[50vh] px-16 flex flex-col mt-32">

      
    
      <div className="grid grid-cols-2 justify-center items-center gap-8">

          <div className="flex flex-col justify-center items-center relative">
              <img src="/cube.png" className="w-[70%] object-cover"></img>


          </div>

          <div className="flex flex-col justify-center items-center -ml-32">
              <h1 className="text-4xl font-medium mb-8"> THIS IS <span className="text-gradient-blue font-extrabold" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100"> ACCESSSCRIPT</span></h1>
              <p className="text-lg font-light text-left w-[60%] mb-4">AccessScript is a specialized programming language designed to simplify the implementation of Role-Based Access Control (RBAC) within web development projects. </p>
              <p className="text-lg font-light text-left w-[60%]">It enables developers to define, manage, and enforce access permissions clearly and efficiently—making security logic more readable, maintainable, and scalable.</p>
          </div>




      </div>

      
    </div>
  )
}

export default Intro