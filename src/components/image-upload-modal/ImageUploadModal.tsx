import { 
  useState, 
  useCallback,
  type DragEvent,
  type ChangeEvent, 
  useEffect
} from 'react';
import {
  Box,
  Modal,
  Paper,
  Typography,
  Button,
  styled,
  type SxProps,
  type Theme,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { AppButton } from '../app-button/AppButton';
import { ACCEPTED_IMAGE_EXTENSIONS, ACCEPTED_IMAGE_TYPES } from './image-type';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { clearErrors, fileResetStatus, fileUploadAsync, setUploadPreviews } from '../../redux/slices/file-slice';
import { UploadStatus } from '../../redux/type/upload-status';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ImageUploadModalProps {
  onClose: () => void;
}

interface DropZoneProps {
  isDragActive: boolean;
}

interface FileWithPreview {
  file: File; 
  preview: string;
}

const DropZone = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})<DropZoneProps>(({ theme, isDragActive }) => ({
  border: `2px dashed ${theme.palette.primary.light}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragActive
    ? theme.palette.action.hover
    : theme.palette.background.paper,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'border-color']),
}));

const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none'
};

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ onClose }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { loading, uploadStatus, error, fileUploadPreviews } = useSelector((state: RootState) => state.file);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (uploadStatus !== UploadStatus.UPLOADING) {
          dispatch(fileResetStatus());
      }
       
      // Clean up object URLs to prevent memory leaks
      fileUploadPreviews.forEach(({ preview }) => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    dispatch(clearErrors());
    
    if (uploadStatus === UploadStatus.SUCCESS) {
      onClose();
      dispatch(fileResetStatus()); 

    } 
  }, [uploadStatus, onClose, dispatch]);

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      .filter(file => {
        return ACCEPTED_IMAGE_TYPES.includes(file.type) || 
              ACCEPTED_IMAGE_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
      })
      .map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      dispatch(setUploadPreviews([...fileUploadPreviews, ...droppedFiles]));
    }
  }, [fileUploadPreviews, dispatch]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles: FileWithPreview[] = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      dispatch(setUploadPreviews([...fileUploadPreviews, ...selectedFiles]));
    }
  };

  const handleUpload = () => {
    dispatch(fileUploadAsync(fileUploadPreviews));
  };

  const removeFile = (index: number) => {
    const newFiles = [...fileUploadPreviews];
    const removedFile = newFiles.splice(index, 1)[0];
    if (removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }
    console.log("removed file", newFiles);
    dispatch(setUploadPreviews(newFiles));
  };

  const sizeLabel = (size: number): string => {
    if (typeof size === 'number' && !isNaN(size)) {
        if (size >= 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(size / 1024).toFixed(2)} KB`;
        }
    }

    return 'Unknown size';            
  }

  const progressPercentage = (transferredBytes?: number, totalBytes?: number) => {
    if (totalBytes) {
      return Math.round(((transferredBytes ?? 0) / (totalBytes ?? 1)) * 100);
    }
    console.log("files count", fileUploadPreviews.length);
    return 0;
  }

  const progressExists = (transferredBytes?: number) => {
    if (transferredBytes) {
      return transferredBytes > 0;
    }
    return false;
  }

  return (
    <Modal open onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" gutterBottom>
          Upload Images
        </Typography>

        <DropZone
          elevation={0}
          isDragActive={isDragging}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <CloudUploadIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="body1">
            {isDragging ? 'Drop your files here' : 'Drag & drop images here or click to browse'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: JPG, PNG, GIF, SVG.
          </Typography>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </DropZone>

        {fileUploadPreviews.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Files:
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {fileUploadPreviews.map(({file, preview, transferredBytes, totalBytes}, index) => (
                <Box
                  key={`${file.name}-${index}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  {preview ? (
                    <img 
                      src={preview} 
                      alt={file.name}
                      style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 8 }}
                    />
                  ) : (
                    <InsertDriveFileIcon sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {file.name.substring(0, 20)}{file.name.length > 20 ? '...' : ''}
                  </Typography>
                  {progressExists(transferredBytes) && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }} className="mr-3">   
                      {progressPercentage(transferredBytes, totalBytes) === 100 && (
                        <CheckCircleIcon className="text-green-500 mr-2" />
                      )}
                      {progressPercentage(transferredBytes, totalBytes) < 100 && (<CircularProgress 
                        size={20} 
                        variant="determinate" 
                        value={progressPercentage(transferredBytes, totalBytes)}
                        className="mr-1"
                      />)}
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        {`${progressPercentage(transferredBytes, totalBytes)}%`}
                      </Typography>
                   
                    </Box>
                    
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {sizeLabel(file.size)}
                  </Typography>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => removeFile(index)}
                    sx={{ ml: 1 }}
                    disabled={loading.imageUploading}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error && `Error: ${error}`}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <AppButton variant="outlined" onClick={onClose} text='Cancel'/>
          <AppButton 
                variant="contained" 
                onClick={handleUpload} 
                isDisabled={ fileUploadPreviews.length === 0 || loading.imageUploading } 
                isLoading={ loading.imageUploading }
                text={ loading.imageUploading ? 'Uploading...' : 'Upload' }/>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageUploadModal;