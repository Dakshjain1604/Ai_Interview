import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate=useNavigate();
  return (
    <div className="relative flex min-h-screen w-screen flex-col items-start justify-start overflow-hidden">
    <BackgroundRippleEffect rows={40} cols={40} />
    <nav className="bg-gray-800 p-4 text-white w-screen flex justify-center ">
  <div className="container mx-auto flex items-center justify-center">
    {/* Logo/Brand */}
    <div className="text-xl font-bold">Interview Ai</div>

    {/* Desktop Menu */}
    {/* <div className="hidden space-x-4 md:flex text-xl">
      <div className="hover:text-gray-400">Interview</div>
      <div className="hover:text-gray-400">About</div>
      <div className="hover:text-gray-400">Services</div>
      <div className="hover:text-gray-400">Contact</div>
    </div>
     */}
  </div>
</nav>
    <div className="mt-60 w-full">
      <h2 className="relative z-30 mx-auto max-w-4xl text-center text-2xl font-bold text-primary md:text-4xl lg:text-7xl dark:text-dark-primary shadow-white shadow-2xl">
      Master the Art of Interviews – Both Sides of the Table
      </h2>
      <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-white dark:text-neutral-500">
      Whether you’re looking to ace your next interview or find the perfect candidate, we’ve got you covered
      </p>
      <div className='flex justify-center mt-10 gap-4 text-black relative z-25'><Button size='large' className='hover:scale-105 border-none outline-none hover:text-black hover:border-none' onClick={()=>{
          navigate('/interviewee')
      }}>Give Interview !</Button>
      <Button size='large' className='hover:scale-105 border-none outline-none hover:text-black hover:border-none hover:outline-none' onClick={()=>{
          navigate('/interviewer')
      }}>See DashBoard !</Button></div>
    </div>
  </div>
  );
};

export default LandingPage;