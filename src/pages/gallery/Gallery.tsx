import { Box, Grid, ToggleButton, ToggleButtonGroup,  CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ImageUploadModal from "../../components/image-upload-modal/ImageUploadModal";
import { AppButton } from "../../components/app-button/AppButton";
import { ImageCard } from "../../components/image-card/ImageCard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { deleteFileAsync, getImagesAsync, toggleFileUploadModal } from "../../redux/slices/file-slice";
import type { FileUpload } from "../../api/type/file.type";


export const Gallery: React.FC = () => {
  // const [uploadMode, setUploadMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const {files, loading, limit, page, imageUploadModalOpen} = useSelector((state: RootState) => state.file); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getImagesAsync({ page, limit }));
  }, [page, limit, dispatch]);

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'grid' | 'list',
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const toggleImageUploadModal = (state: boolean) => {
    dispatch(toggleFileUploadModal(state));
  }

  const handleDeleteImage = (file: FileUpload) => {
    dispatch(deleteFileAsync([file]));
  }

  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', pt: 4 }}>
      {!loading.images && 'No images found. Upload some images to get started!'}
      {renderLoadingState()}
    </Box>
  );

  const renderGridView = () => (
    <Box>
      <Grid container spacing={1}>
        {files!.map((file, index) => (
          <Grid 
          key={file.path + index}
          component="div" // Add this line to fix the type error
        >
          <ImageCard image={file} viewMode={viewMode} onDelete={() => handleDeleteImage(file)}/>
        </Grid>
        ))} 
      </Grid>
      {renderLoadingState()}
    </Box>
    

   
  );

  const renderListView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
      {files!.map((file, index) => (
        <ImageCard image={file} viewMode={viewMode} key={file.path + index} onDelete={() => handleDeleteImage(file)}/>
      ))}
      {renderLoadingState()}
    </Box>
  );

  const renderLoadingState = () => {
    if (loading.images) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
  };

  const renderContent = () => {

    if (files!.length === 0) {
      return renderEmptyState();
    }

    return viewMode === 'grid' ? renderGridView() : renderListView();
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '80vh', p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        
        <AppButton
          variant="outlined"
          text="Upload Images"
          onClick={() => toggleImageUploadModal(true)}
          icon={<CloudUploadIcon fontSize="small"/>}
        />
      </Box>

      {renderContent()}

      {imageUploadModalOpen && (
        <ImageUploadModal 
          onClose={() => toggleImageUploadModal(false)} 
        />
      )}
    </Box>
  );
};