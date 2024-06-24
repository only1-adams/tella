import { Box, Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import PropTypes from "prop-types";
import React from "react";

import AppBreadcrumb from "./AppBreadcrumb";

function AppPageHeader({ title, button }) {
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <Box px={isMobileScreen ? 0 : 25} py={isMobileScreen ? 15 : 25}>
        <Flex justify={"space-between"} align="end" wrap={"wrap"}>
          <Box>
            <Text size={"lg"} fw={600} mb={10}>
              {title}
            </Text>
            <AppBreadcrumb />
          </Box>
          <Box mt={isMobileScreen ? 10 : 0}>{button}</Box>
        </Flex>
      </Box>
    </div>
  );
}

AppPageHeader.propTypes = {
  button: PropTypes.element,
  title: PropTypes.string,
};

export default AppPageHeader;
