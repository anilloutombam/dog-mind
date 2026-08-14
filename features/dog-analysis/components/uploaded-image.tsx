type UploadedImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function UploadedImage({ src, alt, className }: UploadedImageProps) {
  // Object URLs from a browser file picker cannot be optimized by next/image.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
