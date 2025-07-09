import { ListItemButton, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface NavigationItemProps {
  to: string;
  children: ReactNode;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const theme = useTheme();
  
  return (
    <ListItemButton 
      component={Link}
      to={to}
      selected={isActive}
      className={`h-11 mx-2 ${isActive ? 'rounded-lg bg-gray-100' : 'rounded-none hover:bg-gray-100'}`}
      sx={{
        margin: theme.spacing(0.5, 1.5),
        borderRadius: 0,
        transition: theme.transitions.create(['background-color', 'border-radius'], {
            duration: theme.transitions.duration.shortest,
        }),
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          borderRadius: 8,
          '& .MuiListItemIcon-root': { color: 'primary.main' },
          '& .MuiListItemText-primary': { fontWeight: 'medium' },
          '&:hover': {
                backgroundColor: 'action.selected', 
                borderRadius: 8,
            }
        },
        '&:hover': {
          backgroundColor: 'action.hover',
          borderRadius: 8,
        }
      }}
    >
      {children}
    </ListItemButton>
  );
};