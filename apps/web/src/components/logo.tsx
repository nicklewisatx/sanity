import Link from "next/link";

interface TextLogoProps {
  className?: string;
}

export function TextLogo({ className }: TextLogoProps) {
  return (
    <Link href="/" className={`group inline-flex items-center ${className}`}>
      <div className="relative">
        <h1 className="text-2xl font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Nick Lewis
          </span>
          <span className="mx-2 text-gray-400 dark:text-gray-600 font-light">
            :
          </span>
          <span className="font-light text-gray-600 dark:text-gray-400">
            The Blog
          </span>
        </h1>
        <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
      </div>
    </Link>
  );
}
