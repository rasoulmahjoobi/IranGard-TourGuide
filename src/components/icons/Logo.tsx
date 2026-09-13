import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="100" cy="100" r="95" fill="#0F6E56" />
      <circle cx="100" cy="70" r="18" fill="#EF9F27" />
      <path d="M 30 145 L 70 85 L 100 125 L 130 80 L 170 145 Z" fill="#1D9E75" />
      <path d="M 20 150 L 65 70 L 95 115 L 115 90 L 180 150 Z" fill="#04342C" />
      <path d="M 65 70 L 75 82 L 65 85 L 55 82 Z" fill="#FFFFFF" />
      <path d="M 115 90 L 122 98 L 115 101 L 108 98 Z" fill="#FFFFFF" />
      <rect x="0" y="150" width="200" height="10" fill="#04342C" />
    </svg>
  );
}