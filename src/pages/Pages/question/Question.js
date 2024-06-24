import {
  Avatar,
  Box,
  Button,
  Col,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Input,
  Modal,
  Pagination,
  Radio,
  ScrollArea,
  Select,
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
import FileSelection from "components/FileSelection";
import QuillEditor from "components/QuillEditor";
import OptionModal from "pages/Pages/question/OptionModal";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { showErrorToast, showSuccessToast } from "utilities/Toast";

import { getAlteredData } from "./helperFunctions";
import {
  api_addQuestionBank,
  api_deleteQuestionBank,
  api_editQuestionBank,
  api_filterQuestionBank,
  api_getAllData,
  api_getCourseSubjectChaptersTopic,
  api_getCourses,
  api_getQuestionBank,
  api_getSubjectChaptersTopic,
  api_searchQuestionBank,
} from "./question.service";
import { api_getDistinctValues } from "../tests/test.service";

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

const Question = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const matches1024px = useMediaQuery("(max-width: 1024px)");

  // STARTS : States
  const [isExit, setIsExit] = useState(false);
  const [isEditing, setIsEditing] = useState(location.pathname === "/questions/edit");
  const [modalOpenedOption, setModalOpenedOption] = useState(false);
  const [isCreateQuestion, setIsCreateQuestion] = useState(false);
  const [isEditQuestion, setIsEditQuestion] = useState(location.pathname === "/questions/edit");
  const [state, setState] = useState({ value: null });
  const [solutionTextState, setSolutionTextState] = useState({ value: null });
  const [optionData, setOptionData] = useState({ title: "", description: "" });
  const [modalOpenedVideo, setModalOpenedVideo] = useState(false);
  const [preview, setPreview] = useState(false);
  const [quillOpened, setQuillOpened] = useState(true);
  const [icon, setIcon] = useState(null);
  const [solution, setSolution] = useState(null);
  const [solutionText, setSolutionText] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const [allDataDistinct, setAllDataDistinct] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [chapterData, setChapterData] = useState([]);
  const [topicData, setTopicData] = useState([]);

  const [questionData, setQuestionData] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSize, setRowSize] = useState(10);
  const [showPagination, setShowPagination] = useState(false);
  // END : States

  useEffect(() => {
    console.log(rowSize);
    questionBank.refetch();
  }, [rowSize]);

  // start add questions
  // const subjectChaptersTopic = useQuery("getSubjectChaptersTopic", api_getSubjectChaptersTopic, {
  //   refetchOnWindowFocus: false,
  //   onSuccess: data => {
  //     //setSubjectData(data.data.subject !== undefined ? getAlteredData(data.data.subject) : []);
  //     setChapterData(data.data.chapter !== undefined ? getAlteredData(data.data.chapter) : []);
  //     setTopicData(data.data.topic !== undefined ? getAlteredData(data.data.topic) : []);
  //   },
  // });

  const returnForm = useForm({
    validateInputOnBlur: true,
    shouldUnregister: false,
    initialValues: {
      course: "",
      subject: "",
      chapter: "",
      topic: "",
    },
    validate: {
      subject: value => (value ? null : "Subject is required"),
    },
  });

  const distinctValues = useQuery("getDistinctValues", api_getDistinctValues, {
    refetchOnWindowFocus: false,
    onSuccess: data => {
      console.log(data.data);
      setAllDataDistinct(data.data);
      setSubjectData(getAlteredData(data.data));
    },
  });

  useEffect(() => {
    returnForm.values.chapter = "";
    returnForm.values.topic = "";
    if (returnForm.values.subject !== "") {
      let data = allDataDistinct?.find(
        (e, i) => e.id === returnForm.values.subject
      )?.quesiton_bank_chapter;
      setChapterData(data);
    }
  }, [returnForm.values.subject]);

  useEffect(() => {
    returnForm.values.topic = "";
    if (returnForm.values.chapter !== "") {
      let data = chapterData?.find((e, i) => e.id === returnForm.values.chapter)?.chapter_topics;
      setTopicData(data);
    }
  }, [returnForm.values.chapter]);

  // start create questions
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

  useEffect(() => {
    questionForm.setFieldValue("questions", HTML_TOP + state.value + HTML_BOTTOM);
  }, [state]);

  const saveQuestion = async values => {
    console.log(values);

    const formData = new FormData();
    formData.append("answer", values.answer);
    formData.append("difficulty_level", values.difficulty_level);
    formData.append("questions", values.questions);
    formData.append("video_url", values.video_url);
    formData.append("icon", icon !== null && icon.length === 1 ? icon[0] : null);
    //formData.append("solution", solution !== null && solution.length === 1 ? solution[0] : null);
    formData.append("solution_text", solutionText);

    // if (returnForm.values.course !== null) {
    //   formData.append("course_id", returnForm.values.course);
    // }
    // if (returnForm.values.subject !== null) {
    //   formData.append("subject_id", returnForm.values.subject);
    // }
    // if (returnForm.values.chapter !== null) {
    //   formData.append("chapter_id", returnForm.values.chapter);
    // }
    if (returnForm.values.topic !== null && returnForm.values.topic !== "") {
      formData.append("topic_id", returnForm.values.topic);
    }

    await api_addQuestionBank(formData).then(res => {
      console.log(res);
      if (res.success) {
        showSuccessToast({ title: "Success", message: res.messge });
        setState({ value: null });
        setSolutionTextState({ value: null });
        setIcon(null);

        if (isExit) {
          navigate("/");
        } else {
          questionForm.reset();
        }
      } else {
        showErrorToast({ title: "Error", message: res.messge });
      }
    });
  };

  // end create questions

  // start edit questions
  const searchQuestionBank = useMutation("searchQuestionBank", {
    mutationFn: search => api_searchQuestionBank(search, activePage, rowSize),
    onSuccess: data => {
      //setPageSize(Math.floor(data.data.length / (rowSize + 1)) + 1);
      setQuestionData(data.data);
      setShowPagination(false);
    },
  });

  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };

  const filterQuestionBank = useMutation("filterQuestionBank", {
    mutationFn: payload => api_filterQuestionBank(payload),
    onSuccess: data => {
      //setPageSize(Math.floor(data.data.length / (rowSize + 1)) + 1);
      setQuestionData(data.data);
      setShowPagination(false);
    },
  });

  const questionBank = useQuery({
    queryKey: [
      "questionBank",
      activePage, //refetch when pagination.pageIndex changes
      pageSize, //refetch when ordepagination.pageSize changes
    ],
    queryFn: () => api_getQuestionBank(activePage, rowSize),
    onSuccess: data => {
      //setPageSize(Math.floor(data.data.length / (rowSize + 1)) + 1);
      setPageSize(Math.floor(data.count / rowSize) + 1);
      setQuestionData(data.data);
      setShowPagination(true);
    },
  });

  const deleteQuestion = async value => {
    await api_deleteQuestionBank(value.id).then(res => {
      console.log(res);
      if (res.success) {
        showSuccessToast({ title: "Success", message: res.messge });
        if (returnForm.values.course !== null) {
          const payload = {
            //subject__id: returnForm.values.subject,
            //chapter__id: returnForm.values.chapter,
            topic__id: returnForm.values.topic,
          };

          filterQuestionBank.mutate(payload);
        } else {
          questionBank.refetch();
        }
      } else {
        showErrorToast({ title: "Error", message: res.messge });
      }
    });
  };

  const editQuestion = async values => {
    console.log(values);

    const formData = new FormData();
    formData.append("question_bank_id", editingData.id);
    formData.append("answer", values.answer);
    formData.append("difficulty_level", values.difficulty_level);
    formData.append("questions", values.questions);
    formData.append("video_url", values.video_url);
    formData.append("solution_text", solutionText);

    // if (editingData.course !== null) {
    //   formData.append("course_id", editingData.course);
    // }
    // if (editingData.subject !== null) {
    //   formData.append("subject_id", editingData.subject);
    // }
    // if (editingData.chapter !== null) {
    //   formData.append("chapter_id", editingData.chapter);
    // }
    if (editingData.topic !== null) {
      formData.append("topic_id", editingData.topic);
    }

    await api_editQuestionBank(formData).then(res => {
      console.log(res);
      if (res.success) {
        showSuccessToast({ title: "Success", message: res.messge });
        setState({ value: null });
        setSolutionTextState({ value: null });
        setIcon(null);

        if (isExit) {
          setIsEditQuestion(true);
          setIsCreateQuestion(false);
          if (isFiltered) {
            if (returnForm.values !== null) {
              const payload = {
                topic__id: returnForm.values.topic,
              };

              if (payload.topic__id === null || payload.topic__id === "null") {
                delete payload["topic__id"];
              }

              filterQuestionBank.mutate(payload);
            } else {
              questionBank.refetch();
            }
          }
        } else {
          questionForm.reset();
        }
      } else {
        showErrorToast({ title: "Error", message: res.messge });
      }
    });
  };
  // end edit questions

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
      {isCreateQuestion ? (
        <>
          <Container fluid>
            <Box p={35}>
              <UnstyledButton
                onClick={() => {
                  if (isEditing) {
                    if (returnForm.values.course === null) {
                      //searchQuestionBank.mutate(searchQuery);
                    } else {
                      const payload = {
                        // subject__id: returnForm.values.subject,
                        // chapter__id: returnForm.values.chapter,
                        topic__id: returnForm.values.topic,
                      };
                      filterQuestionBank.mutate(payload);
                    }
                    setIsEditQuestion(true);
                    setIsCreateQuestion(false);
                  } else {
                    setIsEditQuestion(false);
                    setIsCreateQuestion(false);
                  }
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
                  {isEditing ? "Edit Questions" : "Create Question"}
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
                        isEditing ? editQuestion(values) : saveQuestion(values);
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
                            if (isEditing) {
                              setIsEditQuestion(true);
                              setIsCreateQuestion(false);
                            } else {
                              setIsEditQuestion(false);
                              setIsCreateQuestion(false);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          fw={400}
                          fz="lg"
                          type="submit"
                          onClick={() => {
                            setIsExit(true);
                          }}
                        >
                          Save & Exit
                        </Button>
                        {isEditing ? (
                          <></>
                        ) : (
                          <Button
                            fw={400}
                            fz="lg"
                            type="submit"
                            onClick={() => {
                              setIsExit(false);
                            }}
                          >
                            Save & Continue
                          </Button>
                        )}
                      </Flex>
                    </form>
                  </Flex>
                </Box>
                {/* <Flex direction="column" w={matches1024px ? "100%" : "30%"}>
                  <Box
                    mt={40}
                    bg="#fff"
                    style={{ boxShadow: "0px 4px 40px 0px #A3ABAE52", borderRadius: "1rem" }}
                  >
                    <FileSelection setFile={setIcon} file={icon} />
                  </Box>
                </Flex> */}
              </Flex>
            </Box>
          </Container>
        </>
      ) : isEditQuestion ? (
        <Container fluid>
          <Box p={35}>
            <Flex justify="space-between">
              <UnstyledButton
                onClick={() => {
                  navigate("/");
                }}
              >
                <Flex direction="row">
                  <IconArrowNarrowLeft stroke={2} style={{ width: "20px" }} />
                  <Text fw={500} fz="md" c={theme.colors.textColor[0]}>
                    Back
                  </Text>
                </Flex>
              </UnstyledButton>
              <Flex>
                <Button
                  mt={20}
                  mr={20}
                  variant="outline"
                  onClick={() => {
                    setIsEditQuestion(false);
                    setIsCreateQuestion(false);
                    returnForm.reset();
                  }}
                >
                  Filter
                </Button>
                <Button
                  mt={20}
                  mr={20}
                  variant="default"
                  onClick={() => {
                    questionBank.refetch();
                    setSearchQuery("");
                    setIsFiltered(false);
                  }}
                >
                  Clear
                </Button>
                <Input
                  mt={20}
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  radius="xl"
                  rightSection={
                    <div>
                      <IconSearch
                        onClick={() => {
                          //console.log(searchQuery);
                          searchQuestionBank.mutate(searchQuery);
                        }}
                        stroke={2}
                        style={{ display: "block", opacity: 0.5, cursor: "pointer" }}
                      />
                    </div>
                  }
                />
              </Flex>
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
              {showPagination ? (
                <Flex align="center">
                  <Text mr={10}>Rows per page</Text>
                  <Select
                    mr={10}
                    w={70}
                    value={rowSize}
                    onChange={setRowSize}
                    data={[
                      { value: 5, label: 5 },
                      { value: 10, label: 10 },
                      { value: 15, label: 15 },
                      { value: 30, label: 30 },
                    ]}
                  ></Select>
                  <Pagination value={activePage} onChange={setPage} total={pageSize} withEdges />
                </Flex>
              ) : (
                <></>
              )}
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
                            questionForm.setFieldValue("answer", value.answer);
                            questionForm.setFieldValue("video_url", value.video_url);
                            questionForm.setFieldValue("difficulty_level", value.difficulty_level);
                            setState({
                              value: value.questions.substring(
                                HTML_TOP.length + 13,
                                value.questions.length - HTML_BOTTOM.length - 7
                              ),
                            });
                            setSolutionTextState({
                              value: value.solution_text.substring(
                                HTML_TOP.length + 13,
                                value.solution_text.length - HTML_BOTTOM.length - 7
                              ),
                            });
                            setIsEditQuestion(false);
                            setIsCreateQuestion(true);
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
      ) : (
        <Container fluid>
          <Box p={35}>
            <UnstyledButton
              onClick={() => {
                setIsCreateQuestion(false);
                setIsEditQuestion(false);
                setIsEditing(false);
                navigate("/");
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
                {isEditing ? "Edit Questions" : "Add Questions"}
              </Text>
              <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                Add new questions for the tests
              </Text>
            </Flex>
            <Box
              p={25}
              mt={40}
              bg="#fff"
              style={{ boxShadow: "0px 4px 40px 0px #A3ABAE52", borderRadius: "1rem" }}
            >
              <Flex direction="row" align="flex-end" justify="space-between">
                <Flex direction="column">
                  <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
                    Select Subject
                  </Text>
                  <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                    Select subject, chapter and topic
                  </Text>
                </Flex>
                <Flex m={10} mt={0} align="center" justify="right" gap={"md"}>
                  <Button
                    size="md"
                    onClick={() => {
                      isEditing
                        ? navigate("/questions/topic?edit=true")
                        : navigate("/questions/topic?add=true");
                    }}
                  >
                    Add Topic
                  </Button>
                </Flex>
              </Flex>
              <Box mt={20}>
                <form
                  onSubmit={returnForm.onSubmit(values => {
                    console.log(values);
                    setState({ value: null });
                    setSolutionTextState({ value: null });
                    questionForm.reset();
                    setIcon(null);
                    if (isEditing) {
                      if (returnForm.values !== null) {
                        const payload = {
                          // subject__id: returnForm.values.subject,
                          // chapter__id: returnForm.values.chapter,
                          topic__id: returnForm.values.topic,
                        };

                        // if (payload.subject__id === null || payload.subject__id === "null") {
                        //   delete payload["subject__id"];
                        // }

                        // if (payload.chapter__id === null || payload.chapter__id === "null") {
                        //   delete payload["chapter__id"];
                        // }

                        if (payload.topic__id === null || payload.topic__id === "null") {
                          delete payload["topic__id"];
                        }

                        filterQuestionBank.mutate(payload);
                      } else {
                        questionBank.refetch();
                      }
                    }
                    isEditing ? setIsEditQuestion(true) : setIsCreateQuestion(true);
                    isEditing && setIsFiltered(true);
                  })}
                >
                  <Grid grow>
                    <Col md={6} lg={4}>
                      <Select
                        size="lg"
                        data={subjectData || []}
                        searchable
                        nothingFound="No subject found"
                        label="Select Subject"
                        placeholder="Select Subject"
                        {...returnForm.getInputProps("subject")}
                      />
                    </Col>
                    <Col md={6} lg={4}>
                      <Select
                        size="lg"
                        data={chapterData !== undefined ? getAlteredData(chapterData) : []}
                        searchable
                        nothingFound="No chapter found"
                        label="Select Chapter"
                        placeholder="Select Chapter"
                        {...returnForm.getInputProps("chapter")}
                      />
                    </Col>
                    <Col md={12} lg={4}>
                      <Select
                        size="lg"
                        data={topicData !== undefined ? getAlteredData(topicData) : []}
                        searchable
                        nothingFound="No topic found"
                        label="Select Topic"
                        placeholder="Select Topic"
                        {...returnForm.getInputProps("topic")}
                      />
                    </Col>
                    <Col md={2} lg={4}>
                      <Button mt={16} size="lg" w={"100%"} type="submit">
                        {isEditing ? "Continue" : "Create Question"}
                      </Button>
                    </Col>
                  </Grid>
                </form>
              </Box>
            </Box>
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
                {isEditing ? "Save Changes ?" : "Add Video Solution"}
              </Text>
              <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                {isEditing ? "Do you want to save these changes" : "Upload URL for video solution"}
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

export default Question;
