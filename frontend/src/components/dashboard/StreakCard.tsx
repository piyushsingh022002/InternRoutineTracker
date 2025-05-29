import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../common';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

const StyledCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1.5rem 0;
`;

const StreakContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StreakItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StreakLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const StreakValue = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #4a6cf7;
`;

const StreakEmoji = styled.div`
  font-size: 1.5rem;
  margin-top: 0.5rem;
`;

const getStreakEmoji = (streak: number) => {
  if (streak === 0) return '😢';
  if (streak < 3) return '🙂';
  if (streak < 7) return '😊';
  if (streak < 14) return '🔥';
  if (streak < 30) return '🚀';
  return '⭐';
};

const StreakMessage = styled.p`
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #495057;
`;

const getStreakMessage = (streak: number) => {
  if (streak === 0) {
    return "You don't have an active streak. Create a note today to start!";
  }
  if (streak === 1) {
    return "You've started your streak! Keep it going by adding a note tomorrow.";
  }
  if (streak < 7) {
    return `Great job! You've maintained your streak for ${streak} days. Keep going!`;
  }
  if (streak < 14) {
    return `Impressive! A ${streak}-day streak shows your dedication. You're building a great habit!`;
  }
  if (streak < 30) {
    return `Amazing! ${streak} days of consistent notes. You're on fire! 🔥`;
  }
  return `Incredible! A ${streak}-day streak is a remarkable achievement. You're a true productivity master! ⭐`;
};

const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, longestStreak }) => {
  return (
    <StyledCard>
      <Title>Your Productivity Streak</Title>
      
      <StreakContainer>
        <StreakItem>
          <StreakLabel>Current Streak</StreakLabel>
          <StreakValue
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {currentStreak}
          </StreakValue>
          <StreakEmoji>{getStreakEmoji(currentStreak)}</StreakEmoji>
        </StreakItem>
        
        <StreakItem>
          <StreakLabel>Longest Streak</StreakLabel>
          <StreakValue
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
          >
            {longestStreak}
          </StreakValue>
          <StreakEmoji>{getStreakEmoji(longestStreak)}</StreakEmoji>
        </StreakItem>
      </StreakContainer>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <StreakMessage>{getStreakMessage(currentStreak)}</StreakMessage>
      </motion.div>
    </StyledCard>
  );
};

export default StreakCard;
