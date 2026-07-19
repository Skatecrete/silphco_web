import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const BackArrowIcon: React.FC<IconProps> = ({ size = 24, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20,11H7.83l5.59,-5.59L12,4l-8,8 8,8 1.41,-1.41L7.83,13H20v-2z"/>
  </svg>
);

export const CartIcon: React.FC<IconProps> = ({ size = 24, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M7,18c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2zM17,18c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2zM7.8,7.2l0.8,5.8h8.4l3.2,-5.8H7.8zM5.2,5h14.6c0.7,0 1.2,0.7 1,1.4L18.4,12c-0.3,0.6 -1,1 -1.7,1H7.5l-0.5,3h12v2H5.5c-1.4,0 -2.3,-1.4 -1.7,-2.7L5.2,5z"/>
  </svg>
);

export const HelpIcon: React.FC<IconProps> = ({ size = 24, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M11,18h2v-2h-2v2zM12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10-4.48 10-10S17.52,2 12,2zM12,20c-4.41,0 -8,-3.59 -8,-8s3.59,-8 8,-8 8,3.59 8,8 -3.59,8 -8,8zM12,6c-2.21,0 -4,1.79 -4,4h2c0,-1.1 0.9,-2 2,-2s2,0.9 2,2c0,2 -3,1.75 -3,5h2c0,-2.25 3,-2.5 3,-5 0,-2.21 -1.79,-4 -4,-4z"/>
  </svg>
);

export const ClearIcon: React.FC<IconProps> = ({ size = 24, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12z"/>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12z"/>
  </svg>
);