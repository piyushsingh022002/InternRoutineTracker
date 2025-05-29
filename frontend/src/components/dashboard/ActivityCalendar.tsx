import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ActivityLog } from '../../types';
import { Card } from '../common';

interface ActivityCalendarProps {
  activityLogs: ActivityLog[];
  month?: Date;
}

const CalendarContainer = styled(Card)`
  width: 100%;
  padding: 1.5rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const WeekdaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Weekday = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6c757d;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCell = styled(motion.div)<{ $isCurrentMonth: boolean; $hasActivity: boolean; $isToday: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isToday ? '600' : '400')};
  color: ${(props) => {
    if (!props.$isCurrentMonth) return '#adb5bd';
    if (props.$isToday) return '#fff';
    return '#495057';
  }};
  background-color: ${(props) => {
    if (props.$isToday) return '#4a6cf7';
    if (props.$hasActivity) return '#d4edda';
    return 'transparent';
  }};
  border: ${(props) => (props.$isToday ? 'none' : '1px solid #dee2e6')};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${(props) => {
      if (props.$isToday) return '#3a5ce5';
      if (props.$hasActivity) return '#c3e6cb';
      return '#f8f9fa';
    }};
  }
`;

const StreakIndicator = styled.div<{ $streakCount: number }>`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: ${(props) => {
    if (props.$streakCount >= 7) return '#28a745';
    if (props.$streakCount >= 3) return '#ffc107';
    return '#6c757d';
  }};
  color: #fff;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DayCellWrapper = styled.div`
  position: relative;
`;

const Legend = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6c757d;
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activityLogs,
  month = new Date(),
}) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = monthStart.getDay();
  
  // Create an array of days to display, including padding days from previous and next months
  const calendarDays = [];
  
  // Add padding days from previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the current month
  calendarDays.push(...daysInMonth);
  
  // Add padding days from next month to complete the grid
  const remainingDays = 7 - (calendarDays.length % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      calendarDays.push(null);
    }
  }
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  const getActivityForDay = (day: Date | null) => {
    if (!day) return null;
    
    return activityLogs.find((log) => {
      const logDate = new Date(log.date);
      return isSameDay(logDate, day);
    });
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthTitle>{format(month, 'MMMM yyyy')}</MonthTitle>
      </CalendarHeader>
      
      <WeekdaysRow>
        {weekdays.map((weekday) => (
          <Weekday key={weekday}>{weekday}</Weekday>
        ))}
      </WeekdaysRow>
      
      <DaysGrid>
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }
          
          const activity = getActivityForDay(day);
          const isToday = isSameDay(day, today);
          const hasActivity = !!activity?.hasNote;
          
          return (
            <DayCellWrapper key={day.toString()}>
              <DayCell
                $isCurrentMonth={true}
                $hasActivity={hasActivity}
                $isToday={isToday}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
              >
                {format(day, 'd')}
              </DayCell>
              {activity && activity.streakCount > 1 && (
                <StreakIndicator $streakCount={activity.streakCount}>
                  {activity.streakCount}
                </StreakIndicator>
              )}
            </DayCellWrapper>
          );
        })}
      </DaysGrid>
      
      <Legend>
        <LegendItem>
          <LegendColor $color="#d4edda" />
          <span>Note Added</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#4a6cf7" />
          <span>Today</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#28a745" />
          <span>Streak (7+ days)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#ffc107" />
          <span>Streak (3-6 days)</span>
        </LegendItem>
      </Legend>
    </CalendarContainer>
  );
};

export default ActivityCalendar;
