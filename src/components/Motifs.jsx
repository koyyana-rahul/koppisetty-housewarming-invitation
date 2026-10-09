/**
 * Decorative Indian motifs drawn as lightweight inline SVG.
 * Reused across sections so ornaments are never duplicated.
 */

export function Kalash({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      role="img"
      aria-label="Kalash, the sacred pot of a Griha Pravesh"
      className={className}
      {...props}
    >
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M78 62h44l-4 16a44 44 0 0 1-36 0z" opacity=".9" />
        <path d="M66 88c0 0 14-8 34-8s34 8 34 8c6 6 6 18 2 26-8 16-22 26-36 26s-28-10-36-26c-4-8-4-20 2-26z" />
        <path d="M60 96c14 6 66 6 80 0" opacity=".55" />
        <path d="M70 118c14 6 46 6 60 0" opacity=".4" />
        <ellipse cx="100" cy="158" rx="20" ry="9" opacity=".45" />
        <path d="M74 170h52l4 14H70z" opacity=".85" />
        <path d="M64 190h72l6 12H58z" />
      </g>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".8">
        <path d="M100 62V34" />
        <path d="M84 40c6-10 10-16 16-22 6 6 10 12 16 22" />
        <path d="M70 46c-6-8-10-14-14-20" opacity=".6" />
        <path d="M130 46c6-8 10-14 14-20" opacity=".6" />
      </g>
      <circle cx="100" cy="24" r="8" fill="currentColor" opacity=".9" />
      <g fill="currentColor" opacity=".55">
        <circle cx="58" cy="120" r="5" />
        <circle cx="142" cy="120" r="5" />
        <circle cx="66" cy="152" r="4" />
        <circle cx="134" cy="152" r="4" />
      </g>
    </svg>
  );
}

export function Diya({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="Diya, an oil lamp"
      className={className}
      {...props}
    >
      <path
        d="M18 74c0 18 19 28 42 28s42-10 42-28z"
        fill="currentColor"
        opacity=".9"
      />
      <path d="M12 76h96" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M26 70c8-6 14-8 20-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".5"
      />
      <path
        d="M60 66c-12-8-14-18-6-28 2 6 6 6 8 3 3-5 1-10-1-13 12 6 18 16 17 26-1 8-8 13-18 12z"
        fill="currentColor"
        opacity=".55"
      />
      <path
        d="M60 62c-6-5-7-11-3-17 1 3 3 3 4 1 2-3 1-6 0-8 6 3 9 9 9 15 0 5-4 9-10 9z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Mandala({ className = "", petals = 16, ...props }) {
  const rings = [
    { radius: 46, count: petals, length: 16 },
    { radius: 34, count: petals, length: 12 },
    { radius: 22, count: petals, length: 8 },
  ];

  return (
    <svg
      viewBox="-60 -60 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle r="54" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <circle r="30" stroke="currentColor" strokeWidth="1" opacity=".45" />
      {rings.map((ring, ringIndex) =>
        Array.from({ length: ring.count }, (_, index) => {
          const angle =
            (index / ring.count) * Math.PI * 2 +
            (ringIndex * Math.PI) / ring.count;
          const cx = Math.cos(angle) * ring.radius;
          const cy = Math.sin(angle) * ring.radius;
          return (
            <ellipse
              key={`${ringIndex}-${index}`}
              rx={ring.length}
              ry={ring.length / 2.4}
              cx={cx}
              cy={cy}
              transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
              stroke="currentColor"
              strokeWidth="1"
              opacity=".5"
            />
          );
        }),
      )}
      <circle r="7" stroke="currentColor" strokeWidth="1" opacity=".7" />
    </svg>
  );
}

export function Toran({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 400 60"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M0 12c60 26 120 26 200 0s140-26 200 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {Array.from({ length: 9 }, (_, index) => {
        const x = 26 + index * 43;
        const y = 12 + Math.sin((index / 8) * Math.PI) * 14;
        return (
          <g key={index}>
            <ellipse
              cx={x - 13}
              cy={y + 8}
              rx="13"
              ry="6"
              fill="currentColor"
              opacity=".4"
              transform={`rotate(-24 ${x - 13} ${y + 8})`}
            />
            <ellipse
              cx={x + 13}
              cy={y + 8}
              rx="13"
              ry="6"
              fill="currentColor"
              opacity=".4"
              transform={`rotate(24 ${x + 13} ${y + 8})`}
            />
            <circle cx={x} cy={y + 16} r="6" fill="currentColor" opacity=".75" />
          </g>
        );
      })}
    </svg>
  );
}
export function Om({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <circle
        cx="50"
        cy="50"
        r="37"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity=".3"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize="46"
        fontFamily="'Noto Serif Devanagari', 'Nirmala UI', 'Devanagari Sangam MN', serif"
      >
        {"\u0950"}
      </text>
      <path
        d="M50 5c2.5 2 3.4 3.8 0 5.8-3.4-2-2.5-3.8 0-5.8z"
        fill="currentColor"
        opacity=".6"
      />
    </svg>
  );
}

export function HouseIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function CalendarIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
      <circle cx="8.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="17" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function ClockIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function LocationIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 21s7-5.6 7-10.5A7 7 0 0 0 5 10.5C5 15.4 12 21 12 21z" />
      <circle cx="12" cy="10.3" r="2.6" />
    </svg>
  );
}

export function MapPinIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
      <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  );
}