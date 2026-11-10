import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Menthfy-branded loading spinner supporting inline, card, and fullscreen modes.
 *
 * @param {object} props
 * @param {'inline'|'card'|'fullscreen'} [props.variant='card'] - Layout variant.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Spinner size for inline mode.
 * @param {string} [props.label] - Primary loading text.
 * @param {string} [props.sublabel] - Optional secondary helper text.
 * @param {string} [props.className] - Extra container CSS classes.
 */
export default function LoadingSpinner({
  variant = 'card',
  size = 'md',
  label = 'Carregando...',
  sublabel = '',
  className = '',
}) {
  const sizeClass =
    size === 'sm' ? 'size-4' : size === 'lg' ? 'size-9' : 'size-5';

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-2 text-sm font-medium text-gray-600 ${className}`}>
        <Loader2 className={`${sizeClass} animate-spin text-[#5F688F] shrink-0`} />
        {label && <span>{label}</span>}
      </span>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center bg-[#F4F6FB] px-4 ${className}`}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-12 rounded-full border-4 border-[#5F688F]/20 border-t-[#5F688F] animate-spin" />
          <div className="space-y-1">
            <p className="font-['Baumans'] text-2xl font-bold text-[#5F688F] tracking-tight mb-0">
              menthfy
            </p>
            {label && (
              <p className="text-sm font-medium text-gray-600 mb-0">
                {label}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs flex flex-col items-center justify-center text-center gap-3 ${className}`}
    >
      <div className="size-12 rounded-2xl bg-[#5F688F]/10 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#5F688F]" />
      </div>
      {label && <p className="text-sm font-semibold text-gray-800 mb-0">{label}</p>}
      {sublabel && <p className="text-xs text-gray-500 max-w-sm mb-0">{sublabel}</p>}
    </div>
  );
}

