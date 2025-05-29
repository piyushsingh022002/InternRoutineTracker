import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNotes } from '../context/NotesContext';

const ViewNoteContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: 2rem;
`;

const NoteCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const NoteTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const NoteDate = styled.p`
  font-size: 0.875rem;
  color: var(--text-light);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
`;

const EditButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  display: inline-block;
  text-align: center;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
`;

const DeleteButton = styled(Button)`
  background-color: var(--danger-color);
  color: white;
  border: none;

  &:hover {
    background-color: var(--danger-hover);
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  margin-bottom: 1rem;
  transition: var(--transition);

  &:hover {
    color: var(--primary-color);
  }
`;

const NoteContent = styled.div`
  line-height: 1.6;
  margin-bottom: 2rem;
  white-space: pre-wrap;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const NoteTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-sm);
`;

const MediaSection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
`;

const MediaTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const MediaItem = styled.div`
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
`;

const MediaImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const MediaDocument = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
  text-decoration: none;
  padding: 1rem;
  text-align: center;
  font-weight: 500;

  &:hover {
    background-color: rgba(79, 70, 229, 0.2);
  }
`;

const DocumentIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.5rem;
  color: var(--text-light);
`;

const ErrorMessage = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
  text-align: center;
`;

const ConfirmDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
`;

const DialogContent = styled(motion.div)`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
`;

const DialogTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const DialogText = styled.p`
  margin-bottom: 1.5rem;
  color: var(--text-light);
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);

  &:hover {
    background-color: var(--bg-color);
  }
`;

const ConfirmButton = styled(Button)`
  background-color: var(--danger-color);
  color: white;
  border: none;

  &:hover {
    background-color: var(--danger-hover);
  }
`;

const ViewNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNote, deleteNote, currentNote, isLoading, error } = useNotes();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  
  useEffect(() => {
    if (id) {
      getNote(id);
    }
  }, [id]);
  
  const handleDelete = async () => {
    if (id) {
      try {
        await deleteNote(id);
        navigate('/dashboard');
      } catch (err) {
        // Error is handled by the notes context
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Check if URL is an image
  const isImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/i) !== null;
  };
  
  if (isLoading) {
    return (
      <ViewNoteContainer>
        <NoteCard>
          <LoadingSpinner>Loading...</LoadingSpinner>
        </NoteCard>
      </ViewNoteContainer>
    );
  }
  
  if (error) {
    return (
      <ViewNoteContainer>
        <NoteCard>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton to="/dashboard">← Back to Dashboard</BackButton>
        </NoteCard>
      </ViewNoteContainer>
    );
  }
  
  if (!currentNote) {
    return (
      <ViewNoteContainer>
        <NoteCard>
          <ErrorMessage>Note not found</ErrorMessage>
          <BackButton to="/dashboard">← Back to Dashboard</BackButton>
        </NoteCard>
      </ViewNoteContainer>
    );
  }
  
  return (
    <ViewNoteContainer>
      <NoteCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton to="/dashboard">← Back to Dashboard</BackButton>
        
        <NoteHeader>
          <div>
            <NoteTitle>{currentNote.title}</NoteTitle>
            <NoteDate>{formatDate(currentNote.createdAt)}</NoteDate>
          </div>
          <ButtonGroup>
            <EditButton to={`/notes/${id}/edit`}>Edit</EditButton>
            <DeleteButton onClick={() => setShowDeleteConfirm(true)}>Delete</DeleteButton>
          </ButtonGroup>
        </NoteHeader>
        
        <NoteContent>{currentNote.content}</NoteContent>
        
        {currentNote.tags && currentNote.tags.length > 0 && (
          <NoteTags>
            {currentNote.tags.map((tag, index) => (
              <NoteTag key={index}>{tag}</NoteTag>
            ))}
          </NoteTags>
        )}
        
        {currentNote.mediaUrls && currentNote.mediaUrls.length > 0 && (
          <MediaSection>
            <MediaTitle>Attachments</MediaTitle>
            <MediaGrid>
              {currentNote.mediaUrls.map((url, index) => (
                <MediaItem key={index}>
                  {isImageUrl(url) ? (
                    <MediaImage src={url} alt={`Attachment ${index + 1}`} />
                  ) : (
                    <MediaDocument href={url} target="_blank" rel="noopener noreferrer">
                      <DocumentIcon>📄</DocumentIcon>
                      <span>Document {index + 1}</span>
                    </MediaDocument>
                  )}
                </MediaItem>
              ))}
            </MediaGrid>
          </MediaSection>
        )}
      </NoteCard>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DialogContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DialogTitle>Delete Note</DialogTitle>
            <DialogText>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogText>
            <DialogButtons>
              <CancelButton onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </CancelButton>
              <ConfirmButton onClick={handleDelete}>
                Delete
              </ConfirmButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </ViewNoteContainer>
  );
};

export default ViewNote;
