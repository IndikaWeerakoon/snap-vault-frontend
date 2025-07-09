import { Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, IconButton, CircularProgress } from "@mui/material";
import type { FileUpload } from "../../api/type/file.type";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export const ImageCard = ({ image, viewMode, onDelete }: { image: FileUpload, viewMode: 'grid' | 'list' , onDelete?:() => void}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {loading, deletingFileIds} = useSelector((state: RootState) => state.file);
  const isDeleting = deletingFileIds?.includes(image.id ?? '') && loading.deleteFile; 

  const getWidth = () => {
    if (viewMode === 'list') {
      return '100%';
    }
    return isMobile ? '100%' : '200px';
  } 
  return (
    <Card sx={{ 
      display: 'flex', 
      flexDirection: viewMode === 'list' ? 'row' : 'column',
      height: '100%',
      gap: 2,
      boxShadow: viewMode === 'list' ? 0 : 1,
      borderBottom: viewMode === 'list' ? 1 : 0,
      borderColor: viewMode === 'list' ? 'divider' : 'transparent',
      width: getWidth(),
      position: 'relative' 
    }}>
      <CardMedia
        component="img"
        sx={viewMode === 'list' ? { 
          width: 80, 
          height: 80,
          objectFit: 'cover'
        } : {
          height: 200,
          objectFit: 'cover'
        }}
        image={image.path}
        alt={image.fileName}
      />
      <CardContent sx={{
        display: 'flex', paddingTop: 0,
        justifyContent: 'space-between', 
        alignItems: 'center',
        '&.MuiCardContent-root': {
          paddingBottom: 1,
      }}}>
        <Typography variant="body2" color="text.secondary">
          Uploaded: {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : "Unknown"}
        </Typography>
        <IconButton  aria-label="delete image"
         onClick={onDelete}
         disabled={isDeleting}
         sx={{
          padding: 0.4,
          position: 'absolute',
          bottom: 10,
          right: 5,
        }}>
          <DeleteIcon color={!isDeleting ? "error" : "disabled"}
          sx={{
            fontSize: 18,
          }}/>
        </IconButton>
        { isDeleting && (
          <CircularProgress
            size={24}
            color="error"
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 5,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}