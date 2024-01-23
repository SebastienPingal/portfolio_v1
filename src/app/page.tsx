import Image from 'next/image';
import PerlinBackground from '@/components/perlinBackground.jsx';

export default function Home() {
  return (
    <div className='flex flex-col items-center h-full bg-opacity-0'>
      <div style={{ overflow: 'hidden', borderRadius: '50%', height: '370px' }}>
        <Image src='/me.jpeg' width={400} height={400} className='rounded-full' alt='Sébastien' />
      </div>
      <p className='text-lg'>
        Hey, I'am Sébastien. I am designer, software tinker, music maker, and sometimes a teacher.
        I am curently working on this website, so it's a bit empty for now. But I'm glad to finaly making somekind of hub for all my projects.
      </p>
    </div>
  );
}