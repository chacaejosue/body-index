import React from "react";

interface Props {
  className?: string;
  size?: number;
}

export function Logo({ className = "w-6 h-6", size = 26 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      fill="none"
      className={className}
      role="img"
      aria-label="Logo BodyIndex"
    >
      <defs>
        <linearGradient id="navArchGrad" x1="10%" y1="65%" x2="90%" y2="65%">
          <stop offset="0%" stopColor="#00a86b" />
          <stop offset="25%" stopColor="#10b981" />
          <stop offset="48%" stopColor="#84cc16" />
          <stop offset="70%" stopColor="#facc15" />
          <stop offset="88%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        <linearGradient id="navFigureGrad" x1="50%" y1="20%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#0b726b" />
          <stop offset="45%" stopColor="#0d9488" />
          <stop offset="75%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <linearGradient id="navHeadGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      {/* Semicírculo envolvente 100% simétrico */}
      <path
        d="M 152 650 A 375 375 0 1 1 848 650"
        stroke="url(#navArchGrad)"
        strokeWidth="96"
        strokeLinecap="round"
      />

      {/* Cabeza anatómica simétrica con respiro natural */}
      <circle cx="500" cy="395" r="80" fill="url(#navHeadGrad)" />

      {/* Silueta corporal estilizada */}
      <path
        d="
          M 500 514
          C 472 514 380 456 284 411
          C 256 399 240 417 252 437
          C 260 450 274 466 294 476
          C 334 502 376 544 415 598
          C 428 622 436 652 448 698
          C 460 746 470 798 482 842
          C 488 858 512 858 518 842
          C 530 798 540 746 552 698
          C 564 652 572 622 585 598
          C 624 544 666 502 706 476
          C 726 466 740 450 748 437
          C 760 417 744 399 716 411
          C 620 456 528 514 500 514
          Z
        "
        fill="url(#navFigureGrad)"
      />
    </svg>
  );
}
