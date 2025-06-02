import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import type { Notification } from '../types';
import { useAuth } from './AuthContext';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Notifications state interface
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

// Initial notifications state
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Notifications action types
type NotificationsAction =
  | { type: 'GET_NOTIFICATIONS_REQUEST' }
  | { type: 'GET_NOTIFICATIONS_SUCCESS'; payload: Notification[] }
  | { type: 'GET_NOTIFICATIONS_FAILURE'; payload: string }
  | { type: 'MARK_AS_READ_REQUEST' }
  | { type: 'MARK_AS_READ_SUCCESS'; payload: string }
  | { type: 'MARK_AS_READ_FAILURE'; payload: string }
  | { type: 'MARK_ALL_AS_READ_REQUEST' }
  | { type: 'MARK_ALL_AS_READ_SUCCESS' }
  | { type: 'MARK_ALL_AS_READ_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Notifications reducer
const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsAction
): NotificationsState => {
  switch (action.type) {
    case 'GET_NOTIFICATIONS_REQUEST':
    case 'MARK_AS_READ_REQUEST':
    case 'MARK_ALL_AS_READ_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'GET_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
        isLoading: false,
      };
    case 'MARK_AS_READ_SUCCESS':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: state.unreadCount - 1,
        isLoading: false,
      };
    case 'MARK_ALL_AS_READ_SUCCESS':
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
        isLoading: false,
      };
    case 'GET_NOTIFICATIONS_FAILURE':
    case 'MARK_AS_READ_FAILURE':
    case 'MARK_ALL_AS_READ_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Notifications context type
interface NotificationsContextType extends NotificationsState {
  getNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
}

// Create notifications context
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Notifications provider component
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Get all notifications
  const getNotifications = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'GET_NOTIFICATIONS_REQUEST' });
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      dispatch({ type: 'GET_NOTIFICATIONS_SUCCESS', payload: res.data.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch notifications';
      dispatch({ type: 'GET_NOTIFICATIONS_FAILURE', payload: errorMessage });
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    dispatch({ type: 'MARK_AS_READ_REQUEST' });
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      dispatch({ type: 'MARK_AS_READ_SUCCESS', payload: id });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to mark notification as read';
      dispatch({ type: 'MARK_AS_READ_FAILURE', payload: errorMessage });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    dispatch({ type: 'MARK_ALL_AS_READ_REQUEST' });
    try {
      await axios.put(`${API_URL}/notifications/read-all`);
      dispatch({ type: 'MARK_ALL_AS_READ_SUCCESS' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to mark all notifications as read';
      dispatch({ type: 'MARK_ALL_AS_READ_FAILURE', payload: errorMessage });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getNotifications();
    }
  }, [isAuthenticated]);

  return (
    <NotificationsContext.Provider
      value={{
        ...state,
        getNotifications,
        markAsRead,
        markAllAsRead,
        clearError,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
