import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common';

interface MediaUploadProps {
  existingMedia: string[];
  onMediaChange: (files: File[], existingUrls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;

const UploadArea = styled.div`
  border: 2px dashed #ced4da;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
  cursor: pointer;
  
  &:hover, &.dragging {
    border-color: #4a6cf7;
    background-color: rgba(74, 108, 247, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #6c757d;
`;

const UploadText = styled.div`
  color: #495057;
  margin-bottom: 1rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const MediaPreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

const MediaPreview = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #495057;
  padding: 0.5rem;
  font-size: 0.75rem;
`;

const FileIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const FileName = styled.div`
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
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

const HelperText = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.5rem;
`;

const MediaUpload: React.FC<MediaUploadProps> = ({
  existingMedia,
  onMediaChange,
  maxFiles = 5,
  acceptedTypes = 'image/*,.pdf'
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>(existingMedia);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = files.length + existingUrls.length + newFiles.length;
      
      if (totalFiles <= maxFiles) {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onMediaChange(updatedFiles, existingUrls);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const totalFiles = files.length + existingUrls.length + newFiles.length;
      
      if (totalFiles <= maxFiles) {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onMediaChange(updatedFiles, existingUrls);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onMediaChange(updatedFiles, existingUrls);
  };

  const handleRemoveExisting = (index: number) => {
    const updatedUrls = [...existingUrls];
    updatedUrls.splice(index, 1);
    setExistingUrls(updatedUrls);
    onMediaChange(files, updatedUrls);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileTypeIcon = (fileName: string) => {
    if (fileName.match(/\.(pdf)$/i)) {
      return '📄';
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return '📝';
    } else {
      return '📎';
    }
  };

  const getTruncatedFileName = (fileName: string, maxLength = 15) => {
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const name = fileName.substring(0, fileName.lastIndexOf('.'));
    
    if (name.length <= maxLength - 3 - (extension?.length || 0)) {
      return fileName;
    }
    
    return `${name.substring(0, maxLength - 3 - (extension?.length || 0))}...${extension}`;
  };

  const totalFiles = files.length + existingUrls.length;
  const remainingFiles = maxFiles - totalFiles;

  return (
    <Container>
      {totalFiles < maxFiles && (
        <UploadArea
          className={isDragging ? 'dragging' : ''}
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon>📁</UploadIcon>
          <UploadText>
            Drag and drop files here, or click to select files
          </UploadText>
          <Button variant="outline" size="small" type="button">
            Select Files
          </Button>
          <HiddenInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept={acceptedTypes}
          />
        </UploadArea>
      )}
      
      {totalFiles > 0 && (
        <MediaPreviewContainer>
          <AnimatePresence>
            {files.map((file, index) => (
              <MediaPreview
                key={`file-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {file.type.startsWith('image/') ? (
                  <MediaImage src={URL.createObjectURL(file)} alt="Preview" />
                ) : (
                  <MediaFile>
                    <FileIcon>{getFileTypeIcon(file.name)}</FileIcon>
                    <FileName>{getTruncatedFileName(file.name)}</FileName>
                  </MediaFile>
                )}
                <RemoveButton onClick={() => handleRemoveFile(index)}>
                  ×
                </RemoveButton>
              </MediaPreview>
            ))}
            
            {existingUrls.map((url, index) => (
              <MediaPreview
                key={`url-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <MediaImage src={url} alt="Media" />
                ) : (
                  <MediaFile>
                    <FileIcon>{getFileTypeIcon(url)}</FileIcon>
                    <FileName>{getTruncatedFileName(url.split('/').pop() || 'file')}</FileName>
                  </MediaFile>
                )}
                <RemoveButton onClick={() => handleRemoveExisting(index)}>
                  ×
                </RemoveButton>
              </MediaPreview>
            ))}
          </AnimatePresence>
        </MediaPreviewContainer>
      )}
      
      <HelperText>
        {remainingFiles > 0
          ? `You can upload ${remainingFiles} more file${remainingFiles !== 1 ? 's' : ''} (${totalFiles}/${maxFiles})`
          : `Maximum number of files reached (${maxFiles}/${maxFiles})`}
      </HelperText>
    </Container>
  );
};

export default MediaUpload;
