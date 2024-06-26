import Image from 'next/image';
import Link from 'next/link';

export default function DataChainLogo() {
  return (
    <div className="flex ml-8 rounded">
      <Link href="/dashboard">
        
          <Image
            src="/DS_logo1.png" 
            alt="Data Chain Logo"
            width={150} 
            height={150} 
            priority
          />
        
      </Link>
    </div>
  );
}
