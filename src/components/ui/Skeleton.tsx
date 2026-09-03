import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClass = "animate-pulse bg-gray-200";
  
  let variantClass = "rounded";
  if (variant === 'circular') variantClass = "rounded-full";
  if (variant === 'text') variantClass = "rounded h-4 w-full";
  
  return (
    <div className={`${baseClass} ${variantClass} ${className}`}></div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-[220px] rounded-xl mb-6" />
      
      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Badges/Category */}
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="w-20 h-5 rounded-full" />
          <Skeleton className="w-16 h-4" />
        </div>
        
        {/* Title */}
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-4" />
        
        {/* Rating & Features */}
        <div className="flex space-x-2 mb-4">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
        
        <div className="space-y-2 mb-6">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
        </div>
        
        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-end space-x-2 mb-4">
            <Skeleton className="w-32 h-8" />
          </div>
          
          {/* Button */}
          <Skeleton className="w-full h-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProductList() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-6 mb-4">
      <Skeleton className="w-full sm:w-[240px] h-[240px] rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col py-2">
        <Skeleton className="w-32 h-5 rounded-full mb-3" />
        <Skeleton className="w-3/4 h-7 mb-2" />
        <Skeleton className="w-1/2 h-4 mb-4" />
        
        <div className="space-y-2 mb-6">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>
        
        <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="w-full sm:w-48 h-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between">
        <Skeleton className="w-1/3 h-8" />
        <Skeleton className="w-1/4 h-8" />
      </div>
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/6 h-4" />
            <Skeleton className="w-1/12 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
