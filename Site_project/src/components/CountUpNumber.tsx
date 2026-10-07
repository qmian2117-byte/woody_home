"use client";

import React, { useEffect, useState, useRef } from "react";

export function CountUpNumber({
  value,
  end,
  suffix = "",
  duration = 1800,
}: {
  value?: number;
  end?: number;
  suffix?: string;
  duration?: number;
}) {
  const target = value ?? end ?? 0;
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOutProgress * target);
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="font-extrabold tabular-nums">
      {(count ?? 0).toLocaleString()}
      {suffix}
    </span>
  );
}
