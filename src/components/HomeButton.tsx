import Link from 'next/link';

interface HomeButtonProps {
  className?: string;
}

export default function HomeButton({ className = "" }: HomeButtonProps) {
  return (
    <Link href="/">
      <button className={`bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl ${className}`}>
        <img 
          src="/w4.png" 
          alt="W4 Logo" 
          width={120} 
          height={60} 
          className="rounded-sm object-contain"
          onError={(e) => {
            console.log('Error loading logo:', e);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <span className="font-semibold">🏆 Paladio77</span>
      </button>
    </Link>
  );
}