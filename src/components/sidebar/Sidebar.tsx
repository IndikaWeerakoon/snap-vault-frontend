import { List, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';

export const Sidebar: React.FC = () => {
  return (
    <div className="mt-4">
        <List>
        <ListItemButton>
            <ListItemIcon><DashboardIcon className="text-gray-600" /></ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon><SettingsIcon className="text-gray-600" /></ListItemIcon>
            <ListItemText primary="Settings" />
        </ListItemButton>
        </List>
    </div>
  );
}
