import { List, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavigationItem } from './NavigationItem';

export const Sidebar: React.FC = () => {
  
  return (
    <div className="mt-4">
      <List>
        {/* Dashboard Link */}
        <ListItem disablePadding>
          <NavigationItem to="/">
            <ListItemIcon>
              <DashboardIcon className="text-gray-600" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </NavigationItem>
        </ListItem>

        {/* Gallery Link */}
        <ListItem disablePadding>
          <NavigationItem to="/gallery">
            <ListItemIcon>
              <PhotoLibraryIcon className="text-gray-600" /> {/* More appropriate icon for Gallery */}
            </ListItemIcon>
            <ListItemText primary="Gallery" />
          </NavigationItem>
        </ListItem>

        {/* Settings Link */}
        <ListItem disablePadding>
          <NavigationItem to="/settings">
            <ListItemIcon>
              <SettingsIcon className="text-gray-600" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </NavigationItem>
        </ListItem>
      </List>
    </div>
  );
}
