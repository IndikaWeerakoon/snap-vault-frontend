import ButtonBase from "@mui/material/ButtonBase";
import { logoutAsync } from "../../redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../auth-context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import type { RootState } from "../../redux/store";
import { ColorUtil } from "../../utils/color-util";


export const AvatarMenu: React.FC = () => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { loading } = useSelector((state: RootState) => state.auth);
    const auth = useAuth();
    const open = Boolean(anchorEl);
    const isLoading = loading?.logout || loading?.getMe;

    const handleLogout = () => {
        dispatch(logoutAsync());
        handleClose();
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function stringAvatar(name: string) {
        if (!name) {
          return {};
        }

        return {
          sx: {
            bgcolor: ColorUtil.stringToColor(name),
          },
          children: `${name?.split(' ')?.[0][0]}${name?.split(' ')?.[1][0]}`,
        };
    }
    return (
        <div>
            <ButtonBase onClick={handleClick}
            sx={{
                  borderRadius: '40px',
                  '&:has(:focus-visible)': {
                    outline: '2px solid',
                    outlineOffset: '2px',
                  },
                }}>

              { isLoading && <CircularProgress
              size={48}
              thickness={4}
              className="absolute"
              sx={{
                color: 'gray',
                top: '50%',
                left: '50%',
                marginTop: '-24px', // Half of size
                marginLeft: '-24px', // Half of size
              }}
            /> }

            <Avatar
              {...stringAvatar(auth?.user?.name ?? '')}
            />
          </ButtonBase>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
              },
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
    );
}