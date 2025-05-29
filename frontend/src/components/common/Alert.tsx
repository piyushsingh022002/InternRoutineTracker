import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  showIcon?: boolean;
}

const getAlertColor = (variant: AlertVariant) => {
  switch (variant) {
    case 'success':
      return {
        bg: '#d4edda',
        border: '#c3e6cb',
        text: '#155724',
        icon: '✓',
      };
    case 'error':
      return {
        bg: '#f8d7da',
        border: '#f5c6cb',
        text: '#721c24',
        icon: '✕',
      };
    case 'warning':
      return {
        bg: '#fff3cd',
        border: '#ffeeba',
        text: '#856404',
        icon: '⚠',
      };
    case 'info':
      return {
        bg: '#d1ecf1',
        border: '#bee5eb',
        text: '#0c5460',
        icon: 'ℹ',
      };
    default:
      return {
        bg: '#d1ecf1',
        border: '#bee5eb',
        text: '#0c5460',
        icon: 'ℹ',
      };
  }
};

const AlertContainer = styled(motion.div)<{ $variant: AlertVariant }>`
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  
  background-color: ${(props) => getAlertColor(props.$variant).bg};
  border: 1px solid ${(props) => getAlertColor(props.$variant).border};
  color: ${(props) => getAlertColor(props.$variant).text};
`;

const IconContainer = styled.div`
  margin-right: 0.75rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const AlertMessage = styled.div`
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  color: inherit;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
  showIcon = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Call onClose after exit animation
        }
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Call onClose after exit animation
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <AlertContainer
          $variant={variant}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {showIcon && (
            <IconContainer>{getAlertColor(variant).icon}</IconContainer>
          )}
          <ContentContainer>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertMessage>{message}</AlertMessage>
          </ContentContainer>
          {onClose && (
            <CloseButton onClick={handleClose}>×</CloseButton>
          )}
        </AlertContainer>
      )}
    </AnimatePresence>
  );
};

export default Alert;
