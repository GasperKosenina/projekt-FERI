import Image from 'next/image';

export default function CheckmarkSuccess() {
  return (
    <div className="flex flex-row items-center leading-none text-white p-4 rounded">
      <Image
        src="/ikona_checkmark.png" 
        alt="Check Mark Success"
        width={120} 
        height={130} 
        priority
        className="rounded-lg" 
        style={{ marginBottom: "-13px", marginLeft: "-11px" }} 
      />
    </div>
  );
}

