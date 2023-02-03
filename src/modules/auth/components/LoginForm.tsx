import { LockOutlined } from "@mui/icons-material";
import { Avatar, Button, Card, CardContent, Stack } from "@mui/material";
import React from "react";
import { email, Form, PasswordInput, required, TextInput, useLogin, useNotify } from "react-admin";

export const LoginForm = () => {
  const login = useLogin();
  const notify = useNotify();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      setIsLoading(true);
      await login(formData);
    } catch (error) {
      if (typeof error === "string") {
        notify(error, { type: "error" });
      } else {
        notify(JSON.stringify(error), { type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Form onSubmit={handleSubmit}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
            <Avatar>
              <LockOutlined />
            </Avatar>
            <Stack direction="column" justifyContent="center" alignItems="center">
              <TextInput source="email" fullWidth validate={[required(), email()]} />
              <PasswordInput source="password" fullWidth validate={required()} />
              <Button color="primary" variant="contained" fullWidth type="submit" disabled={isLoading}>
                SIGN IN
              </Button>
            </Stack>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};
