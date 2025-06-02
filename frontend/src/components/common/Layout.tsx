import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  /* Responsive breakpoints */
  @media (max-width: 1280px) {
    max-width: 1024px;
  }
  
  @media (max-width: 1024px) {
    max-width: 768px;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 1.5rem;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      {!hideFooter && <Footer />}
    </LayoutContainer>
  );
};

export default Layout;
