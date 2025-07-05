'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ProfileCompletionBannerProps {
    userId: string;
    isRecruiter: boolean;
    onClose?: () => void;
}

const ProfileCompletionBanner = ({ userId, isRecruiter, onClose }: ProfileCompletionBannerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    if (!isVisible) return null;

    return (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                            Complete Your Profile
                        </h3>
                        <p className="text-sm text-yellow-700">
                            {isRecruiter
                                ? "Complete your company profile to create and manage interviews effectively"
                                : "Complete your profile to create and take interviews"
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/user/${userId}/profile/complete`}>
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            Complete Profile
                        </Button>
                    </Link>
                    <button
                        onClick={handleClose}
                        className="text-yellow-600 hover:text-yellow-800"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionBanner;
