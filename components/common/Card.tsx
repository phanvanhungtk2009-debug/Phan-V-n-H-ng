import React from 'react';

// FIX: Update CardProps to accept any standard div attributes (like onClick) by extending React.HTMLAttributes and spreading rest props.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
