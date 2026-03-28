"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInScrollProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    duration?: number;
}

export function FadeInScroll({
    children,
    className,
    delay = 0,
    direction = "up",
    distance = 30,
    duration = 700,
}: FadeInScrollProps) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // Once it's visible, we don't need to observe it anymore
                        if (domRef.current) {
                            observer.unobserve(domRef.current);
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } // Trigger slightly before it comes fully into view
        );

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const getTransform = () => {
        if (direction === "none") return undefined;
        if (direction === "up") return `translateY(${distance}px)`;
        if (direction === "down") return `translateY(-${distance}px)`;
        if (direction === "left") return `translateX(${distance}px)`;
        if (direction === "right") return `translateX(-${distance}px)`;
        return undefined;
    };

    return (
        <div
            ref={domRef}
            className={cn("transition-all ease-out", className)}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translate(0, 0)" : getTransform(),
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
                willChange: "opacity, transform",
            }}
        >
            {children}
        </div>
    );
}
