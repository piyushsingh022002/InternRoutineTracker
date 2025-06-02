import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useNotifications } from '../context/NotificationsContext';
import type { Note } from '../types';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
`;

const Header = styled.header`
  background-color: white;
  box-shadow: var(--shadow);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotificationIcon = styled.div`
  font-size: 1.25rem;
  color: var(--text-color);
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--danger-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const Username = styled.span`
  font-weight: 500;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  min-width: 200px;
  overflow: hidden;
  z-index: 20;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--bg-color);
  }
`;

const LogoutButton = styled(DropdownItem)`
  color: var(--danger-color);
  font-weight: 500;
`;

const NotificationDropdown = styled(Dropdown)`
  min-width: 300px;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: ${(props) => (props.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.05)')};
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--bg-color);
  }
`;

const NotificationMessage = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const NotificationTime = styled.p`
  font-size: 0.75rem;
  color: var(--text-light);
`;

const EmptyNotifications = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: var(--text-light);
  font-size: 0.875rem;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const WelcomeText = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
`;

const CreateNoteButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const NoteCard = styled(motion(Link))`
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: block;
  color: var(--text-color);
  transition: var(--transition);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    color: var(--text-color);
  }
`;

const NoteDate = styled.p`
  font-size: 0.75rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const NoteTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoteContent = styled.p`
  font-size: 0.875rem;
  color: var(--text-light);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const NoteTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-sm);
`;

const EmptyNotes = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  grid-column: 1 / -1;
`;

const EmptyNotesIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-light);
`;

const EmptyNotesText = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EmptyNotesSubtext = styled.p`
  color: var(--text-light);
  margin-bottom: 1.5rem;
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { notes, getNotes } = useNotes();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Calculate stats
  const totalNotes = notes.length;
  const thisWeekNotes = notes.filter(note => {
    const noteDate = new Date(note.createdAt);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return noteDate >= weekStart;
  }).length;
  
  const streak = 5; // This would be calculated based on activity logs
  
  // Group notes by date (most recent first)
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Handle notification click
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    setShowNotifications(false);
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  // Toggle notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
  };
  
  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo>InternRoutineTracker</Logo>
          <NavActions>
            <NotificationBadge onClick={toggleNotifications}>
              <NotificationIcon>🔔</NotificationIcon>
              {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
              <AnimatePresence>
                {showNotifications && (
                  <NotificationDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          isRead={notification.isRead}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <NotificationMessage>{notification.message}</NotificationMessage>
                          <NotificationTime>
                            {new Date(notification.createdAt).toLocaleString()}
                          </NotificationTime>
                        </NotificationItem>
                      ))
                    ) : (
                      <EmptyNotifications>No notifications</EmptyNotifications>
                    )}
                  </NotificationDropdown>
                )}
              </AnimatePresence>
            </NotificationBadge>
            <UserMenu onClick={toggleUserMenu}>
              <Avatar>{getUserInitials()}</Avatar>
              <Username>{user?.username}</Username>
              <AnimatePresence>
                {showUserMenu && (
                  <Dropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem>Profile</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                  </Dropdown>
                )}
              </AnimatePresence>
            </UserMenu>
          </NavActions>
        </HeaderContent>
      </Header>
      
      <Content>
        <DashboardHeader>
          <WelcomeText>Welcome back, {user?.username}!</WelcomeText>
          <CreateNoteButton to="/notes/new">
            <span>+</span> New Note
          </CreateNoteButton>
        </DashboardHeader>
        
        <StatsGrid>
          <StatCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <StatTitle>Total Notes</StatTitle>
            <StatValue>{totalNotes}</StatValue>
          </StatCard>
          <StatCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <StatTitle>This Week</StatTitle>
            <StatValue>{thisWeekNotes}</StatValue>
          </StatCard>
          <StatCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <StatTitle>Current Streak</StatTitle>
            <StatValue>{streak} days</StatValue>
          </StatCard>
          <StatCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <StatTitle>Completion Rate</StatTitle>
            <StatValue>{totalNotes > 0 ? Math.round((thisWeekNotes / 7) * 100) : 0}%</StatValue>
          </StatCard>
        </StatsGrid>
        
        <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
        
        <NotesGrid>
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                to={`/notes/${note.id}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <NoteDate>{formatDate(note.createdAt)}</NoteDate>
                <NoteTitle>{note.title}</NoteTitle>
                <NoteContent>{note.content}</NoteContent>
                {note.tags && note.tags.length > 0 && (
                  <NoteTags>
                    {note.tags.map((tag, index) => (
                      <NoteTag key={index}>{tag}</NoteTag>
                    ))}
                  </NoteTags>
                )}
              </NoteCard>
            ))
          ) : (
            <EmptyNotes>
              <EmptyNotesIcon>📝</EmptyNotesIcon>
              <EmptyNotesText>No notes yet</EmptyNotesText>
              <EmptyNotesSubtext>
                Start tracking your daily activities by creating your first note.
              </EmptyNotesSubtext>
              <CreateNoteButton to="/notes/new">
                <span>+</span> Create Your First Note
              </CreateNoteButton>
            </EmptyNotes>
          )}
        </NotesGrid>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
