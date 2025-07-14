import Image from "next/image";

export default function Avatar({ src, alt = "Avatar", size = 150 }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-cover rounded-full"
    />
  );
}
