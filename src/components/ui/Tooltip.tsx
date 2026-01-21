'use client';

import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
  contentClassName,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const gap = 8;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top + scrollY - tooltipRect.height - gap;
        break;
      case 'bottom':
        x = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + scrollY + gap;
        break;
      case 'left':
        x = triggerRect.left + scrollX - tooltipRect.width - gap;
        y = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        x = triggerRect.right + scrollX + gap;
        y = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setCoords({ x, y });
  }, [position]);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay, disabled]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, updatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'animate-fade-in-up',
    bottom: 'animate-fade-in-up',
    left: 'animate-scale-in',
    right: 'animate-scale-in',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('inline-block', className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {mounted && isVisible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            'fixed z-[9999] px-3 py-2 max-w-xs',
            'text-sm text-gray-100',
            'bg-linear-to-br from-gray-800 to-gray-900',
            'backdrop-blur-xl',
            'border border-gray-700/50',
            'rounded-lg shadow-xl shadow-black/30',
            positionClasses[position],
            contentClassName
          )}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        >
          {/* Arrow indicator */}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-800 border-gray-700/50 rotate-45',
              position === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b',
              position === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2 border-l border-t',
              position === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r',
              position === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l'
            )}
            aria-hidden="true"
          />
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

// Info tooltip with icon
interface InfoTooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  className?: string;
}

export function InfoTooltip({ content, position = 'top', className }: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center',
          'w-4 h-4 rounded-full',
          'bg-gray-700/50 hover:bg-gray-600/50',
          'text-gray-400 hover:text-gray-300',
          'text-xs font-medium',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
          className
        )}
        aria-label="More information"
      >
        ?
      </button>
    </Tooltip>
  );
}
