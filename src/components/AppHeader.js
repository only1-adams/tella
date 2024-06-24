import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Menu,
  NavLink,
  Text,
  createStyles,
} from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconArrowsTransferDown,
  IconBox,
  IconBoxModel,
  IconBuilding,
  IconChecks,
  IconCurrencyDollar,
  IconCurrencyRupee,
  IconDatabase,
  IconList,
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconReport,
  IconRoute,
  IconSearch,
  IconSettings,
  IconStars,
  IconTag,
  IconTrash,
  IconTruck,
  IconTruckDelivery,
  IconTruckReturn,
  IconUser,
  IconUsers,
} from "@tabler/icons";
import { image_url } from "config";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AppSpotlight from "./AppSpotlight";

const useStyles = createStyles(theme => ({
  link: {
    display: "block",
    lineHeight: 1,

    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.brand[9],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

function AppHeader() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [path, setPath] = useState(location.pathname);

  if (location.pathname !== path) {
    setPath(location.pathname);
  }

  // RENDER STARTS HERE
  return (
    <>
      {/* Top Header */}
      <div>
        <Box
          px={40}
          h={path === "/" ? "0" : "auto"}
          sx={theme => ({
            background: theme.colors.background,
            zIndex: '1',
          })}
        >
          <Container fluid>
            <Flex
              justify={"space-between"}
              align="center"
              pt={20}
              pb={20}
              style={{ borderBottom: path === "/" ? "1px solid #fff" : "none" }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "0.25rem",
                  padding: "0.25rem",
                }}
              >
                <Image
                  width={100}
                  height={55}
                  fit="contain"
                  src={
                    image_url +
                    "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftella-logo.d913eb8b.png&w=256&q=75"
                  }
                />
              </div>

              <Menu position="bottom-end" shadow="md" width={200} trigger="hover">
                <Menu.Target>
                  <Flex justify="center" align="center">
                    <Avatar radius="xl" size={"45px"} />
                    <Flex direction="column" justify="center" c="#ffffff" p={5}>
                      <Text>{localStorage.getItem("user")}</Text>
                      <Text>Admin</Text>
                    </Flex>
                  </Flex>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label> Settings </Menu.Label>
                  <Menu.Item icon={<IconUser size={14} />} component={Link} to="/manage-account">
                    Manage Account
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Container>
        </Box>
      </div>
    </>
  );
}

export default AppHeader;
