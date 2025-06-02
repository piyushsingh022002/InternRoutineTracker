import React from 'react';
import styled from 'styled-components';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  outlined?: boolean;
  className?: string;
}

const getBadgeColor = (variant: BadgeVariant, outlined: boolean) => {
  const colors = {
    primary: { bg: '#4a6cf7', text: '#ffffff' },
    secondary: { bg: '#6c757d', text: '#ffffff' },
    success: { bg: '#28a745', text: '#ffffff' },
    danger: { bg: '#dc3545', text: '#ffffff' },
    warning: { bg: '#ffc107', text: '#212529' },
    info: { bg: '#17a2b8', text: '#ffffff' },
  };

  if (outlined) {
    return {
      bg: 'transparent',
      text: colors[variant].bg,
      border: colors[variant].bg,
    };
  }

  return {
    bg: colors[variant].bg,
    text: colors[variant].text,
    border: 'transparent',
  };
};

const getBadgeSize = (size: BadgeSize) => {
  switch (size) {
    case 'small':
      return {
        padding: '0.2rem 0.5rem',
        fontSize: '0.75rem',
      };
    case 'medium':
      return {
        padding: '0.35rem 0.75rem',
        fontSize: '0.875rem',
      };
    case 'large':
      return {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
      };
    default:
      return {
        padding: '0.35rem 0.75rem',
        fontSize: '0.875rem',
      };
  }
};

const StyledBadge = styled.span<{
  $variant: BadgeVariant;
  $size: BadgeSize;
  $rounded: boolean;
  $outlined: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  
  background-color: ${(props) => getBadgeColor(props.$variant, props.$outlined).bg};
  color: ${(props) => getBadgeColor(props.$variant, props.$outlined).text};
  border: 1px solid ${(props) => getBadgeColor(props.$variant, props.$outlined).border};
  
  border-radius: ${(props) => (props.$rounded ? '9999px' : '4px')};
  padding: ${(props) => getBadgeSize(props.$size).padding};
  font-size: ${(props) => getBadgeSize(props.$size).fontSize};
`;

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = false,
  outlined = false,
  className,
}) => {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      $rounded={rounded}
      $outlined={outlined}
      className={className}
    >
      {children}
    </StyledBadge>
  );
};

export default Badge;
