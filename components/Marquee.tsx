"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Animation direction
   */
  direction?: "left" | "right" | "up" | "down"

  /**
   * Pause animation when hovered
   */
  pauseOnHover?: boolean

  /**
   * Reverse animation
   */
  reverse?: boolean

  /**
   * Animation duration (seconds)
   */
  duration?: number

  /**
   * Number of duplicated rows
   */
  repeat?: number

  /**
   * Enable edge fade mask
   */
  fade?: boolean

  /**
   * Vertical scrolling
   */
  vertical?: boolean

  /**
   * Disable animation
   */
  disabled?: boolean
}

export function Marquee({
  className,
  children,
  direction = "left",
  pauseOnHover = true,
  reverse = false,
  duration = 25,
  repeat = 2,
  fade = false,
  vertical,
  disabled = false,
  ...props
}: MarqueeProps) {
  const id = React.useId()

  const isVertical =
    vertical || direction === "up" || direction === "down"

  const animationName = React.useMemo(() => {
    if (isVertical) {
      return direction === "down"
        ? `marquee-down-${id}`
        : `marquee-up-${id}`
    }

    return direction === "right"
      ? `marquee-right-${id}`
      : `marquee-left-${id}`
  }, [direction, id, isVertical])

  const maskStyle = fade
    ? isVertical
      ? {
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }
      : {
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }
    : undefined

  return (
    <>
      <style>{`
        @keyframes marquee-left-${id} {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }

        @keyframes marquee-right-${id} {
          from { transform: translateX(-50%); }
          to { transform: translateX(0%); }
        }

        @keyframes marquee-up-${id} {
          from { transform: translateY(0%); }
          to { transform: translateY(-50%); }
        }

        @keyframes marquee-down-${id} {
          from { transform: translateY(-50%); }
          to { transform: translateY(0%); }
        }
      `}</style>

      <div
        className={cn(
          "relative overflow-hidden",
          isVertical ? "h-full" : "w-full",
          className
        )}
        style={maskStyle}
        {...props}
      >
        <div
          className={cn(
            "flex shrink-0 will-change-transform",
            isVertical ? "flex-col" : "flex-row",
            pauseOnHover && "group"
          )}
          style={{
            animation:
              disabled
                ? undefined
                : `${animationName} ${duration}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {Array.from({ length: repeat }).map((_, i) => (
            <div
              key={i}
              aria-hidden={i > 0}
              className={cn(
                "flex shrink-0",
                isVertical
                  ? "min-h-full flex-col"
                  : "min-w-full flex-row"
              )}
              style={{
                animationPlayState: "running",
              }}
            >
              {children}
            </div>
          ))}
        </div>

        {pauseOnHover && !disabled && (
          <style>{`
            .group:hover {
              animation-play-state: paused !important;
            }

            @media (prefers-reduced-motion: reduce) {
              .group {
                animation: none !important;
                transform: none !important;
              }
            }
          `}</style>
        )}
      </div>
    </>
  )
}

export function MarqueeItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        className
      )}
      {...props}
    />
  )
}

export default Marquee