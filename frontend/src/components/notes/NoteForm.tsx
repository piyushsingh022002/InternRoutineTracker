import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Note } from '../../types';
import { Button, Input, Alert } from '../common';

interface NoteFormProps {
  initialNote?: Partial<Note>;
  onSubmit: (noteData: Partial<Note>) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.25);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
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

const RemoveTagButton = styled.button`
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

const MediaPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const MediaPreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ced4da;
`;

const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaFile = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  color: #6c757d;
  font-size: 0.75rem;
  text-align: center;
  padding: 0.5rem;
`;

const RemoveMediaButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background-color: rgba(220, 53, 69, 0.8);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const NoteForm: React.FC<NoteFormProps> = ({
  initialNote = {},
  onSubmit,
  isLoading,
  error,
}) => {
  const [title, setTitle] = useState(initialNote.title || '');
  const [content, setContent] = useState(initialNote.content || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialNote.tags || []);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialNote.mediaUrls || []);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleRemoveMediaUrl = (url: string) => {
    setMediaUrls(mediaUrls.filter(mediaUrl => mediaUrl !== url));
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setFormError('Title is required');
      return false;
    }
    
    if (!content.trim()) {
      setFormError('Content is required');
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
      // In a real implementation, you would upload the media files first
      // and get back the URLs, then include those in the note data
      
      // For now, we'll just include the existing mediaUrls
      const noteData: Partial<Note> = {
        ...initialNote,
        title,
        content,
        tags,
        mediaUrls,
      };
      
      await onSubmit(noteData);
      
      // Reset form if it's a new note
      if (!initialNote.id) {
        setTitle('');
        setContent('');
        setTags([]);
        setMediaFiles([]);
        setMediaUrls([]);
      }
    } catch (err) {
      // Error is handled by the parent component
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {formError && (
        <Alert 
          variant="error" 
          message={formError} 
          onClose={() => setFormError(null)}
        />
      )}
      
      <FormGroup>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title"
          fullWidth
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="content">Content</Label>
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Input
          label="Tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags (press Enter to add)"
          helperText="Press Enter to add a tag"
          fullWidth
        />
        
        {tags.length > 0 && (
          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>
                <TagText>{tag}</TagText>
                <RemoveTagButton 
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </RemoveTagButton>
              </Tag>
            ))}
          </TagsContainer>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="media">Media</Label>
        <Input
          type="file"
          id="media"
          onChange={handleFileChange}
          multiple
          accept="image/*,.pdf"
          helperText="Upload images or PDF files"
          fullWidth
        />
        
        {(mediaFiles.length > 0 || mediaUrls.length > 0) && (
          <MediaPreviewContainer>
            {mediaFiles.map((file, index) => (
              <MediaPreview key={`file-${index}`}>
                {file.type.startsWith('image/') ? (
                  <MediaImage src={URL.createObjectURL(file)} alt="Preview" />
                ) : (
                  <MediaFile>{file.name}</MediaFile>
                )}
                <RemoveMediaButton 
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                >
                  ×
                </RemoveMediaButton>
              </MediaPreview>
            ))}
            
            {mediaUrls.map((url, index) => (
              <MediaPreview key={`url-${index}`}>
                {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <MediaImage src={url} alt="Media" />
                ) : (
                  <MediaFile>File</MediaFile>
                )}
                <RemoveMediaButton 
                  type="button"
                  onClick={() => handleRemoveMediaUrl(url)}
                >
                  ×
                </RemoveMediaButton>
              </MediaPreview>
            ))}
          </MediaPreviewContainer>
        )}
      </FormGroup>
      
      <ButtonGroup>
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isLoading}
          disabled={isLoading}
        >
          {initialNote.id ? 'Update Note' : 'Create Note'}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default NoteForm;
