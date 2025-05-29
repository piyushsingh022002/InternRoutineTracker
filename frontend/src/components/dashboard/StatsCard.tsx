import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../common';

interface StatsCardProps {
  totalNotes: number;
  thisWeekNotes: number;
  totalDays: number;
  completionRate: number;
}

const StyledCard = styled(Card)`
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1.5rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const StatItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #4a6cf7;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const ProgressContainer = styled.div`
  margin-top: 1.5rem;
  width: 100%;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ProgressTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
`;

const ProgressValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a6cf7;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)<{ $width: number }>`
  height: 100%;
  background-color: #4a6cf7;
  border-radius: 4px;
  width: ${(props) => `${props.$width}%`};
`;

const StatsCard: React.FC<StatsCardProps> = ({
  totalNotes,
  thisWeekNotes,
  totalDays,
  completionRate,
}) => {
  return (
    <StyledCard>
      <Title>Your Stats</Title>
      
      <StatsGrid>
        <StatItem
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatValue>{totalNotes}</StatValue>
          <StatLabel>Total Notes</StatLabel>
        </StatItem>
        
        <StatItem
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatValue>{thisWeekNotes}</StatValue>
          <StatLabel>Notes This Week</StatLabel>
        </StatItem>
        
        <StatItem
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatValue>{totalDays}</StatValue>
          <StatLabel>Days Tracked</StatLabel>
        </StatItem>
        
        <StatItem
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatValue>{completionRate}%</StatValue>
          <StatLabel>Completion Rate</StatLabel>
        </StatItem>
      </StatsGrid>
      
      <ProgressContainer>
        <ProgressLabel>
          <ProgressTitle>Overall Completion</ProgressTitle>
          <ProgressValue>{completionRate}%</ProgressValue>
        </ProgressLabel>
        <ProgressBarContainer>
          <ProgressBar 
            $width={completionRate}
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </ProgressBarContainer>
      </ProgressContainer>
    </StyledCard>
  );
};

export default StatsCard;
