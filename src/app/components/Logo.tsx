import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export default function Logo() {
    const logoSize = 40;
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2
            }}>
            <Image
                src={"/flavicon.ico"}
                alt='Logo'
                width={logoSize}
                height={logoSize}
                style={{
                    borderRadius: logoSize / 3
                }}
            />
            <Typography fontWeight={"900"}>Let's cook!</Typography>
        </Box>
    );
}
