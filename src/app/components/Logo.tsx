import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
    const logoSize = 40;
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <Typography fontWeight={"900"}>Let&apos;s cook!</Typography>
        </Box>
    );
}
