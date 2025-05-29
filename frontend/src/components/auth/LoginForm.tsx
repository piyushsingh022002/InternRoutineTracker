import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types';
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

const ForgotPassword = styled.a`
  font-size: 0.875rem;
  color: #4a6cf7;
  text-align: right;
  text-decoration: none;
  margin-top: -1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled.div`
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

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) clearError();
    if (formError) setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!credentials.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    
    if (!credentials.password) {
      setFormError('Password is required');
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
      await login(credentials);
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
      <Title>Welcome Back</Title>
      
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
        placeholder="Enter your password"
        fullWidth
        required
        leftIcon={<span>🔒</span>}
      />
      
      <ForgotPassword href="#">Forgot password?</ForgotPassword>
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Login
      </Button>
      
      <RegisterLink>
        Don't have an account? <a href="/register">Register</a>
      </RegisterLink>
    </FormContainer>
  );
};

export default LoginForm;
