import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Note } from '../../types';
import { Button, Badge, Card } from '../common';

interface NoteDetailProps {
  note: Note;
  onDelete: () => void;
  isDeleting: boolean;
}

const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const Metadata = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.875rem;
`;

const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateLabel = styled.span`
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #212529;
  white-space: pre-wrap;
`;

const TagsSection = styled.div`
  margin-top: 1rem;
`;

const TagsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: #495057;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MediaSection = styled.div`
  margin-top: 1rem;
`;

const MediaTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  color: #495057;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const MediaItem = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: 150px;
`;

const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaFile = styled.a`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #495057;
  text-decoration: none;
  padding: 1rem;
`;

const FileIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const FileName = styled.div`
  text-align: center;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const NoteDetail: React.FC<NoteDetailProps> = ({ note, onDelete, isDeleting }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy h:mm a');
  };
  
  const handleEdit = () => {
    navigate(`/notes/${note.id}/edit`);
  };
  
  const getFileIcon = (url: string) => {
    if (url.match(/\.(pdf)$/i)) {
      return '📄';
    } else if (url.match(/\.(doc|docx)$/i)) {
      return '📝';
    } else {
      return '📎';
    }
  };
  
  const getFileName = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <Container padding="large" elevation="low">
      <Header>
        <TitleSection>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Title>{note.title}</Title>
          </motion.div>
          
          <Metadata>
            <DateInfo>
              <div>
                <DateLabel>Created:</DateLabel> {formatDate(note.createdAt)}
              </div>
              {note.updatedAt !== note.createdAt && (
                <div>
                  <DateLabel>Updated:</DateLabel> {formatDate(note.updatedAt)}
                </div>
              )}
            </DateInfo>
          </Metadata>
        </TitleSection>
        
        <ButtonGroup>
          <Button 
            variant="outline" 
            onClick={handleEdit}
            leftIcon="✏️"
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            onClick={onDelete}
            isLoading={isDeleting}
            leftIcon="🗑️"
          >
            Delete
          </Button>
        </ButtonGroup>
      </Header>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Content>{note.content}</Content>
      </motion.div>
      
      {note.tags.length > 0 && (
        <TagsSection>
          <TagsTitle>Tags</TagsTitle>
          <TagsContainer>
            {note.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="primary" 
                rounded
              >
                {tag}
              </Badge>
            ))}
          </TagsContainer>
        </TagsSection>
      )}
      
      {note.mediaUrls.length > 0 && (
        <MediaSection>
          <MediaTitle>Attachments</MediaTitle>
          <MediaGrid>
            {note.mediaUrls.map((url, index) => (
              <MediaItem key={index}>
                {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <MediaImage src={url} alt={`Attachment ${index + 1}`} />
                ) : (
                  <MediaFile href={url} target="_blank" rel="noopener noreferrer">
                    <FileIcon>{getFileIcon(url)}</FileIcon>
                    <FileName>{getFileName(url)}</FileName>
                  </MediaFile>
                )}
              </MediaItem>
            ))}
          </MediaGrid>
        </MediaSection>
      )}
    </Container>
  );
};

export default NoteDetail;
