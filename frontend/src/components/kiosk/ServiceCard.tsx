import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${color} rounded-2xl p-8 shadow-xl text-white 
                 active:scale-95 transition-all duration-200 
                 hover:shadow-2xl min-h-[160px] w-full
                 touch-manipulation select-none flex flex-col items-center justify-center
                 text-center group`}
    >
      <Icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-200" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90 leading-relaxed">{description}</p>
    </button>
  );
};