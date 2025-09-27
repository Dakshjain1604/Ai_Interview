import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <BackgroundRippleEffect rows={40} cols={45} cellSize={50} />
      <div className='relative '>
        <div className='text-8xl text-white inline-block bg-clip-text font-extralight'> Welcome to Interview Ai</div>
        <div className='pt-10 text-3xl shadow-4xl shadow-white'>
          Let's Get You Hired !
        </div>
        <div className="flex justify-center items-center gap-5 mt-10">
          <Button variant={'default'} className='bg-white hover:scale-110 hover:bg-blue-100 relative cursor-pointer' onClick={() => {
            navigate('/Upload')
          }}>Get Hired !</Button>
          <Button variant={'default'} className='bg-white hover:scale-110 hover:bg-blue-100 relative cursor-pointer' onClick={() => {
            navigate('/DashBoard')
          }}> Hire Someone</Button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;