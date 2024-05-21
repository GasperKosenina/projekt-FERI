import Image from 'next/image';

export default function DataChainLogo() {
  return (
    <div className="flex ml-8 rounded">
      <Image
        src="/DS_logo1.png" 
        alt="Data Chain Logo"
        width={150} 
        height={150} 
        priority
      />
    </div>
  );
}

