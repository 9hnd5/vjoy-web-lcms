import { styled } from "@mui/material/styles";
import { LoginForm } from "./LoginForm";

const Container = styled("div")(() => ({
  width: "100vw",
  height: "100vh",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundImage: "radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)",
}));

const ContainerItem = styled("div")(() => ({ position: "absolute", top: " 150px" }));

export const LoginPage = () => {
  return (
    <Container>
      <ContainerItem>
        <LoginForm />
      </ContainerItem>
    </Container>
  );
};
