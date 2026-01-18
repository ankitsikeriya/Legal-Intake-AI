'use client';

import { useEffect, useState } from 'react';

export function MouseFollower() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsHidden(false);

            const target = e.target as HTMLElement;
            // Check if hovering over clickable elements
            const isClickable = target.closest('button') ||
                target.closest('a') ||
                target.closest('input') ||
                target.closest('textarea') ||
                target.closest('[role="button"]') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsPointer(!!isClickable);
        };

        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    if (isHidden) return null;

    return (
        <>
            <div
                className="fixed pointer-events-none z-[100] transition-transform duration-100 ease-out"
                style={{
                    left: position.x,
                    top: position.y,
                    transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
                }}
            >
                <div className={`
          rounded-full bg-indigo-500/10 border border-indigo-500/30 transition-all duration-300
          ${isPointer ? 'h-12 w-12' : 'h-8 w-8'}
        `} />
            </div>
            <div
                className="fixed pointer-events-none z-[100] transition-transform duration-300 ease-out"
                style={{
                    left: position.x,
                    top: position.y,
                    transform: `translate(-50%, -50%)`,
                }}
            >
                <div className="h-3 w-3 bg-indigo-600 rounded-full shadow-sm shadow-indigo-500/50" />
            </div>
        </>
    );
}
