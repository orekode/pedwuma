
import { Button } from "@mui/material";


export const BigBtn = ({children, styles, ...props}) => {
    return (
        <Button 
            sx={{
                background: "#0064ff", 
                color: "white", 
                "&:hover": { background: "#0459dc" },
                padding: "0.75rem 2.5rem",
                paddingTop: "1rem",
                fontWeight: "500",
                marginBottom: '1rem',
                ...styles
            }}
            {...props}
        >
            {children}
        </Button>
    );
}

export const SmallBtn = ({children, styles, ...props}) => {
    return (
        <Button 
            sx={{
                background: "#0064ff", 
                color: "white", 
                "&:hover": { background: "#0459dc" },
                padding: "0.25rem 1rem",
                paddingTop: "0.5rem",
                fontWeight: "bold",
                ...styles
            }}
            size="small"
            {...props}
        >
            {children}
        </Button>
    );
}

export const MediumBtn = ({children, styles, ...props}) => {
    return (
        <SmallBtn size="medium" styles={{padding: '1rem 2rem', paddingTop: '.75rem', ...styles}} {...props}>
            {children}
        </SmallBtn>
    );
}