import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { RegisterCredentials } from '../../types';
import { Button, Input, Alert } from '../common';

const FormContainer = styled(motion.form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const LoginLink = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: #4a6cf7;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PasswordRequirements = styled.ul`
  font-size: 0.75rem;
  color: #6c757d;
  margin: -1rem 0 0 1.5rem;
  padding: 0;
`;

const RegisterForm: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) clearError();
    if (formError) setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!credentials.username.trim()) {
      setFormError('Username is required');
      return false;
    }
    
    if (!credentials.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    if (!credentials.password) {
      setFormError('Password is required');
      return false;
    }
    
    if (credentials.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return false;
    }
    
    if (credentials.password !== credentials.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(credentials);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the AuthContext
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
    >
      <Title>Create Account</Title>
      
      {(error || formError) && (
        <Alert 
          variant="error" 
          message={formError || error || 'An error occurred'} 
          onClose={() => {
            if (error) clearError();
            if (formError) setFormError(null);
          }}
        />
      )}
      
      <Input
        label="Username"
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleChange}
        placeholder="Choose a username"
        fullWidth
        required
        leftIcon={<span>👤</span>}
      />
      
      <Input
        label="Email"
        type="email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Enter your email"
        fullWidth
        required
        leftIcon={<span>📧</span>}
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Create a password"
        fullWidth
        required
        leftIcon={<span>🔒</span>}
      />
      
      <PasswordRequirements>
        <li>At least 8 characters long</li>
        <li>Include uppercase and lowercase letters</li>
        <li>Include at least one number or special character</li>
      </PasswordRequirements>
      
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={credentials.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        fullWidth
        required
        leftIcon={<span>🔒</span>}
      />
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Register
      </Button>
      
      <LoginLink>
        Already have an account? <a href="/login">Login</a>
      </LoginLink>
    </FormContainer>
  );
};

export default RegisterForm;
