import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getButtonColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return {
        bg: '#4a6cf7',
        hover: '#3a5ce5',
        text: '#ffffff',
      };
    case 'secondary':
      return {
        bg: '#6c757d',
        hover: '#5a6268',
        text: '#ffffff',
      };
    case 'danger':
      return {
        bg: '#dc3545',
        hover: '#c82333',
        text: '#ffffff',
      };
    case 'success':
      return {
        bg: '#28a745',
        hover: '#218838',
        text: '#ffffff',
      };
    case 'outline':
      return {
        bg: 'transparent',
        hover: '#f8f9fa',
        text: '#4a6cf7',
        border: '#4a6cf7',
      };
    default:
      return {
        bg: '#4a6cf7',
        hover: '#3a5ce5',
        text: '#ffffff',
      };
  }
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return {
        padding: '0.25rem 0.5rem',
        fontSize: '0.875rem',
      };
    case 'medium':
      return {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
      };
    case 'large':
      return {
        padding: '0.75rem 1.5rem',
        fontSize: '1.125rem',
      };
    default:
      return {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
      };
  }
};

const StyledButton = styled(motion.button)<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  
  background-color: ${(props) => getButtonColor(props.$variant).bg};
  color: ${(props) => getButtonColor(props.$variant).text};
  border: ${(props) =>
    getButtonColor(props.$variant).border
      ? `1px solid ${getButtonColor(props.$variant).border}`
      : 'none'};
  
  padding: ${(props) => getButtonSize(props.$size).padding};
  font-size: ${(props) => getButtonSize(props.$size).fontSize};
  
  &:hover:not(:disabled) {
    background-color: ${(props) => getButtonColor(props.$variant).hover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      {...rest}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {leftIcon && leftIcon}
          {children}
          {rightIcon && rightIcon}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
