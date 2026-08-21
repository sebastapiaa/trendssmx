// Emoji-style brand icons (brandbook: "íconos estilo emoji").
import type { IconName } from '@/lib/content';

const PATHS: Record<Exclude<IconName, 'smile'>, string> = {
  star: 'M12 1.5l3.1 6.9 7.4.7-5.6 5 1.7 7.4L12 17.7 5.4 21.5l1.7-7.4-5.6-5 7.4-.7z',
  fire: 'M13.5 0s1 3.8-1.6 7.6C9.6 11 7 12.6 7 16a5.5 5.5 0 0 0 11 0c0-2-.9-3.4-1.8-4.6-.5 1.1-1.4 2-2.5 2.3.6-2.2.9-5.4-.2-8.2C12.7 3.3 13.5 0 13.5 0z',
  heart: 'M12 21S3 14.7 3 8.6C3 5.5 5.4 3 8.4 3c1.9 0 3.1 1 3.6 1.8C12.5 4 13.7 3 15.6 3 18.6 3 21 5.5 21 8.6 21 14.7 12 21 12 21z',
};

export function Icon({ name, fill = 'currentColor' }: { name: IconName; fill?: string }) {
  if (name === 'smile') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10.4" fill="none" stroke={fill} strokeWidth="1.8" />
        <circle cx="8.6" cy="10" r="1.3" fill={fill} />
        <circle cx="15.4" cy="10" r="1.3" fill={fill} />
        <path d="M7.5 14.2c1 1.6 2.6 2.5 4.5 2.5s3.5-.9 4.5-2.5" fill="none" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name]} fill={fill} />
    </svg>
  );
}
