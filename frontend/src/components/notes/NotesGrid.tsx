import React from 'react';
import styled from 'styled-components';
import { Note } from '../../types';
import NoteCard from './NoteCard';
import { Loader } from '../common';

interface NotesGridProps {
  notes: Note[];
  isLoading: boolean;
  emptyMessage?: string;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 1.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  width: 100%;
  margin-top: 1.5rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #6c757d;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: #495057;
  margin: 0;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 3rem 0;
`;

const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  isLoading,
  emptyMessage = 'No notes found. Create your first note to get started!',
}) => {
  if (isLoading) {
    return (
      <LoaderContainer>
        <Loader size="large" text="Loading notes..." />
      </LoaderContainer>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📝</EmptyIcon>
        <EmptyText>{emptyMessage}</EmptyText>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </GridContainer>
  );
};

export default NotesGrid;
