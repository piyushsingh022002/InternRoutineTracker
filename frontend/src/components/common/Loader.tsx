import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullPage?: boolean;
  text?: string;
}

const getLoaderSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '1.5rem';
    case 'medium':
      return '2.5rem';
    case 'large':
      return '3.5rem';
    default:
      return '2.5rem';
  }
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const FullPageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SpinnerContainer = styled.div<{ $size: string }>`
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  position: relative;
`;

const Spinner = styled.div<{ $size: string; $color: string }>`
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${(props) => props.$color};
  animation: ${spin} 0.8s linear infinite;
`;

const LoaderText = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #333;
  text-align: center;
`;

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  color = '#4a6cf7',
  fullPage = false,
  text,
}) => {
  const loaderSize = getLoaderSize(size);
  
  const loaderContent = (
    <LoaderContainer>
      <SpinnerContainer $size={loaderSize}>
        <Spinner $size={loaderSize} $color={color} />
      </SpinnerContainer>
      {text && <LoaderText>{text}</LoaderText>}
    </LoaderContainer>
  );

  if (fullPage) {
    return <FullPageContainer>{loaderContent}</FullPageContainer>;
  }

  return loaderContent;
};

export default Loader;
