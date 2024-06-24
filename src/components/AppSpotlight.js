import { Button, Group } from "@mantine/core";
import { SpotlightProvider, spotlight } from "@mantine/spotlight";
import { IconDashboard, IconFileText, IconHome, IconSearch } from "@tabler/icons-react";
import { Navigate, useNavigate } from "react-router";

import { actions } from "../utilities/SpotlightActions";

function SpotlightControl() {
  return (
    <Group position="center">
      <Button
        variant={"outline"}
        onClick={spotlight.open}
        size="xs"
        leftIcon={<IconSearch size={14} />}
        color="gray"
        sx={{ color: "gray", borderColor: "gray" }}
      >
        Search anything here..
      </Button>
    </Group>
  );
}

export default function AppSpotlight() {
  const navigate = useNavigate();

  const spotlightActions = actions.map(e => {
    return {
      ...e,
      onTrigger: () => {
        navigate(e.link);
      },
    };
  });

  return (
    <SpotlightProvider
      actions={spotlightActions}
      searchIcon={<IconSearch size="1.2rem" />}
      searchPlaceholder="Search..."
      shortcut={["mod + K", "mod + K", "/"]}
      nothingFoundMessage="Nothing found..."
    >
      <SpotlightControl />
    </SpotlightProvider>
  );
}
