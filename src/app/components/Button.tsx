import B from "@mui/material/Button";

type Props = {
    children: React.ReactNode;
} & React.ComponentProps<typeof B>;
export default function Button(props: Props) {
    return (
        <B
            variant='contained'
            {...props}
            sx={{
                bgcolor: "#E87C4B",
                color: "#fff",
                borderRadius: "12px",
                px: 3,
                py: 1,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": { bgcolor: "#d86b3a" },
                ...props.sx
            }}></B>
    );
}
