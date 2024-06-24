import { Alert, Container } from "@mantine/core";
import { IconLock } from "@tabler/icons";
import React from "react";

function Restricted() {
  return (
    <div>
      <Container p={20} fluid>
        <Alert color="red" title="Access Restricted!" icon={<IconLock />}>
          You do not have permission do the action.
        </Alert>
      </Container>
    </div>
  );
}

export default Restricted;
