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
  Modal,
  Radio,
  ScrollArea,
  Select,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconArrowAutofitLeft,
  IconArrowNarrowLeft,
  IconCirclePlus,
  IconCloudUpload,
  IconPlus,
} from "@tabler/icons";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import FileSelection from "../../../components/FileSelection";
import QuillEditor from "../../../components/QuillEditor";

const HTML_TOP =
  '<!DOCTYPE html> \n \
<html lang="en"> \n \
<head> \n \
  <meta charset="UTF-8" /> \n \
  <meta name="viewport" content="width=device-width, initial-scale=1.0" /> \n \
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css" integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X" crossorigin="anonymous"> \n \
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.js" integrity="sha384-Qsn9KnoKISj6dI8g7p1HBlNpVx0I8p1SvlwOldgi3IorMle61nQy4zEahWYtljaz" crossorigin="anonymous"></script> \n \
	<link href="https://cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet"> \n \
	<link href="https://cdn.quilljs.com/1.3.6/quill.core.css" rel="stylesheet"> \n \
	<script src="https://cdn.quilljs.com/1.3.6/quill.core.js"></script> \n \
  <title>Question</title> \n \
</head> \n \
<body> \n \
<div id="editor">';

const HTML_BOTTOM =
  '</div> \n \
<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script> \n \
<script> var quill = new Quill("#editor", { modules: { \n \
    formula: true, \n \
    toolbar: [["formula"]] \n \
  },placeholder: "No records available...", readOnly: true, theme: "bubble" }); </script> \n \
</body> \n \
</html>';

const OptionModal = props => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(false);

  useEffect(() => {
    props.setSolutionText(HTML_TOP + props.solutionTextState.value + HTML_BOTTOM);
  }, [props.solutionTextState]);

  return (
    <div>
      <Modal
        opened={props.modalOpenedOption}
        onClose={() => {
          props.setModalOpenedOption(false);
          props.setQuillOpened(true);
        }}
        overlayProps={{
          color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        title={
          <Box px={15} w="100%">
            <Flex direction="column">
              <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
                {props.title}
              </Text>
              <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                {props.description}
              </Text>
            </Flex>
          </Box>
        }
        scrollAreaComponent={ScrollArea.Autosize}
        transitionProps={{ transition: "fade", duration: 400, timingFunction: "linear" }}
        size={"800px"}
        centered
      >
        <Box>
          <Container>
            <form
            //   onSubmit={returnForm.onSubmit(values => {
            //     console.log(values);
            //   })}
            >
              <Divider mb={10} />
              <Flex align="center" justify="space-between" mb={5}>
                <Text fw={500} fz="lg" ta="center" c={theme.colors.textColor[0]} mb={10}>
                  Type your Question
                </Text>
                <Button
                  fw={500}
                  fz="md"
                  onClick={() => {
                    setPreview(!preview);
                  }}
                >
                  {preview ? "Hide Preview" : "Show Preview"}
                </Button>
              </Flex>
              <QuillEditor
                height={preview ? "65vh" : "30vh"}
                style={{ width: preview ? "40%" : "100%", marginBottom: "10px" }}
                background="#fff"
                placeholder={"Type the question here..."}
                state={props.solutionTextState}
                setState={props.setSolutionTextState}
                readOnly={preview}
              />
              <Text mb={10} fw={400} fz="md" c={theme.colors.textColor[1]}>
                Write or paste from{" "}
                <span style={{ fontWeight: "bold", color: theme.colors.textColor[0] }}>
                  ( MS Word )
                </span>
              </Text>
              {/* <Box p={15} mt={20} style={{ border: "1px dashed gray", borderRadius: "0.25rem" }}>
                <FileSelection setFile={props.setFile} file={props.file} />
              </Box> */}
              <Flex justify="flex-end" align="center" gap="lg" mt={20} mb={10}>
                <Button
                  variant="outline"
                  fw={400}
                  fz="lg"
                  c={theme.colors.textColor[0]}
                  onClick={() => {
                    props.setFile(null);
                    props.setSolutionText(null);
                    props.setModalOpenedOption(false);
                    props.setQuillOpened(true);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fw={400}
                  fz="lg"
                  onClick={() => {
                    props.setModalOpenedOption(false);
                    props.setQuillOpened(true);
                  }}
                >
                  Submit
                </Button>
              </Flex>
            </form>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

export default OptionModal;
