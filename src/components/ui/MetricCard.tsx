import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  description: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  description,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all hover:border-gray-300 ${className}`}
    >
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="my-2">
        <span className="text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
    </div>
  );
};
