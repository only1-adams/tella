import {
  Alert,
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  MediaQuery,
  NumberInput,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconPassword, IconPhone } from "@tabler/icons";
import { image_url } from "config";
import { useState } from "react";
import { useNavigate } from "react-router";
import { showErrorToast, showSuccessToast } from "utilities/Toast";

import { api_checkuser, api_login } from "../../services/auth.service";

export function Login() {
  const navigate = useNavigate();

  // Starts : States
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [otpState, setOtpState] = useState(true);
  // ENDS : States

  const form = useForm({
    initialValues: {
      username: "",
      otp: "",
    },

    validate: {
      username: value => {
        if (!value) {
          return "Phone number is required";
        } else if (value.toString().length !== 10) {
          return "Phone number invalid";
        }
      },
      otp: value => (!otpState || value ? null : "OTP is required"),
    },
  });

  const doLogin = async values => {
    setLoading(true);
    console.log(values);

    let payload = {
      username: values.username,
      otp: values.otp ? values.otp : "",
      device_token: "12345",
    };

    await api_checkuser(payload)
      .then(res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setOtpState(true);
          //}
        } else {
          setLoginError(true);
          setLoginErrorMessage(res.message);
          showErrorToast({ title: "Error", message: res.detail });
        }
      })
      .catch(err => {
        setLoginError(true);
        setLoginErrorMessage(err.message);
      });

    await api_login(payload)
      .then(res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          localStorage.setItem("user", res.user.first_name);
          localStorage.setItem("dms_access_token", res.access_token);
          let permissions =
            "permissions, add_questions, edit_questions, add_test, edit_test, view_questions, print_test,view_topic";
          localStorage.setItem("permissions", JSON.stringify(permissions));
          setOtpState(false);
          showSuccessToast({ title: "Success", message: "Loggedin successfully" });
          navigate("/");
          window.location.reload();
        } else {
          setLoginError(true);
          setLoginErrorMessage(res.message);
          showErrorToast({ title: "Error", message: res.detail });
        }
      })
      .catch(err => {
        setLoginError(true);
        setLoginErrorMessage(err.message);
      });

    setLoading(false);
  };

  return (
    <>
      <Flex>
        <MediaQuery query="(max-width: 768px)" styles={{ display: "none" }}>
          <Flex
            w="100%"
            bg="linear-gradient(175.95deg, rgb(86, 187, 235) 25.27%, rgb(45, 153, 204) 88.32%)"
            style={{
              minHeight: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              fit="contain"
              src={
                image_url +
                "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftella-web-login.62db21bf.png&w=1920&q=75"
              }
            />
          </Flex>
        </MediaQuery>
        <Flex
          w="100%"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Flex direction="column" h="100%" w="100%" p={40} style={{ justifyContent: "center" }}>
            <Flex
              w="100%"
              direction="column"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div width="100%">
                <Image
                  width={150}
                  height={85}
                  fit="contain"
                  src={
                    image_url +
                    "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftella-logo.d913eb8b.png&w=256&q=75"
                  }
                />
              </div>
              <Flex
                width="100%"
                direction="column"
                mt="50px"
                mb="50px"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Text fz="xl2" fw={700} ta="center">
                  Login
                </Text>
                <Text> Fill your credentials to login. </Text>
              </Flex>
            </Flex>

            <form
              onSubmit={form.onSubmit(values => {
                console.log(values);
                doLogin(values);
              })}
            >
              <Flex w="100%" style={{ alignItems: "center", justifyContent: "center" }}>
                <Flex
                  w="100%"
                  mt={10}
                  mb={10}
                  direction="column"
                  style={{ justifyContent: "center" }}
                >
                  <NumberInput
                    icon={<IconPhone width="16px" />}
                    hideControls
                    label="Phone number"
                    placeholder="Enter Phone Number"
                    {...form.getInputProps("username")}
                  />
                  {otpState ? (
                    <NumberInput
                      icon={<IconPassword width="16px" />}
                      mt={10}
                      hideControls
                      label="Password"
                      placeholder="Enter Password"
                      {...form.getInputProps("otp")}
                    />
                  ) : (
                    <></>
                  )}
                </Flex>
              </Flex>
              <Flex
                w="100%"
                direction="column"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Flex
                  w="100%"
                  mt={20}
                  mb={20}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Button
                    h={42}
                    style={{
                      boxShadow: "rgba(78, 170, 255, 0.3) 0px 12px 20px",
                      backgroundImage:
                        "linear-gradient(rgb(86, 187, 235) 0%, rgb(45, 153, 204) 100%)",
                    }}
                    loading={loading}
                    type="submit"
                    fullWidth
                  >
                    Login
                  </Button>
                </Flex>
                {/* <Flex
                  w="100%"
                  mt={20}
                  mb={20}
                  fz="sm"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgb(134, 142, 150)",
                  }}
                >
                  Don't Have an account ?
                  <Anchor c="rgb(0, 0, 238)" td="underline" href="/register" target="_blank">
                    Register
                  </Anchor>
                </Flex> */}
              </Flex>
            </form>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
