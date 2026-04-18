export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle outline */}
      <circle cx="50" cy="50" r="46" stroke="#1e293b" strokeWidth="2" fill="none" />

      {/* Clip for inside circle */}
      <defs>
        <clipPath id="circleClip">
          <circle cx="50" cy="50" r="45" />
        </clipPath>
      </defs>

      <g clipPath="url(#circleClip)">
        {/* Sun (dark semicircle) */}
        <circle cx="50" cy="52" r="22" fill="#1e293b" />

        {/* Horizontal water lines */}
        {[60, 64, 68, 72, 76, 80, 84, 88, 92].map((y, i) => (
          <line
            key={i}
            x1="5"
            y1={y}
            x2="95"
            y2={y}
            stroke="#1e293b"
            strokeWidth="1.8"
          />
        ))}

        {/* White space between sun and lines to create horizon effect */}
        <rect x="0" y="56" width="100" height="3" fill="white" />
      </g>
    </svg>
  );
}
