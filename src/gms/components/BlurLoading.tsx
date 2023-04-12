import { Box, CircularProgress } from "@mui/material";

type Props = {
  isLoading?: boolean;
  children?: React.ReactNode;
};
const BlurLoading = (props: Props) => {
  const { isLoading, children } = props;
  return (
    <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box
        sx={{
          opacity: isLoading ? 0.5 : 1,
          flex: "1 1 auto",
        }}
      >
        {children}
      </Box>
      {isLoading && (
        <Box sx={{ position: "absolute", zIndex: 1000 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export { BlurLoading };
