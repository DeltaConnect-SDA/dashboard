import { Button, Card, TextInput, Title } from "@tremor/react";
import Logo from "@/assets/Logo.svg";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Form, Navigate, json } from "react-router-dom";
import { authAPI } from "@/api/backend";

type State = {
  email: string;
  password: string;
};

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputs, setInputs] = useState<State>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email: null;
    password: null;
    general: null;
  }>({
    email: null,
    password: null,
    general: null,
  });
  const { authenticate, authState } = useAuth();

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = (e) => {
    e.preventDefault();
    let valid = true;
    if (errors.email || errors.password) {
      valid = false;
    }

    if (inputs.password.length === 0) {
      valid = false;
      handleError("Password harus diisi!", "password");
    }

    if (inputs.password.length < 8) {
      valid = false;
      handleError("Password minimal 8 karakter!", "password");
    }

    if (valid) {
      doLogin();
    }
  };

  const doLogin = () => {
    setLoading(true);

    authAPI
      .post("/login", {
        email: inputs.email,
        password: inputs.password,
      })
      .then(async (res) => {
        setLoading(false);
        const result = res.data;
        const { data, success } = result;

        if (success) {
          console.log(data);
          authenticate(data[0].user.id, data[0].user.role.type);
          <Navigate to="/dashboard" replace />;
        } else {
          handleError(result.message, "general");
        }
      })
      .catch((error) => {
        setLoading(false);

        if (error?.response?.status === 400) {
          if (typeof error.response.data.message == "object") {
            error.response.data.message.map((item) => {
              handleError(item.error[0], item.field);
            });
          } else {
            handleError(error.response?.data?.message, "general");
          }
          console.log(errors);
        } else if (error?.response?.status === 404) {
          handleError(error.response?.data?.message, "general");
        } else {
          console.error("Login error:", error);
          throw json(
            {
              error,
            },
            {
              status: error.response.status,
            }
          );
        }
      });
  };
  if (authState.authenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <main className="h-screen flex justify-center items-center container mx-auto">
      <div className="mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white py-16 px-10 text-center sm:px-12 md:px-[60px]">
        <Card className="w-full flex flex-col justify-center items-center">
          <img src={Logo} alt="logo" className="mb-8" />
          {errors.general && (
            <Title className="text-red-600 text-[12px] font-semibold mb-5">
              {errors.general}
            </Title>
          )}
          <Form onSubmit={(e) => validate(e)}>
            <TextInput
              name="email"
              title="email"
              placeholder="Masukkan email"
              type="email"
              onChange={(text) => handleOnChange(text.target.value, "email")}
              error={errors.email}
              errorMessage={errors.email}
              required
              onFocus={() => handleError(null, "email")}
            />
            <TextInput
              autoComplete="current-password"
              name="password"
              title="Password"
              placeholder="Masukkan password"
              type="password"
              className="mt-5"
              onChange={(text) => handleOnChange(text.target.value, "password")}
              error={errors.password}
              errorMessage={errors.password}
              required
              onFocus={() => handleError(null, "password")}
            />
            <Button
              type="submit"
              className="flex flex-row w-full mt-5 "
              loading={loading}
              disabled={errors.email || errors.password}
            >
              Login
            </Button>
          </Form>
        </Card>
      </div>
    </main>
  );
}

export default Login;
