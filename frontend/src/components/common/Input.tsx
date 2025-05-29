import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #333;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ $hasError: boolean; $hasLeftIcon: boolean; $hasRightIcon: boolean }>`
  width: 100%;
  padding: 0.75rem;
  padding-left: ${(props) => (props.$hasLeftIcon ? '2.5rem' : '0.75rem')};
  padding-right: ${(props) => (props.$hasRightIcon ? '2.5rem' : '0.75rem')};
  border: 1px solid ${(props) => (props.$hasError ? '#dc3545' : '#ced4da')};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? '#dc3545' : '#4a6cf7')};
    box-shadow: 0 0 0 2px ${(props) => (props.$hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(74, 108, 247, 0.25)')};
  }
  
  &::placeholder {
    color: #adb5bd;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const IconContainer = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$position === 'left' ? 'left: 0.75rem;' : 'right: 0.75rem;')}
  transform: translateY(-50%);
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const HelperText = styled.div`
  color: #6c757d;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    return (
      <InputContainer $fullWidth={fullWidth}>
        {label && <InputLabel>{label}</InputLabel>}
        <InputWrapper>
          {leftIcon && <IconContainer $position="left">{leftIcon}</IconContainer>}
          <StyledInput
            ref={ref}
            $hasError={!!error}
            $hasLeftIcon={!!leftIcon}
            $hasRightIcon={!!rightIcon}
            {...rest}
          />
          {rightIcon && <IconContainer $position="right">{rightIcon}</IconContainer>}
        </InputWrapper>
        {error && <ErrorText>{error}</ErrorText>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input;
