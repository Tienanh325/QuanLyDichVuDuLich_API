import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
  style?: CSSProperties;
};

const directionClass = {
  up: "motion-reveal--up",
  down: "motion-reveal--down",
  left: "motion-reveal--left",
  right: "motion-reveal--right",
  none: "motion-reveal--none",
};

export function Reveal({
  children,
  className = "",
  as = "div",
  delay = 0,
  direction = "up",
  once = true,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
          return;
        }

        if (!once) setVisible(false);
      },
      { threshold: 0.16, rootMargin: "0px 0px -70px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const Tag = as;
  const composedClassName = [
    "motion-reveal",
    directionClass[direction],
    visible ? "is-visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref as never}
      className={composedClassName}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

type CountUpProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({ value, suffix = "", prefix = "", duration = 1000, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let startTime = 0;
    let hasRun = false;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const start = () => {
      if (hasRun) return;
      hasRun = true;
      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        setDisplay(Math.round(value * easeOutCubic(progress)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [duration, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString("vi-VN")}{suffix}
    </span>
  );
}

export function RatingProgress({ label, value }: { label: string; value: number }) {
  const width = Math.max(0, Math.min(value, 100));

  return (
    <div className="rating-progress">
      <span className="rating-progress__label">{label}</span>
      <span className="rating-progress__track">
        <span className="rating-progress__fill" style={{ "--rating-width": `${width}%` } as CSSProperties} />
      </span>
      <span className="rating-progress__value">{width}%</span>
    </div>
  );
}

export function AnimatedStars({ value = 5, max = 5 }: { value?: number; max?: number }) {
  return (
    <span className="animated-stars" aria-label={`${value}/${max} sao`}>
      {Array.from({ length: max }, (_, index) => {
        const active = index < value;
        return (
          <span key={index} className={active ? "animated-stars__star is-active" : "animated-stars__star"}>
            ★
          </span>
        );
      })}
    </span>
  );
}
