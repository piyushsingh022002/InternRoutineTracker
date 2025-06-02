import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { Notification } from '../../types';
import { Card, Button } from '../common';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationContainer = styled(Card)`
  width: 100%;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NotificationCount = styled.span`
  background-color: #4a6cf7;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

const NotificationItem = styled(motion.div)<{ $isRead: boolean }>`
  display: flex;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${(props) => (props.$isRead ? '#f8f9fa' : '#e9f0ff')};
  border-left: 4px solid ${(props) => (props.$isRead ? '#ced4da' : '#4a6cf7')};
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationMessage = styled.div`
  font-size: 0.875rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
`;

const NotificationAction = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    return timeAgo;
  };
  
  const getFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPpp'); // e.g., "Apr 29, 2023, 3:30 PM"
  };

  return (
    <NotificationContainer>
      <Header>
        <Title>
          Notifications
          {unreadCount > 0 && <NotificationCount>{unreadCount}</NotificationCount>}
        </Title>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="small" 
            onClick={onMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </Header>
      
      {isLoading ? (
        <LoadingState>Loading notifications...</LoadingState>
      ) : notifications.length === 0 ? (
        <EmptyState>No notifications to display</EmptyState>
      ) : (
        <NotificationList>
          <AnimatePresence>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                $isRead={notification.isRead}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <NotificationContent>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationTime title={getFullDate(notification.createdAt)}>
                    {formatNotificationTime(notification.createdAt)}
                  </NotificationTime>
                </NotificationContent>
                
                {!notification.isRead && (
                  <NotificationAction>
                    <Button 
                      variant="outline" 
                      size="small" 
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  </NotificationAction>
                )}
              </NotificationItem>
            ))}
          </AnimatePresence>
        </NotificationList>
      )}
    </NotificationContainer>
  );
};

export default NotificationList;
