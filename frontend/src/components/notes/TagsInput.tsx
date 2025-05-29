import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 45px;
  
  &:focus-within {
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.25);
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  font-size: 0.875rem;
  padding: 0.25rem;
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const Tag = styled(motion.div)`
  display: flex;
  align-items: center;
  background-color: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const TagText = styled.span`
  margin-right: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  
  &:hover {
    color: #dc3545;
  }
`;

const HelperText = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
`;

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add tags...',
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
      onChange([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <Container>
      <InputContainer>
        <AnimatePresence>
          {tags.map((tag, index) => (
            <Tag
              key={`${tag}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <TagText>{tag}</TagText>
              <RemoveButton type="button" onClick={() => removeTag(index)}>
                ×
              </RemoveButton>
            </Tag>
          ))}
        </AnimatePresence>
        
        <TagInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue.trim() && addTag()}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={tags.length >= maxTags}
        />
      </InputContainer>
      
      <HelperText>
        {tags.length >= maxTags 
          ? `Maximum of ${maxTags} tags reached` 
          : 'Press Enter to add a tag, Backspace to remove the last tag'}
      </HelperText>
    </Container>
  );
};

export default TagsInput;
