import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LandingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: rgba(79, 70, 229, 0.1);
  }
`;

const ButtonLink = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
`;

const Hero = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--text-color);

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: var(--text-light);
  margin-bottom: 2.5rem;
  max-width: 600px;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const PrimaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: rgba(79, 70, 229, 0.1);
  }
`;

const FeatureGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  width: 100%;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  transition: var(--transition);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-light);
  font-size: 0.875rem;
`;

const Footer = styled.footer`
  padding: 2rem;
  text-align: center;
  background-color: var(--bg-light);
  border-top: 1px solid var(--border-color);
  color: var(--text-light);
  font-size: 0.875rem;
`;

const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const featureItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <LandingContainer>
      <Header>
        <Logo>InternRoutineTracker</Logo>
        <NavLinks>
          <NavLink to="/login">Login</NavLink>
          <ButtonLink to="/register">Register</ButtonLink>
        </NavLinks>
      </Header>

      <Hero>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroTitle variants={itemVariants}>
            Track Your Daily Progress as an Intern
          </HeroTitle>
          <HeroSubtitle variants={itemVariants}>
            A simple yet powerful tool to keep track of your daily activities, notes, and progress during your internship journey.
          </HeroSubtitle>
          <ButtonGroup variants={itemVariants}>
            <PrimaryButton to="/register">Get Started</PrimaryButton>
            <SecondaryButton to="/login">Sign In</SecondaryButton>
          </ButtonGroup>

          <FeatureGrid variants={featureVariants}>
            <FeatureCard variants={featureItemVariants}>
              <FeatureIcon>📝</FeatureIcon>
              <FeatureTitle>Daily Notes</FeatureTitle>
              <FeatureDescription>
                Keep track of your daily activities, learnings, and achievements with easy-to-use note-taking.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard variants={featureItemVariants}>
              <FeatureIcon>🔔</FeatureIcon>
              <FeatureTitle>Smart Reminders</FeatureTitle>
              <FeatureDescription>
                Never miss a day with our intelligent reminder system that helps you stay consistent.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard variants={featureItemVariants}>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Progress Tracking</FeatureTitle>
              <FeatureDescription>
                Visualize your consistency and progress with intuitive dashboards and statistics.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </motion.div>
      </Hero>

      <Footer>
        &copy; {new Date().getFullYear()} InternRoutineTracker. All rights reserved.
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
