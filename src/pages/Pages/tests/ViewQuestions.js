import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Modal,
  Radio,
  ScrollArea,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import {
  IconArrowNarrowLeft,
  IconCirclePlus,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons";
import QuillEditor from "components/QuillEditor";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import { api_getTestsById } from "./test.service";
import OptionModal from "../question/OptionModal";

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

const ViewQuestions = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const matches1024px = useMediaQuery("(max-width: 1024px)");
  const [searchParams, setSearchParams] = useSearchParams();

  const [questionData, setQuestionData] = useState([]);
  const [editQuestion, setEditQuestion] = useState(false);
  const [quillOpened, setQuillOpened] = useState(true);
  const [preview, setPreview] = useState(false);
  const [state, setState] = useState({ value: null });
  const [solutionTextState, setSolutionTextState] = useState({ value: null });
  const [optionData, setOptionData] = useState({ title: "", description: "" });
  const [modalOpenedOption, setModalOpenedOption] = useState(false);
  const [modalOpenedVideo, setModalOpenedVideo] = useState(false);
  const [solution, setSolution] = useState(null);
  const [solutionText, setSolutionText] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    test_by_id.mutate(searchParams.get("test_id"));
  }, []);

  // Fetching tests
  const test_by_id = useMutation("test_by_id", {
    mutationFn: data => api_getTestsById(data),
    onSuccess: data => {
      console.log(data);
      const res = data?.data?.question;
      setQuestionData(res);
    },
  });

  const questionForm = useForm({
    validateInputOnBlur: true,
    shouldUnregister: false,
    initialValues: {
      questions: "",
      answer: "",
      difficulty_level: "",
      video_url: "",
    },
    validate: {},
  });

  const choiceToOption = value => {
    switch (value?.answer[0]?.answer) {
      case "choice1":
        return `a`;
      case "choice2":
        return `b`;
      case "choice3":
        return `c`;
      case "choice4":
        return `d`;

      default:
        return "";
    }
  };

  const deleteQuestion = async value => {
    // await api_deleteQuestionBank(value.id).then(res => {
    //   console.log(res);
    //   if (res.success) {
    //     showSuccessToast({ title: "Success", message: res.messge });
    //     if (returnForm.values.course !== null) {
    //       const payload = {
    //         //subject__id: returnForm.values.subject,
    //         //chapter__id: returnForm.values.chapter,
    //         topic__id: returnForm.values.topic,
    //       };
    //       filterQuestionBank.mutate(payload);
    //     } else {
    //       questionBank.refetch();
    //     }
    //   } else {
    //     showErrorToast({ title: "Error", message: res.messge });
    //   }
    // });
  };

  const openDeleteConfirmation = value => {
    openConfirmModal({
      title: "Please confirm delete question",
      children: (
        <Text size="sm">
          Are you sure you want to delete this question data ? This action can't be undone.
        </Text>
      ),
      labels: { confirm: "Delete Question", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: async () => await deleteQuestion(value),
      confirmProps: { color: "red" },
    });
  };

  return (
    <>
      {editQuestion ? (
        <>
          <Container fluid>
            <Box p={35}>
              <UnstyledButton
                onClick={() => {
                  setEditQuestion(false);
                }}
              >
                <Flex direction="row">
                  <IconArrowNarrowLeft stroke={2} style={{ width: "20px" }} />
                  <Text fw={500} fz="md" c={theme.colors.textColor[0]}>
                    Back
                  </Text>
                </Flex>
              </UnstyledButton>
              <Flex direction="column" mt={20}>
                <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
                  Edit Questions
                </Text>
                <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                  Enter details of the question
                </Text>
              </Flex>
              <Flex gap="lg" direction={matches1024px ? "column-reverse" : "row"}>
                <Box
                  p={25}
                  mt={40}
                  w={matches1024px ? "100%" : "100%"}
                  bg="#fff"
                  style={{ boxShadow: "0px 4px 40px 0px #A3ABAE52", borderRadius: "1rem" }}
                >
                  <Flex direction="column" justify="center">
                    <form
                      onSubmit={questionForm.onSubmit(values => {
                        //isEditing ? editQuestion(values) : saveQuestion(values);
                      })}
                    >
                      <Text fw={500} fz="lg" mb={10} c={theme.colors.textColor[0]}>
                        Type your Question
                      </Text>
                      <Flex gap="lg" direction="row" justify="center" wrap="wrap">
                        <Flex direction="column" align="center">
                          {quillOpened ? (
                            <QuillEditor
                              height={preview ? "520px" : "360px"}
                              style={{
                                marginBottom: "10px",
                                width: preview ? (matches1024px ? "260px" : "360px") : "100%",
                              }}
                              background="#fff"
                              placeholder={"Type the question here..."}
                              state={state}
                              setState={setState}
                              readOnly={preview}
                            />
                          ) : (
                            <></>
                          )}
                          <Text mb={10} fw={400} fz="md" c={theme.colors.textColor[1]}>
                            Write or paste from{" "}
                            <span style={{ fontWeight: "bold", color: theme.colors.textColor[0] }}>
                              ( MS Word )
                            </span>
                          </Text>
                        </Flex>
                        <Button
                          fw={400}
                          fz="lg"
                          onClick={() => {
                            setPreview(!preview);
                          }}
                        >
                          {preview ? "Hide Preview" : "Show Preview"}
                        </Button>
                      </Flex>
                      <Flex direction="column">
                        <Flex direction="column">
                          <Text fw={500} fz="lg" mt={10} mb={10} c={theme.colors.textColor[0]}>
                            Select Correct Option
                          </Text>
                          <Radio.Group
                            {...questionForm.getInputProps("answer", {
                              type: "radio",
                            })}
                          >
                            <Group mt={10} mb={10}>
                              <Radio
                                fz="lg"
                                fw={400}
                                value="a"
                                label="A"
                                c={theme.colors.textColor[0]}
                              />
                              <Radio
                                fz="lg"
                                fw={400}
                                value="b"
                                label="B"
                                c={theme.colors.textColor[0]}
                              />
                              <Radio
                                fz="lg"
                                fw={400}
                                value="c"
                                label="C"
                                c={theme.colors.textColor[0]}
                              />
                              <Radio
                                fz="lg"
                                fw={400}
                                value="d"
                                label="D"
                                c={theme.colors.textColor[0]}
                              />
                            </Group>
                          </Radio.Group>
                        </Flex>
                        <Flex direction="column">
                          <Text fw={500} fz="lg" mt={10} mb={10} c={theme.colors.textColor[0]}>
                            Difficulty Level
                          </Text>
                          <Flex gap="xl" mt={10} mb={10} wrap="wrap">
                            <Button
                              variant={
                                questionForm.values.difficulty_level === "easy"
                                  ? "light"
                                  : "outline"
                              }
                              color={
                                questionForm.values.difficulty_level === "easy" ? "light" : "dark"
                              }
                              radius="xl"
                              fz="lg"
                              fw={400}
                              c={theme.colors.textColor[0]}
                              onClick={() => {
                                questionForm.setFieldValue("difficulty_level", "easy");
                              }}
                            >
                              Easy
                            </Button>
                            <Button
                              variant={
                                questionForm.values.difficulty_level === "medium"
                                  ? "light"
                                  : "outline"
                              }
                              color={
                                questionForm.values.difficulty_level === "medium" ? "light" : "dark"
                              }
                              radius="xl"
                              fz="lg"
                              fw={400}
                              c={theme.colors.textColor[0]}
                              onClick={() => {
                                questionForm.setFieldValue("difficulty_level", "medium");
                              }}
                            >
                              Medium
                            </Button>
                            <Button
                              variant={
                                questionForm.values.difficulty_level === "hard"
                                  ? "light"
                                  : "outline"
                              }
                              color={
                                questionForm.values.difficulty_level === "hard" ? "light" : "dark"
                              }
                              radius="xl"
                              fz="lg"
                              fw={400}
                              c={theme.colors.textColor[0]}
                              onClick={() => {
                                questionForm.setFieldValue("difficulty_level", "hard");
                              }}
                            >
                              Hard
                            </Button>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Text fw={500} fz="lg" mt={10} mb={10} c={theme.colors.textColor[0]}>
                        Add Solution
                      </Text>
                      <Flex
                        p={25}
                        justify="center"
                        align="center"
                        style={{ border: "1px dashed gray", borderRadius: "8px" }}
                        mt={10}
                        mb={10}
                      >
                        {solutionTextState.value !== "<p><br></p>" &&
                        solutionTextState.value !== "" &&
                        solutionTextState.value !== null ? (
                          <Flex direction="column" w="100%">
                            <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: solutionTextState.value,
                                }}
                              />
                            </Text>
                            <UnstyledButton
                              onClick={() => {
                                setQuillOpened(false);
                                setOptionData({
                                  title: "Add Solution",
                                  description: "Upload details of solution",
                                });
                                setModalOpenedOption(true);
                              }}
                            >
                              <Flex direction="row">
                                <IconPencil
                                  color={theme.colors.brand[8]}
                                  stroke={2}
                                  style={{ width: "20px" }}
                                />
                                <Text td="underline" c={theme.colors.brand[8]} fw={400} fz="md">
                                  Edit
                                </Text>
                              </Flex>
                            </UnstyledButton>
                          </Flex>
                        ) : (
                          <UnstyledButton
                            onClick={() => {
                              setQuillOpened(false);
                              setOptionData({
                                title: "Add Solution",
                                description: "Upload details of solution",
                              });
                              setModalOpenedOption(true);
                            }}
                          >
                            <Flex direction="column" justify="center" align="center">
                              <IconCirclePlus
                                color={theme.colors.brand[8]}
                                stroke={2}
                                style={{ width: "20px" }}
                              />
                              <Text fw={400} fz="md" c={theme.colors.textColor[0]}>
                                Add
                              </Text>
                            </Flex>
                          </UnstyledButton>
                        )}
                      </Flex>
                      <Text fw={500} fz="lg" mt={10} mb={10} c={theme.colors.textColor[0]}>
                        Add Video Solution
                      </Text>
                      <Flex
                        p={25}
                        justify="center"
                        align="center"
                        style={{ border: "1px dashed gray", borderRadius: "8px" }}
                        mt={10}
                        mb={10}
                      >
                        {questionForm.values.video_url !== "" ? (
                          <Flex direction="column" w="100%">
                            <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                              {questionForm.values.video_url}
                            </Text>
                            <UnstyledButton
                              onClick={() => {
                                setModalOpenedVideo(true);
                              }}
                            >
                              <Flex direction="row">
                                <IconPencil
                                  color={theme.colors.brand[8]}
                                  stroke={2}
                                  style={{ width: "20px" }}
                                />
                                <Text td="underline" c={theme.colors.brand[8]} fw={400} fz="md">
                                  Edit
                                </Text>
                              </Flex>
                            </UnstyledButton>
                          </Flex>
                        ) : (
                          <UnstyledButton
                            onClick={() => {
                              setModalOpenedVideo(true);
                            }}
                          >
                            <Flex direction="column" justify="center" align="center">
                              <IconCirclePlus
                                color={theme.colors.brand[8]}
                                stroke={2}
                                style={{ width: "20px" }}
                              />
                              <Text fw={400} fz="md" c={theme.colors.textColor[0]}>
                                Add
                              </Text>
                            </Flex>
                          </UnstyledButton>
                        )}
                      </Flex>
                      <Flex
                        justify="flex-start"
                        align="center"
                        gap="lg"
                        mt={10}
                        mb={10}
                        wrap="wrap"
                      >
                        <Button
                          variant="outline"
                          fw={400}
                          fz="lg"
                          c={theme.colors.textColor[0]}
                          onClick={() => {
                            setEditQuestion(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          fw={400}
                          fz="lg"
                          type="submit"
                          onClick={() => {
                            //setIsExit(true);
                          }}
                        >
                          Save & Exit
                        </Button>
                        <Button
                          fw={400}
                          fz="lg"
                          type="submit"
                          onClick={() => {
                            //setIsExit(false);
                          }}
                        >
                          Save & Continue
                        </Button>
                      </Flex>
                    </form>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Container>
        </>
      ) : (
        <Container fluid>
          <Box p={35}>
            <Flex justify="space-between">
              <UnstyledButton
                onClick={() => {
                  navigate(-1);
                }}
              >
                <Flex direction="row">
                  <IconArrowNarrowLeft stroke={2} style={{ width: "20px" }} />
                  <Text fw={500} fz="md" c={theme.colors.textColor[0]}>
                    Back
                  </Text>
                </Flex>
              </UnstyledButton>
            </Flex>
            <Flex justify="space-between" align="center">
              <Flex direction="column" mt={20}>
                <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
                  Edit Questions
                </Text>
                <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                  Edit details of the question
                </Text>
              </Flex>
              <Button variant="outline">Add Question</Button>
            </Flex>
            {questionData?.map((value, index) => {
              return (
                <Box
                  key={index}
                  p={25}
                  mt={20}
                  bg="#fff"
                  style={{ boxShadow: "0px 4px 40px 0px #A3ABAE52", borderRadius: "1rem" }}
                >
                  <Flex direction="row">
                    <Flex align="flex-start" justify="center" mr={20} mt={10}>
                      <Avatar
                        variant="outline"
                        fz="lg"
                        fw={400}
                        c={theme.colors.textColor[0]}
                        radius="xl"
                        color="gray"
                      >
                        {index + 1}
                      </Avatar>
                    </Flex>
                    <div>
                      <Text fz="lg" fw={400} c={theme.colors.textColor[0]}>
                        <div dangerouslySetInnerHTML={{ __html: value.questions }} />
                      </Text>
                      <Flex gap="md">
                        <UnstyledButton
                          onClick={() => {
                            setEditingData(value);
                            questionForm.setFieldValue("answer", choiceToOption(value));
                            if (value?.answer[0]?.video_url !== null) {
                              questionForm.setFieldValue("video_url", value?.answer[0]?.video_url);
                            }
                            questionForm.setFieldValue("difficulty_level", value.difficulty_level);
                            value?.questions !== null &&
                              value?.questions !== undefined &&
                              setState({
                                value: value?.questions?.substring(
                                  HTML_TOP?.length + 13,
                                  value.questions.length - HTML_BOTTOM?.length - 7
                                ),
                              });
                            value?.answer[0]?.solution_text !== null &&
                              value?.answer[0]?.solution_text !== undefined &&
                              setSolutionTextState({
                                value: value?.answer[0]?.solution_text?.substring(
                                  HTML_TOP?.length + 13,
                                  value?.answer[0]?.solution_text?.length - HTML_BOTTOM?.length - 7
                                ),
                              });
                            setEditQuestion(true);
                          }}
                        >
                          <Flex direction="row">
                            <IconPencil
                              color={theme.colors.brand[8]}
                              stroke={2}
                              style={{ width: "20px" }}
                            />
                            <Text fw={500} fz="md" c={theme.colors.brand[8]}>
                              Edit
                            </Text>
                          </Flex>
                        </UnstyledButton>
                        <UnstyledButton
                          onClick={() => {
                            openDeleteConfirmation(value);
                          }}
                        >
                          <Flex direction="row">
                            <IconTrash color="red" stroke={2} style={{ width: "20px" }} />
                            <Text fw={500} fz="md" c="red">
                              Delete
                            </Text>
                          </Flex>
                        </UnstyledButton>
                      </Flex>
                    </div>
                  </Flex>
                </Box>
              );
            })}
          </Box>
        </Container>
      )}

      <OptionModal
        modalOpenedOption={modalOpenedOption}
        setModalOpenedOption={setModalOpenedOption}
        setQuillOpened={setQuillOpened}
        title={optionData.title}
        description={optionData.description}
        setFile={setSolution}
        file={solution}
        setSolutionText={setSolutionText}
        solutionTextState={solutionTextState}
        setSolutionTextState={setSolutionTextState}
      />

      <Modal
        opened={modalOpenedVideo}
        onClose={() => {
          setModalOpenedVideo(false);
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
                {editQuestion ? "Save Changes ?" : "Add Video Solution"}
              </Text>
              <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                {editQuestion
                  ? "Do you want to save these changes"
                  : "Upload URL for video solution"}
              </Text>
            </Flex>
          </Box>
        }
        scrollAreaComponent={ScrollArea.Autosize}
        transitionProps={{ transition: "fade", duration: 100, timingFunction: "linear" }}
        size={"700px"}
        centered
      >
        <Box>
          <Container>
            <form
              onSubmit={questionForm.onSubmit(values => {
                //console.log(values);
                setModalOpenedVideo(false);
              })}
            >
              <Divider mb={20} />
              <TextInput
                mb={20}
                placeholder="Enter URL"
                fw={400}
                size="md"
                c={theme.colors.textColor[1]}
                {...questionForm.getInputProps("video_url")}
              ></TextInput>
              <Flex justify="flex-end" align="center" gap="lg" mt={10} mb={10}>
                <Button
                  variant="outline"
                  fw={400}
                  fz="lg"
                  c={theme.colors.textColor[0]}
                  onClick={() => {
                    setModalOpenedVideo(false);
                  }}
                >
                  Cancel
                </Button>
                <Button fw={400} fz="lg" type="submit">
                  Submit
                </Button>
              </Flex>
            </form>
          </Container>
        </Box>
      </Modal>
    </>
  );
};

export default ViewQuestions;
