import React from 'react';

export type BadgeVariant =
  | 'success' // Green
  | 'warning' // Amber/Yellow
  | 'danger'  // Red/Coral
  | 'info'    // Blue
  | 'neutral' // Gray
  | 'extracted'; // Light green for code audit

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  size = 'md',
}) => {
  if (children === undefined || children === null || children === '') {
    return null;
  }
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
    info: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    neutral: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
    extracted: 'bg-[#DCFCE7] text-[#15803D] font-mono tracking-wider border-[#BBF7D0]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
