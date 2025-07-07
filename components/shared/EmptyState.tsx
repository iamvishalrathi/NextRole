'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: string;
  containerSize?: 'sm' | 'md' | 'lg';
  title: string;
  description: string;
  primaryAction?: {
    text: string;
    href: string;
    icon?: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
    icon?: string;
  };
  className?: string;
}

const EmptyState = ({
  icon = '/user.png',
  containerSize = 'md',
  title,
  description,
  primaryAction,
  secondaryAction,
  className = ''
}: EmptyStateProps) => {
  const containerSizes = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48'
  };

  const iconSizes = {
    sm: 48,
    md: 64,
    lg: 96
  };

  const actualIconSize = iconSizes[containerSize];

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center w-full ${className}`}>
      <div className="relative mb-6">
        <div className={`${containerSizes[containerSize]} rounded-full blue-gradient-dark flex items-center justify-center border-2 border-primary-200/30 shadow-lg`}>
          <Image
            src={icon}
            alt="Empty state"
            width={actualIconSize}
            height={actualIconSize}
            className="opacity-80"
          />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-primary-100 mb-3">{title}</h2>
      <p className="text-light-400 text-sm max-w-md leading-relaxed mb-6">
        {description}
      </p>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {primaryAction && (
            <Button asChild className="btn-primary">
              <Link href={primaryAction.href}>
                {primaryAction.icon && (
                  <Image src={primaryAction.icon} alt="" width={16} height={16} className="mr-2" />
                )}
                {primaryAction.text}
              </Link>
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant="outline">
              <Link href={secondaryAction.href}>
                {secondaryAction.icon && (
                  <Image src={secondaryAction.icon} alt="" width={16} height={16} className="mr-2" />
                )}
                {secondaryAction.text}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
