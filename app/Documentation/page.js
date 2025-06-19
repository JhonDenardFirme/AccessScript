import Navbar from "@/components/Navbar";
import Link from "next/link";

const Documentation = () => {
    return (
      <div
        className="relative w-full min-h-[100vh] px-16 pb-16 bg-cover bg-center bg-no-repeat bg-fixed overflow-auto"
        style={{
          backgroundImage: "url('/Banner.png')", // Replace with the correct image path
        }}
      >
        <Navbar></Navbar>
        <div className="flex flex-col justify-center items-center w-full p-16 mb-8">
          <img src="ACCESSSCRIPTLOGO.png" className="h-64"></img>
          <img src="ACCESSSCRIPTTITLE.png" className="h-16"></img>
        </div>

        <div className="flex flex-col justify-center items-start px-64 mb-32">
              <h1 className="text-4xl font-medium mb-8"> <span className="text-gradient-blue font-extrabold" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100"> ACCESSSCRIPT</span></h1>
              <p className="text-lg font-light text-left">AccessScript is a specialized programming language designed for implementing Role-Based Access Control (RBAC) in web development. Built with simplicity and clarity in mind, it allows developers—especially beginners and educators—to define, manage, and enforce access permissions using readable and logical syntax. AccessScript removes the complexity of traditional permission systems by offering an intuitive, purpose-driven syntax that promotes security and maintainability. Whether you&apos;sre working on a small web app or teaching web security fundamentals, AccessScript helps teams write access logic thats both powerful and understandable.
            </p>
              
        </div>

        <div className="flex flex-col justify-center items-start px-64 ">
              <h1 className="text-4xl font-medium mb-8"> <span className="text-gradient-blue font-extrabold" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100"> PRINCIPLES OF THE LANGUAGE</span></h1>
              <h1 className="text-xl font-medium mb-4"> A LANGUAGE BUILT FOR ACCESS CONTROL</h1>

              <p className="text-lg font-light text-left">AccessScript focuses entirely on expressing access permissions and restrictions in a way that mirrors how we think about roles and responsibilities in real life. Instead of writing verbose logic in general-purpose languages, developers can use AccessScript to declare roles, define actions, and control user access in a declarative and expressive way. It simplifies concepts like route protection, conditional permissions, and role hierarchies, making secure coding more accessible to all developers.
            </p>


            <h1 className="text-xl font-medium mb-4 mt-12"> SIMPLIFIED SYNTAX FOR WEB DEVELOPERS</h1>

            <p className="text-lg font-light text-left">
            AccessScript was designed with beginner and intermediate web developers in mind. Inspired by the clarity of scripting languages like JavaScript, it removes unnecessary syntax and focuses on meaningful constructs such as role, can, deny, and when. Developers can apply access rules to routes, components, or resources in a human-readable format. This reduces the chance of logic errors and improves auditability for teams working on secure applications. Through structured and readable statements, AccessScript allows developers to manage access control with minimal friction.
            </p>


              <h1 className="text-xl font-medium mb-4 mt-12">INTEGRATED ROUTING AND PERMISSION LOGIC</h1>

              <p className="text-lg font-light text-left">
Unlike traditional RBAC systems that require scattered conditionals across the backend and frontend, AccessScript provides native support for route-level permission declarations. Developers can attach access logic directly to routes or components using concise syntax. Whether it’s admin-only dashboards, user-specific data, or time-restricted actions, AccessScript makes it easy to enforce rules without code duplication or complex middleware logic.
            </p>
              
        </div>

        <Link className="hover:scale-110 transition-all duration-300 ease-out text-sm" href={"https://drive.google.com/file/d/1m-6QwOxfP34LPm-_JKjMxt4Vx0cgj0WX/view?usp=sharing"}>
            <div className="border-[1px] border-neutral-800  rounded-lg h-24 p-4 flex justify-center items-center mx-64 gap-2 mt-12 hover:bg-teal-950 hover:cursor-pointer">
                                <img src='document.svg' className='h-6'></img>
                                <p className='text-sm text-[#00C0D3]'>GET THE FULL DOCUMENTATION</p>

            </div>
        </Link>

  
        
        <div className="fixed blue-gradient w-[350px] h-[350px] z-10 -top-44 -right-16"></div>
        <div className="fixed lightblue-gradient w-[250px] h-[250px] z-10 -top-36 -right-16"></div>
        <div className="fixed orange-gradient w-[350px] h-[350px] z-10 -bottom-44 -left-52"></div>
        <div className="fixed light-orange-gradient w-[500px] h-[500px] z-10 -bottom-44 -left-52"></div>
      </div>
    );
  };
  
  export default Documentation;
  
