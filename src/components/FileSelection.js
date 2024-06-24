import {
  Alert,
  BackgroundImage,
  Box,
  Button,
  Col,
  Container,
  Divider,
  FileButton,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Radio,
  ScrollArea,
  Select,
  SimpleGrid,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconArrowAutofitLeft,
  IconArrowNarrowLeft,
  IconCirclePlus,
  IconCloudUpload,
  IconPlus,
} from "@tabler/icons";
import QuillEditor from "components/QuillEditor";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const FileSelection = props => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const previews = props.file?.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  return (
    <>
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        onDrop={props.setFile}
        style={{ borderStyle: "none", borderRadius: "1rem" }}
        multiple={false}
      >
        <Flex align="center" justify="center" direction="column">
          <IconCloudUpload stroke={2} color={theme.colors.brand[8]} size={48} />
          <Text m={5} fw={500} fz="md" c={theme.colors.textColor[0]} ta="center">
            Select a file or drag and drop here
          </Text>
          <Flex justify="center" align="center" maw={75}>
            {previews}
          </Flex>
          <Text m={5} fw={400} fz="sm" c={theme.colors.textColor[1]} ta="center" w="60%">
            JPG, JPEG OR PNG file size no more than 5MB
          </Text>
          <FileButton
            m={5}
            w="40%"
            variant="outline"
            fw={400}
            fz="md"
            onChange={props.setFile}
            accept="image/png,image/jpeg"
            c={theme.colors.textColor[0]}
          >
            {props => <Button {...props}>Select</Button>}
          </FileButton>
        </Flex>
      </Dropzone>
    </>
  );
};

export default FileSelection;
