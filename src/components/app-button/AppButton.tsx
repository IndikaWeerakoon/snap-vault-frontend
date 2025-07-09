import { Button, CircularProgress } from "@mui/material";

interface AppButtonProps {
  onClick?: () => void;
  variant?: "text" | "contained" | "outlined";
  isLoading?: boolean;
  isDisabled?: boolean;
  type?: "submit" | "button";
  text?: string;
  className?: string;
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  sx?: React.CSSProperties;
}

export const AppButton: React.FC<AppButtonProps> = (props) => {
  return (
    <Button
        type={props.type ?? "button"}
        className={"flex gap-2" + (props.className ? " " + props.className : "")}
        disabled={props.isLoading ?? props.isDisabled}
        variant={props.variant ?? "contained"}
        onClick={props.onClick}
        size={props.size ?? "medium"}
        sx={{padding: '7px 16px 6px 16px', ...props.sx}}>
        {props.icon}
        {props.text ?? "Submit"}
        
        {props.isLoading && (
        <CircularProgress size="16px" 
            sx={{ color: 'white' }}  />
        )}
    </Button>

  );
}