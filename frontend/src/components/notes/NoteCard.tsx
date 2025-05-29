import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Note } from '../../types';
import { Card, Badge } from '../common';

interface NoteCardProps {
  note: Note;
}

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const NoteTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const NoteDate = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  white-space: nowrap;
  margin-left: 0.5rem;
`;

const NoteContent = styled.p`
  font-size: 0.875rem;
  color: #555;
  margin: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex-grow: 1;
`;

const NoteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MediaIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #6c757d;
`;

const MediaIcon = styled.span`
  margin-right: 0.25rem;
`;

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/notes/${note.id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard hoverable elevation="medium" onClick={handleClick}>
        <NoteHeader>
          <NoteTitle>{note.title}</NoteTitle>
          <NoteDate>{formatDate(note.createdAt)}</NoteDate>
        </NoteHeader>
        
        <NoteContent>{truncateContent(note.content)}</NoteContent>
        
        <NoteFooter>
          <TagsContainer>
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="primary" 
                size="small" 
                rounded
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge 
                variant="secondary" 
                size="small" 
                rounded
              >
                +{note.tags.length - 3}
              </Badge>
            )}
          </TagsContainer>
          
          {note.mediaUrls.length > 0 && (
            <MediaIndicator>
              <MediaIcon>🖼️</MediaIcon>
              {note.mediaUrls.length}
            </MediaIndicator>
          )}
        </NoteFooter>
      </StyledCard>
    </motion.div>
  );
};

export default NoteCard;
