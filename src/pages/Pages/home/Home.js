import {
  Alert,
  Box,
  Button,
  Col,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  MediaQuery,
  Modal,
  Overlay,
  Radio,
  ScrollArea,
  Select,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconArrowAutofitLeft,
  IconArrowNarrowLeft,
  IconCirclePlus,
  IconCloudUpload,
  IconEdit,
  IconPlus,
  IconPrinter,
  IconTestPipe,
} from "@tabler/icons";
import QuillEditor from "components/QuillEditor";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const matches768px = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Box bg={theme.colors.background} h={matches768px?390:430} pr={55} pl={55} pt={100}>
        <Divider pt="2vh" />
        <Text c="#fff" fw={500} fz="xl">
          Hello, Admin!
        </Text>
        <Text c="#fff" fw={700} fz="48px">
          Welcome to Tella Classes
        </Text>
        <Text c="#fff" fw={400} fz="lg">
          What are you up to today ?
        </Text>
      </Box>

      <Overlay opacity={0} pr={55} pl={55} mt={matches768px?400:280}>
          <Box>
            <Flex direction={matches768px?"column":"row"} align="center" justify="space-between" gap="md" wrap="wrap">
              <Flex
                align="center"
                justify="center"
                w={matches768px?"240px":"18%"}
                h="240px"
                mt={20}
                p={20}
                style={{
                  boxShadow: "0px 4px 40px 0px #A3ABAE52",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                bg="#fff"
                onClick={() => {
                  navigate("/questions/add");
                }}
              >
                <Flex direction="column" align="center" justify="center" pt={10} pb={10}>
                  {/* <IconCirclePlus stroke={1} size={45} color={theme.colors.brand[8]} /> */}
                  <img src={require("../../../assets/add_questions_icon.svg").default} />
                  <Text ta="center" fw={700} fz="xl" c={theme.colors.textColor[0]}>
                    Add Questions
                  </Text>
                  <Text ta="center" fw={400} fz="md" c={theme.colors.textColor[1]}>
                    Add new questions for the tests
                  </Text>
                </Flex>
              </Flex>
              <Flex
                align="center"
                justify="center"
                w={matches768px?"240px":"18%"}
                h="240px"
                mt={20}
                p={20}
                style={{
                  boxShadow: "0px 4px 40px 0px #A3ABAE52",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                bg="#fff"
                onClick={() => {
                  navigate("/questions/edit");
                }}
              >
                <Flex direction="column" align="center" justify="center" pt={10} pb={10}>
                  {/* <IconEdit stroke={1} size={45} color={theme.colors.brand[8]} /> */}
                  <img src={require("../../../assets/edit_questions_icon.svg").default} />
                  <Text ta="center" fw={700} fz="xl" c={theme.colors.textColor[0]}>
                    Edit Questions
                  </Text>
                  <Text ta="center" fw={400} fz="md" c={theme.colors.textColor[1]}>
                    Edit or delete the existing questions
                  </Text>
                </Flex>
              </Flex>
              <Flex
                align="center"
                justify="center"
                w={matches768px?"240px":"18%"}
                h="240px"
                mt={20}
                p={20}
                style={{
                  boxShadow: "0px 4px 40px 0px #A3ABAE52",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                bg="#fff"
                onClick={() => {
                  navigate("/test/add");
                }}
              >
                <Flex direction="column" align="center" justify="center" pt={10} pb={10}>
                  {/* <IconTestPipe stroke={1} size={45} color={theme.colors.brand[8]} /> */}
                  <img src={require("../../../assets/add_test_icon.svg").default} />
                  <Text ta="center" fw={700} fz="xl" c={theme.colors.textColor[0]}>
                    Create Test
                  </Text>
                  <Text ta="center" fw={400} fz="md" c={theme.colors.textColor[1]}>
                    Create a test for students
                  </Text>
                </Flex>
              </Flex>
              <Flex
                align="center"
                justify="center"
                w={matches768px?"240px":"18%"}
                h="240px"
                mt={20}
                p={20}
                style={{
                  boxShadow: "0px 4px 40px 0px #A3ABAE52",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                bg="#fff"
                onClick={() => {
                  navigate("/test/print");
                }}
              >
                <Flex direction="column" align="center" justify="center" pt={10} pb={10}>
                  {/* <IconPrinter stroke={1} size={45} color={theme.colors.brand[8]} /> */}
                  <img src={require("../../../assets/print_test_icon.svg").default} />
                  <Text ta="center" fw={700} fz="xl" c={theme.colors.textColor[0]}>
                    Print Test
                  </Text>
                  <Text ta="center" fw={400} fz="md" c={theme.colors.textColor[1]}>
                    Print the tests
                  </Text>
                </Flex>
              </Flex>
              <Flex
                align="center"
                justify="center"
                w={matches768px?"240px":"18%"}
                h="240px"
                mt={20}
                p={20}
                style={{
                  boxShadow: "0px 4px 40px 0px #A3ABAE52",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                bg="#fff"
                onClick={() => {
                  navigate("/questions/topic");
                }}
              >
                <Flex direction="column" align="center" justify="center" pt={10} pb={10}>
                  {/* <IconPrinter stroke={1} size={45} color={theme.colors.brand[8]} /> */}
                  <img src={require("../../../assets/add_test_icon.svg").default} />
                  <Text ta="center" fw={700} fz="xl" c={theme.colors.textColor[0]}>
                    Topics
                  </Text>
                  <Text ta="center" fw={400} fz="md" c={theme.colors.textColor[1]}>
                    All Topics
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
      </Overlay>
    </>
  );
};

export default Home;
