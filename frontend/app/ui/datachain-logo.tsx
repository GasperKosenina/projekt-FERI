import Image from 'next/image';

export default function DataChainLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white p-4 rounded">
      <Image
        src="/DS_logo2.png" // Uporabite pot do slike, ki ste jo naložili
        alt="Data Chain Logo"
        width={120} // Spremenjena širina slike
        height={130} // Spremenjena višina slike
        priority
        className="rounded-lg" // Dodan Tailwind CSS razred za zaobljene robove
        style={{ marginBottom: "-13px", marginLeft: "-11px" }} // Prilagojene margine
      />
    </div>
  );
}
