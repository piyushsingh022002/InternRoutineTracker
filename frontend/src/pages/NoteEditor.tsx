import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useNotes } from "../context/NotesContext";
import { FaStickyNote, FaDownload, FaTimes, FaCheck } from "react-icons/fa";
import { jsPDF } from "jspdf";

// Updated EditorCard to accept hover state props for border effects
const EditorCard = styled(motion.div)<{ isCancelHovered: boolean; isSaveHovered: boolean }>`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  transition: border 0.3s ease; /* Added for smooth border transition */
  border: 2px solid
    ${({ isCancelHovered, isSaveHovered }) =>
      isCancelHovered
        ? "var(--danger-color)" /* Red border for Cancel hover */
        : isSaveHovered
        ? "var(--secondary-color)" /* Green border for Save hover */
        : "transparent"}; /* Default transparent border */
`;

const EditorContainer = styled.div`
  min-height: 100vh;
  width: 1430px;
  background-color: var(--bg-color);
  padding: 2rem;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const EditorTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  font-family: "Roboto", sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    color: var(--primary-hover);
  }

  svg {
    font-size: 1.5rem;
    transition: transform 0.3s ease;
    &:hover {
      transform: rotate(15deg);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--text-light);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:hover {
    background-color: var(--bg-color);
  }

  svg {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:disabled {
    background-color: var(--text-light);
    cursor: not-allowed;
  }

  svg {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const DangerButton = styled(Button)`
  background-color: var(--danger-color);
  color: white;
  border: none;

  &:hover {
    background-color: var(--danger-hover);
  }
`;

// Reverted Form to original styling (removed hover-related styles)
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.875rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.875rem;
  min-height: 200px;
  resize: vertical;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid Krebs-border-color);
  border-radius: var(--radius);
  min-height: 42px;
  transition: var(--transition);

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
`;

const TagText = styled.span`
  font-weight: 500;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;

  &:hover {
    background-color: rgba(79, 70, 229, 0.2);
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  font-size: 0.875rem;
  padding: 0.25rem;
`;

const FileUploadContainer = styled.div`
  border: 2px dashed var(--border-color);
  border-radius: var(--radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(79, 70, 229, 0.05);
  }
`;

const FileUploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-light);
`;

const FileUploadText = styled.p`
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const FileUploadSubtext = styled.p`
  font-size: 0.75rem;
  color: var(--text-light);
`;

const FileInput = styled.input`
  display: none;
`;

const FilePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const FilePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
`;

const FilePreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FilePreviewDocument = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem;
`;

const RemoveFileButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: rgba(239, 68, 68, 0.8);
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--danger-color);
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const DownloadButton = styled(Button)`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:hover {
    background-color: var(--secondary-hover);
  }

  svg {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    notes,
    getNote,
    createNote,
    updateNote,
    clearCurrentNote,
    currentNote,
    isLoading,
    error,
  } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    content?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);

  const isEditMode = !!id;

  // Load note data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      getNote(id);
    }

    return () => {
      clearCurrentNote();
    };
  }, [isEditMode, id]);

  // Set form data when current note changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setTags(currentNote.tags || []);
      setFileUrls(currentNote.mediaUrls || []);
    }
  }, [currentNote]);

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Validate file types
      const validFiles = newFiles.filter((file) => {
        const fileType = file.type;
        return fileType.startsWith("image/") || fileType === "application/pdf";
      });

      // Add new files
      setFiles([...files, ...validFiles]);

      // Create object URLs for preview
      const newFileUrls = validFiles.map((file) => URL.createObjectURL(file));
      setFileUrls([...fileUrls, ...newFileUrls]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newFileUrls = [...fileUrls];
    URL.revokeObjectURL(newFileUrls[index]);
    newFileUrls.splice(index, 1);
    setFileUrls(newFileUrls);
  };

  // Form validation
  const validateForm = () => {
    const errors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    }

    if (!content.trim()) {
      errors.content = "Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSaving(true);

      try {
        const noteData = {
          title,
          content,
          tags,
          mediaUrls: fileUrls,
        };

        if (isEditMode && id) {
          await updateNote(id, noteData);
        } else {
          await createNote(noteData);
        }

        navigate("/dashboard");
      } catch (err) {
        // Error is handled by the notes context
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };

  // Handle PDF download
  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text("Note", 20, 20);
  //   doc.setFontSize(12);
  //   doc.text(`Title: ${title}`, 20, 30);
  //   doc.text("Content:", 20, 40);
  //   doc.text(content, 20, 50, { maxWidth: 170 });
  //   doc.text(`Tags: ${tags.join(", ")}`, 20, 90);
  //   doc.save(`${title || "note"}.pdf`);
  // };

 const handleDownloadPDF = (imageFile) => {
  const doc = new jsPDF();

  try {
    // Add text content
    doc.setFontSize(16);
    doc.text("Note", 20, 20);
    doc.setFontSize(12);
    doc.text(`Title: ${title || "Untitled"}`, 20, 30);
    doc.text("Content:", 20, 40);
    doc.text(content || "No content", 20, 50, { maxWidth: 170 });
    doc.text(`Tags: ${tags && tags.length ? tags.join(", ") : "No tags"}`, 20, 90);

    // Handle image if provided
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imgData = e.target.result; // Base64 string
          // Add image to PDF (adjust x, y, width, height as needed)
          doc.addImage(imgData, "JPEG", 20, 100, 100, 100);
          // Save the PDF after image is added
          doc.save(`${title || "note"}.pdf`);
        } catch (error) {
          console.error("Error adding image to PDF:", error);
          // Save PDF without image if image fails
          doc.save(`${title || "note"}.pdf`);
        }
      };
      reader.onerror = () => {
        console.error("Error reading image file");
        // Save PDF without image if reading fails
        doc.save(`${title || "note"}.pdf`);
      };
      reader.readAsDataURL(imageFile); // Convert image to base64
    } else {
      // Save PDF immediately if no image is provided
      console.log("No image provided, saving PDF without image");
      doc.save(`${title || "note"}.pdf`);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Attempt to save PDF even if an error occurs
    doc.save(`${title || "note"}.pdf`);
  }
};

  return (
    <EditorContainer>
      {/* Pass hover states to EditorCard */}
      <EditorCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        isCancelHovered={isCancelHovered}
        isSaveHovered={isSaveHovered}
      >
        <EditorHeader>
          <EditorTitle>
            <FaStickyNote />
            {isEditMode ? "Edit Note" : "Create New Note"}
          </EditorTitle>
          <ButtonGroup>
            <SecondaryButton
              type="button"
              onClick={handleCancel}
              onMouseEnter={() => setIsCancelHovered(true)}
              onMouseLeave={() => setIsCancelHovered(false)}
            >
              Cancel
              <FaTimes />
            </SecondaryButton>
            <PrimaryButton
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              onMouseEnter={() => setIsSaveHovered(true)}
              onMouseLeave={() => setIsSaveHovered(false)}
            >
              {isSaving ? "Saving..." : "Save Note"}
              <FaCheck />
            </PrimaryButton>
          </ButtonGroup>
        </EditorHeader>

        {error && (
          <motion.div
            className="alert alert-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
            {formErrors.title && (
              <ErrorMessage>{formErrors.title}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
            />
            {formErrors.content && (
              <ErrorMessage>{formErrors.content}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput>
              {tags.map((tag, index) => (
                <Tag key={index}>
                  <TagText>{tag}</TagText>
                  <RemoveTagButton type="button" onClick={() => removeTag(tag)}>
                    ×
                  </RemoveTagButton>
                </Tag>
              ))}
              <TagInput
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={addTag}
                placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
              />
            </TagsInput>
          </FormGroup>

          <FormGroup>
            <Label>Attachments</Label>
            <FileUploadContainer
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <FileInput
                id="file-upload"
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
              <FileUploadIcon>📎</FileUploadIcon>
              <FileUploadText>Click to upload files</FileUploadText>
              <FileUploadSubtext>
                Supports images and PDF documents
              </FileUploadSubtext>
            </FileUploadContainer>

            {fileUrls.length > 0 && (
              <FilePreviewContainer>
                {fileUrls.map((url, index) => (
                  <FilePreview key={index}>
                    {url.startsWith("blob:") ||
                    url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <FilePreviewImage src={url} alt={`Preview ${index}`} />
                    ) : (
                      <FilePreviewDocument>PDF Document</FilePreviewDocument>
                    )}
                    <RemoveFileButton
                      type="button"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </RemoveFileButton>
                  </FilePreview>
                ))}
              </FilePreviewContainer>
            )}
          </FormGroup>

          <DownloadButton type="button" onClick={handleDownloadPDF}>
            Download as PDF
            <FaDownload />
          </DownloadButton>
        </Form>
      </EditorCard>
    </EditorContainer>
  );
};

export default NoteEditor;










































// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import styled from "styled-components";
// import { useNotes } from "../context/NotesContext";
// import { FaStickyNote } from "react-icons/fa";
// import { jsPDF } from "jspdf";
// import { FaDownload } from "react-icons/fa";
// import { FaTimes, FaCheck } from 'react-icons/fa';

// const EditorContainer = styled.div`
//   min-height: 100vh;
//   width: 1430px;
//   background-color: var(--bg-color);
//   padding: 2rem;
// `;

// const EditorCard = styled(motion.div)`
//   background-color: white;
//   border-radius: var(--radius-lg);
//   box-shadow: var(--shadow-lg);
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 2rem;
// `;

// const EditorHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 2rem;
// `;

// const EditorTitle = styled.h1`
//   font-size: 1.5rem;
//   font-weight: 600;
//   color: var(--primary-color);
//   font-family: "Roboto", sans-serif;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   transition: transform 0.3s ease, color 0.3s ease;

//   &:hover {
//     transform: scale(1.05);
//     color: var(--primary-hover);
//   }

//   svg {
//     font-size: 1.5rem;
//     transition: transform 0.3s ease;
//     &:hover {
//       transform: rotate(15deg);
//     }
//   }
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
// `;

// const Button = styled.button`
//   padding: 0.5rem 1rem;
//   border-radius: var(--radius);
//   font-weight: 500;
//   cursor: pointer;
//   transition: var(--transition);
// `;

// const SecondaryButton = styled(Button)`
//   background-color: transparent;
//   color: var(--textures-light);
//   border: 1px solid var(--border-color);
//   display: flex;
//   align-items: center;
//   gap: 0.5rem; // Space for icon
//   position: relative;

//   &:hover {
//     background-color: var(--bg-color);
//   }

//   svg {
//     opacity: 0; // Hidden by default
//     transition: opacity 0.3s ease;
//   }

//   &:hover svg {
//     opacity: 1; // Show icon on hover
//   }
// `;

// const PrimaryButton = styled(Button)`
//   background-color: var(--primary-color);
//   color: white;
//   border: none;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem; // Space for icon
//   position: relative;

//   &:hover {
//     background-color: var(--primary-hover);
//   }

//   &:disabled {
//     background-color: var(--text-light);
//     cursor: not-allowed;
//   }

//   svg {
//     opacity: 0; // Hidden by default
//     transition: opacity 0.3s ease;
//   }

//   &:hover svg {
//     opacity: 1; // Show icon on hover
//   }
// `;

// const DangerButton = styled(Button)`
//   background-color: var(--danger-color);
//   color: white;
//   border: none;

//   &:hover {
//     background-color: var(--danger-hover);
//   }
// `;

// // const Form = styled.form`
// //   display: flex;
// //   flex-direction: column;
// //   gap: 1.5rem;
// // `;

// // updated Form style for Red/Green Border on hovering
// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
//   transition: border 0.3s ease; // Added for smooth border transition
//   border: 2px solid transparent; // Default transparent border

//   /* Red border when Cancel button is hovered */
//   ${SecondaryButton}:hover ~ & {
//     border: 2px solid var(--danger-color);
//   }

//   /* Green border when Save button is hovered */
//   ${PrimaryButton}:hover ~ & {
//     border: 2px solid var(--secondary-color);
//   }
// `;

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const Label = styled.label`
//   font-size: 0.875rem;
//   font-weight: 500;
// `;

// const Input = styled.input`
//   padding: 0.75rem;
//   border: 1px solid var(--border-color);
//   border-radius: var(--radius);
//   font-size: 0.875rem;
//   transition: var(--transition);

//   &:focus {
//     outline: none;
//     border-color: var(--primary-color);
//     box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
//   }
// `;

// const Textarea = styled.textarea`
//   padding: 0.75rem;
//   border: 1px solid var(--border-color);
//   border-radius: var(--radius);
//   font-size: 0.875rem;
//   min-height: 200px;
//   resize: vertical;
//   transition: var(--transition);

//   &:focus {
//     outline: none;
//     border-color: var(--primary-color);
//     box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
//   }
// `;

// const TagsInput = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
//   padding: 0.5rem;
//   border: 1px solid var(--border-color);
//   border-radius: var(--radius);
//   min-height: 42px;
//   transition: var(--transition);

//   &:focus-within {
//     border-color: var(--primary-color);
//     box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
//   }
// `;

// const Tag = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.25rem;
//   padding: 0.25rem 0.5rem;
//   background-color: rgba(79, 70, 229, 0.1);
//   color: var(--primary-color);
//   border-radius: var(--radius-sm);
//   font-size: 0.75rem;
// `;

// const TagText = styled.span`
//   font-weight: 500;
// `;

// const RemoveTagButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 0.75rem;
//   color: var(--primary-color);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 16px;
//   height: 16px;
//   border-radius: 50%;

//   &:hover {
//     background-color: rgba(79, 70, 229, 0.2);
//   }
// `;

// const TagInput = styled.input`
//   flex: 1;
//   min-width: 100px;
//   border: none;
//   outline: none;
//   font-size: 0.875rem;
//   padding: 0.25rem;
// `;

// const FileUploadContainer = styled.div`
//   border: 2px dashed var(--border-color);
//   border-radius: var(--radius);
//   padding: 2rem;
//   text-align: center;
//   cursor: pointer;
//   transition: var(--transition);

//   &:hover {
//     border-color: var(--primary-color);
//     background-color: rgba(79, 70, 229, 0.05);
//   }
// `;

// const FileUploadIcon = styled.div`
//   font-size: 2rem;
//   margin-bottom: 1rem;
//   color: var(--text-light);
// `;

// const FileUploadText = styled.p`
//   color: var(--text-light);
//   margin-bottom: 0.5rem;
// `;

// const FileUploadSubtext = styled.p`
//   font-size: 0.75rem;
//   color: var(--text-light);
// `;

// const FileInput = styled.input`
//   display: none;
// `;

// const FilePreviewContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 1rem;
//   margin-top: 1rem;
// `;

// const FilePreview = styled.div`
//   position: relative;
//   width: 100px;
//   height: 100px;
//   border-radius: var(--radius);
//   overflow: hidden;
//   box-shadow: var(--shadow);
// `;

// const FilePreviewImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

// const FilePreviewDocument = styled.div`
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: rgba(79, 70, 229, 0.1);
//   color: var(--primary-color);
//   font-size: 0.75rem;
//   font-weight: 500;
//   text-align: center;
//   padding: 0.5rem;
// `;

// const RemoveFileButton = styled.button`
//   position: absolute;
//   top: 0.25rem;
//   right: 0.25rem;
//   background-color: rgba(239, 68, 68, 0.8);
//   color: white;
//   border: none;
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 0.75rem;
//   cursor: pointer;
//   transition: var(--transition);

//   &:hover {
//     background-color: var(--danger-color);
//   }
// `;

// const ErrorMessage = styled.div`
//   color: var(--danger-color);
//   font-size: 0.75rem;
//   margin-top: 0.25rem;
// `;
// // Pdh button css added here
// const DownloadButton = styled(Button)`
//   background-color: var(--secondary-color); // Use a distinct color for download
//   color: white;
//   border: none;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem; // Space between text and icon
//   position: relative;

//   &:hover {
//     background-color: var(--secondary-hover);
//   }

//   svg {
//     opacity: 0; // Hidden by default
//     transition: opacity 0.3s ease; // Smooth icon appearance
//   }

//   &:hover svg {
//     opacity: 1; // Show icon on hover
//   }
// `;

// const NoteEditor: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const {
//     notes,
//     getNote,
//     createNote,
//     updateNote,
//     clearCurrentNote,
//     currentNote,
//     isLoading,
//     error,
//   } = useNotes();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [tagInput, setTagInput] = useState("");
//   const [tags, setTags] = useState<string[]>([]);
//   const [files, setFiles] = useState<File[]>([]);
//   const [fileUrls, setFileUrls] = useState<string[]>([]);
//   const [formErrors, setFormErrors] = useState<{
//     title?: string;
//     content?: string;
//   }>({});
//   const [isSaving, setIsSaving] = useState(false);

//   const isEditMode = !!id;

//   // Load note data if in edit mode
//   useEffect(() => {
//     if (isEditMode && id) {
//       getNote(id);
//     }

//     return () => {
//       clearCurrentNote();
//     };
//   }, [isEditMode, id]);

//   // Set form data when current note changes
//   useEffect(() => {
//     if (currentNote) {
//       setTitle(currentNote.title);
//       setContent(currentNote.content);
//       setTags(currentNote.tags || []);
//       setFileUrls(currentNote.mediaUrls || []);
//     }
//   }, [currentNote]);

//   // Handle tag input
//   const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       addTag();
//     }
//   };

//   const addTag = () => {
//     const trimmedTag = tagInput.trim();
//     if (trimmedTag && !tags.includes(trimmedTag)) {
//       setTags([...tags, trimmedTag]);
//       setTagInput("");
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   // Handle file upload
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);

//       // Validate file types
//       const validFiles = newFiles.filter((file) => {
//         const fileType = file.type;
//         return fileType.startsWith("image/") || fileType === "application/pdf";
//       });

//       // Add new files
//       setFiles([...files, ...validFiles]);

//       // Create object URLs for preview
//       const newFileUrls = validFiles.map((file) => URL.createObjectURL(file));
//       setFileUrls([...fileUrls, ...newFileUrls]);
//     }
//   };

//   const removeFile = (index: number) => {
//     const newFiles = [...files];
//     newFiles.splice(index, 1);
//     setFiles(newFiles);

//     const newFileUrls = [...fileUrls];
//     URL.revokeObjectURL(newFileUrls[index]);
//     newFileUrls.splice(index, 1);
//     setFileUrls(newFileUrls);
//   };

//   // Form validation
//   const validateForm = () => {
//     const errors: { title?: string; content?: string } = {};

//     if (!title.trim()) {
//       errors.title = "Title is required";
//     }

//     if (!content.trim()) {
//       errors.content = "Content is required";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (validateForm()) {
//       setIsSaving(true);

//       try {
//         // In a real app, you would upload files to a server here
//         // and get back URLs to store in the note

//         const noteData = {
//           title,
//           content,
//           tags,
//           mediaUrls: fileUrls,
//         };

//         if (isEditMode && id) {
//           await updateNote(id, noteData);
//         } else {
//           await createNote(noteData);
//         }

//         navigate("/dashboard");
//       } catch (err) {
//         // Error is handled by the notes context
//       } finally {
//         setIsSaving(false);
//       }
//     }
//   };

//   // Handle cancel
//   const handleCancel = () => {
//     navigate(-1);
//   };

//   //handle pdf download function here
//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Note", 20, 20);
//     doc.setFontSize(12);
//     doc.text(`Title: ${title}`, 20, 30);
//     doc.text("Content:", 20, 40);
//     doc.text(content, 20, 50, { maxWidth: 170 }); // Wrap content
//     doc.text(`Tags: ${tags.join(", ")}`, 20, 90);
//     doc.save(`${title || "note"}.pdf`); // Save with title or default name
//   };

//   return (
//     <EditorContainer>
//       <EditorCard
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <EditorHeader>
//           <EditorTitle>
//             <FaStickyNote />
//             {isEditMode ? "Edit Note" : "Create New Note"}
//           </EditorTitle>
//           <ButtonGroup>
//   <SecondaryButton
//     type="button"
//     onClick={handleCancel}
//     onMouseEnter={() => setIsCancelHovered(true)}
//     onMouseLeave={() => setIsCancelHovered(false)}
//   >
//     Cancel
//     <FaTimes /> {/* Added cancel icon */}
//   </SecondaryButton>
//   <PrimaryButton
//     type="button"
//     onClick={handleSubmit}
//     disabled={isSaving}
//     onMouseEnter={() => setIsSaveHovered(true)}
//     onMouseLeave={() => setIsSaveHovered(false)}
//   >
//     {isSaving ? 'Saving...' : 'Save Note'}
//     <FaCheck /> {/* Added save icon */}
//   </PrimaryButton>
// </ButtonGroup>
//         </EditorHeader>

//         {error && (
//           <motion.div
//             className="alert alert-error"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             {error}
//           </motion.div>
//         )}

//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label htmlFor="title">Title</Label>
//             <Input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Note title"
//             />
//             {formErrors.title && (
//               <ErrorMessage>{formErrors.title}</ErrorMessage>
//             )}
//           </FormGroup>

//           <FormGroup>
//             <Label htmlFor="content">Content</Label>
//             <Textarea
//               id="content"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Write your note here..."
//             />
//             {formErrors.content && (
//               <ErrorMessage>{formErrors.content}</ErrorMessage>
//             )}
//           </FormGroup>

//           <FormGroup>
//             <Label htmlFor="tags">Tags</Label>
//             <TagsInput>
//               {tags.map((tag, index) => (
//                 <Tag key={index}>
//                   <TagText>{tag}</TagText>
//                   <RemoveTagButton type="button" onClick={() => removeTag(tag)}>
//                     ×
//                   </RemoveTagButton>
//                 </Tag>
//               ))}
//               <TagInput
//                 type="text"
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//                 onKeyDown={handleTagInputKeyDown}
//                 onBlur={addTag}
//                 placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
//               />
//             </TagsInput>
//           </FormGroup>

//           <FormGroup>
//             <Label>Attachments</Label>
//             <FileUploadContainer
//               onClick={() => document.getElementById("file-upload")?.click()}
//             >
//               <FileInput
//                 id="file-upload"
//                 type="file"
//                 multiple
//                 accept="image/*,application/pdf"
//                 onChange={handleFileChange}
//               />
//               <FileUploadIcon>📎</FileUploadIcon>
//               <FileUploadText>Click to upload files</FileUploadText>
//               <FileUploadSubtext>
//                 Supports images and PDF documents
//               </FileUploadSubtext>
//             </FileUploadContainer>

//             {fileUrls.length > 0 && (
//               <FilePreviewContainer>
//                 {fileUrls.map((url, index) => (
//                   <FilePreview key={index}>
//                     {url.startsWith("blob:") ||
//                     url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
//                       <FilePreviewImage src={url} alt={`Preview ${index}`} />
//                     ) : (
//                       <FilePreviewDocument>PDF Document</FilePreviewDocument>
//                     )}
//                     <RemoveFileButton
//                       type="button"
//                       onClick={() => removeFile(index)}
//                     >
//                       ×
//                     </RemoveFileButton>
//                   </FilePreview>
//                 ))}
//               </FilePreviewContainer>
//             )}
//           </FormGroup>
//           {/* Added download button here  */}
//           <DownloadButton type="button" onClick={handleDownloadPDF}>
//             Download as PDF
//             <FaDownload /> 
//           </DownloadButton>
//         </Form>
//       </EditorCard>
//     </EditorContainer>
//   );
// };

// export default NoteEditor;


