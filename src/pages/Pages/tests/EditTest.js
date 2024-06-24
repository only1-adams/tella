import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Col,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Radio,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { DateInput, DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconArrowNarrowLeft, IconCirclePlus, IconClock, IconEdit, IconTrash } from "@tabler/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "utilities/Toast";

import {
  api_addTest,
  api_getDistinctValues,
  api_getTestsById,
  api_test_conditions,
} from "./test.service";
import { getAlteredData } from "../question/helperFunctions";
import { api_getCourseSubjectChaptersTopic } from "../question/question.service";

const AddTest = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // STARTS : States
  const [isExit, setIsExit] = useState(false);
  const [modalOpenedInstruction, setModalOpenedInstruction] = useState(false);
  const [modalOpenedTest, setModalOpenedTest] = useState(false);

  const [courseData, setCourseData] = useState([]);
  const [subjectData, setSubjectData] = useState([]); //
  const [subjects, setSubjects] = useState([]);
  const [chapterData, setChapterData] = useState([]);
  const [chapterwiseData, setChapterwiseData] = useState([]); //
  const [topicData, setTopicData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [allDataDistinct, setAllDataDistinct] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [instructions, setInstructions] = useState([]);
  const [testQuestionConditions, setTestQuestionConditions] = useState([]);
  const [instructionText, setInstructionText] = useState("");
  const [editInstructionText, setEditInstructionText] = useState("");
  const [editInstructionIndex, setEditInstructionIndex] = useState(-1);
  const [testData, setTestData] = useState({});
  // END : States

  const testForm = useForm({
    validateInputOnBlur: true,
    shouldUnregister: false,
    initialValues: {
      course: "",
      chapter: "",
      chapter_id: "",
      subject_id: "",
      subject: "",
      test: "",
      instruction: "",
      make_timer_compulsary: false,
      live: false,
      start_time: "",
      max_time: "",
      timestamp: new Date(),
      question_limit: "",
      mark: "",
      negative_mark: "",
      difficulty_level: "",
      type: "",
      topic: "",
      active: false,
      reveal_answer: false,
    },
    validate: {
      course: value => (value ? null : "Course is required"),
    },
  });

  const editTestForm = useForm({
    validateInputOnBlur: true,
    shouldUnregister: false,
    initialValues: {
      chapter: "",
      subject: "",
      topic: "",
      question_limit: "",
      index: "",
    },
  });

  const test_types = [
    {
      id: 1,
      value: "major_test",
      label: "Major Test",
    },
    {
      id: 2,
      value: "minor_test",
      label: "Minor Test",
    },
    {
      id: 3,
      value: "chapter_wise_test",
      label: "Chapter Wise Test",
    },
  ];

  // Fetching courses
  const courseSubjectChaptersTopic = useQuery(
    "getCourseSubjectChaptersTopic",
    api_getCourseSubjectChaptersTopic,
    {
      refetchOnWindowFocus: false,
      onSuccess: data => {
        console.log(data.data);
        setAllData(data.data);
        setCourseData(getAlteredData(data.data));
        test_by_id.mutate(searchParams.get("test_id"));
      },
    }
  );

  const distinctValues = useQuery("getDistinctValues", api_getDistinctValues, {
    refetchOnWindowFocus: false,
    onSuccess: data => {
      console.log(data.data);
      setAllDataDistinct(data.data);
      setSubjects(getAlteredData(data.data));
    },
  });

  // Fetching tests
  const test_by_id = useMutation("test_by_id", {
    mutationFn: data => api_getTestsById(data),
    onSuccess: data => {
      console.log(data);
      const res = data.data;
      testForm.setFieldValue("course", res.course);
      if (!res.mock_test && !res.previous_year && res.chapter !== null && res.chapter !== "") {
        testForm.setFieldValue("type", "chapter_wise_test");
      } else if (res.mock_test) {
        testForm.setFieldValue("type", "minor_test");
      } else if (res.previous_year) {
        testForm.setFieldValue("type", "major_test");
      }
      testForm.setFieldValue("chapter_id", res.chapters);
      testForm.setFieldValue("live", res.live);
      testForm.setFieldValue("make_timer_compulsary", res.make_timer_compulsary);
      testForm.setFieldValue("max_time", res.timing);
      testForm.setFieldValue("test", res.test);
      testForm.setFieldValue("reveal_answer", res.reveal_answer);
      testForm.setFieldValue("active", res.active);
      setTestData(res);
    },
  });

  useEffect(() => {
    testForm.values.chapter = "";
    testForm.values.topic = "";
    if (testForm.values.subject !== "") {
      let data = allDataDistinct?.find(
        (e, i) => e.id === testForm.values.subject
      )?.quesiton_bank_chapter;
      setChapterData(data);
    }
  }, [testForm.values.subject]);

  useEffect(() => {
    testForm.values.topic = "";
    if (testForm.values.chapter !== "") {
      let data = chapterData?.find((e, i) => e.id === testForm.values.chapter)?.chapter_topics;
      setTopicData(data);
    }
  }, [testForm.values.chapter]);

  useEffect(() => {
    let testQuestionConditionsArray = {
      question_filters: {
        chapter__id: testForm.values.chapter,
        subject__id: testForm.values.subject,
        topic__id: testForm.values.topic,
        difficulty_level: testForm.values.difficulty_level,
      },
      question_limit: testForm.values.question_limit,
    };

    if (
      isNaN(testQuestionConditionsArray.question_filters.chapter__id) ||
      testQuestionConditionsArray.question_filters.chapter__id === null ||
      testQuestionConditionsArray.question_filters.chapter__id === ""
    ) {
      delete testQuestionConditionsArray.question_filters["chapter__id"];
    }

    if (
      isNaN(testQuestionConditionsArray.question_filters.subject__id) ||
      testQuestionConditionsArray.question_filters.subject__id === null ||
      testQuestionConditionsArray.question_filters.subject__id === ""
    ) {
      delete testQuestionConditionsArray.question_filters["subject__id"];
    }

    if (
      isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
      testQuestionConditionsArray.question_filters.topic__id === null ||
      testQuestionConditionsArray.question_filters.topic__id === ""
    ) {
      delete testQuestionConditionsArray.question_filters["topic__id"];
    }

    if (
      testQuestionConditionsArray.question_filters.difficulty_level === null ||
      testQuestionConditionsArray.question_filters.difficulty_level === ""
    ) {
      delete testQuestionConditionsArray.question_filters["difficulty_level"];
    }

    if (
      isNaN(testQuestionConditionsArray.question_limit) ||
      testQuestionConditionsArray.question_limit === null ||
      testQuestionConditionsArray.question_limit === ""
    ) {
      delete testQuestionConditionsArray["question_limit"];
    }

    if (
      (isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
        testQuestionConditionsArray.question_filters.topic__id === "") &&
      (isNaN(testQuestionConditionsArray.question_filters.subject__id) ||
        testQuestionConditionsArray.question_filters.subject__id === "") &&
      (isNaN(testQuestionConditionsArray.question_filters.chapter__id) ||
        testQuestionConditionsArray.question_filters.chapter__id === "") &&
      testQuestionConditionsArray.question_filters.difficulty_level === "" &&
      (isNaN(testQuestionConditionsArray.question_limit) ||
        testQuestionConditionsArray.question_limit === "")
    ) {
    } else {
      if (
        testQuestionConditionsArray.question_filters.difficulty_level === null ||
        testQuestionConditionsArray.question_filters.difficulty_level === ""
      ) {
      } else {
        handleAvailableQuestions(testQuestionConditionsArray);
      }
    }
  }, [testForm.values.topic, testForm.values.difficulty_level]);

  useEffect(() => {
    if (testForm.values.course !== "") {
      let data = allData?.find((e, i) => e.id === testForm.values.course)?.Course_Subject;
      setSubjectData(data);
    }
    testForm.values.subject_id = "";
    testForm.values.chapter_id = "";
  }, [testForm.values.course]);

  useEffect(() => {
    if (testForm.values.subject_id !== "") {
      let data = subjectData?.find((e, i) => e.id === testForm.values.subject_id)?.chapter;
      setChapterwiseData(data);
    }
    testForm.values.chapter_id = "";
  }, [testForm.values.subject_id]);

  useEffect(() => {
    testForm.setFieldValue("subject_id", NaN);
    testForm.setFieldValue("chapter_id", NaN);
  }, [testForm.values.type]);

  const startRef = useRef();
  const maxRef = useRef();

  const saveTest = async values => {
    let payload = {
      course_id: values.course,
      chapter_id: values.chapter_id,
      //difficulty_level: values.difficulty_level,
      mark: values.mark,
      negative_mark: values.negative_mark,
      test: values.test,
      instruction: instructions.length ? instructions : [],
      make_timer_compulsary: values.make_timer_compulsary,
      live: values.live,
      previous_year: values.type === "major_test",
      mock_test: values.type === "minor_test",
      chapter_wise_test: values.type === "chapter_wise_test",
      sort_order: 0,
      timing: values.max_time, //Math.floor(Math.abs(e_time - s_time) / 1000 / 60),
      timestamp: values.timestamp,
      active: true,
      reveal_answer: false,
      test_question_conditions: testQuestionConditions.length ? testQuestionConditions : [],
    };

    if (isNaN(payload.chapter_id)) {
      delete payload["chapter_id"];
    }

    if (instructions.length === 0) {
      if (instructionText !== "" || instructionText !== null) {
        payload["instruction"] = [instructionText];
      }
    }

    if (testQuestionConditions.length === 0) {
      let testQuestionConditionsArray = {
        question_filters: {
          topic__id: testForm.values.topic,
          difficulty_level: testForm.values.difficulty_level,
        },
        question_limit: testForm.values.question_limit,
      };

      if (
        isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
        testQuestionConditionsArray.question_filters.topic__id === null ||
        testQuestionConditionsArray.question_filters.topic__id === ""
      ) {
        delete testQuestionConditionsArray.question_filters["topic__id"];
      }

      if (
        testQuestionConditionsArray.question_filters.difficulty_level === null ||
        testQuestionConditionsArray.question_filters.difficulty_level === ""
      ) {
        delete testQuestionConditionsArray.question_filters["difficulty_level"];
      }

      if (
        isNaN(testQuestionConditionsArray.question_limit) ||
        testQuestionConditionsArray.question_limit === null ||
        testQuestionConditionsArray.question_limit === ""
      ) {
        delete testQuestionConditionsArray["question_limit"];
      }

      if (
        (isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
          testQuestionConditionsArray.question_filters.topic__id === "") &&
        (isNaN(testQuestionConditionsArray.question_filters.subject__id) ||
          testQuestionConditionsArray.question_filters.subject__id === "") &&
        (isNaN(testQuestionConditionsArray.question_filters.chapter__id) ||
          testQuestionConditionsArray.question_filters.chapter__id === "") &&
        testQuestionConditionsArray.question_filters.difficulty_level === "" &&
        (isNaN(testQuestionConditionsArray.question_limit) ||
          testQuestionConditionsArray.question_limit === "")
      ) {
      } else {
        payload["test_question_conditions"] = [
          ...testQuestionConditions,
          testQuestionConditionsArray,
        ];
      }
      // testForm.setFieldValue("chapter", "");
      // testForm.setFieldValue("subject", "");
      testForm.setFieldValue("topic", "");
      testForm.setFieldValue("difficulty_level", "");
      testForm.setFieldValue("question_limit", "");
    }

    payload.test_question_conditions.map((e, i) => {
      delete e.question_filters["subject__id"];
      delete e.question_filters["chapter__id"];
      delete e.question_filters["count"];
    });

    console.log(payload);

    await api_addTest(payload).then(res => {
      console.log(res);
      if (res.success) {
        showSuccessToast({ title: "Success", message: res.messge });
        setInstructions([]);
        setTestQuestionConditions([]);
        testForm.setFieldValue("type", "");
        isExit ? navigate("/") : testForm.reset();
      } else {
        showErrorToast({ title: "Error", message: res.messge });
      }
    });
  };

  const getTestQuestionConditionsValue = (value, type) => {
    const subject = allDataDistinct?.find((e, i) => e.id === value.subject__id);
    const chapter = subject?.quesiton_bank_chapter?.find((e, i) => e.id === value.chapter__id);
    const topics = chapter?.chapter_topics?.find((e, i) => e.id === value.topic__id);

    switch (type) {
      case "subject":
        return subject?.name;
      case "chapter":
        return chapter?.name;
      case "topic":
        return topics?.name;

      default:
        return "";
    }
  };

  const mutationAvailableQuestions = useMutation({
    mutationFn: data => api_test_conditions(data),
    onSuccess: data => {
      console.log(data);
      setQuestionCount(data.count);
    },
  });

  const handleAvailableQuestions = testQuestionConditionsArray => {
    let testQuestion = {
      topic__id: testQuestionConditionsArray.question_filters.topic__id,
      difficulty_level: testQuestionConditionsArray.question_filters.difficulty_level,
    };
    mutationAvailableQuestions.mutate(testQuestion);
  };

  return (
    <div>
      <Container fluid>
        <Box p={35}>
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
          <Flex justify={"space-between"} mt={20}>
            <Flex direction="column">
              <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
                Edit Test
              </Text>
              <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                Enter details to edit a test
              </Text>
            </Flex>
            <Button
              variant="outline"
              onClick={() => {
                navigate(`/test/view?test_id=${searchParams.get("test_id")}`);
              }}
            >
              View Questions
            </Button>
          </Flex>
          <Flex gap="lg">
            <Box
              p={25}
              mt={20}
              w="100%"
              bg="#fff"
              style={{ boxShadow: "0px 4px 40px 0px #A3ABAE52", borderRadius: "1rem" }}
            >
              <form
                onSubmit={testForm.onSubmit(values => {
                  console.log(values, isExit);
                  //saveTest(values);
                })}
              >
                <Flex direction="column" justify="center">
                  <Text fw={700} fz="xl" c={theme.colors.textColor[0]} mb={10}>
                    Test Details
                  </Text>

                  <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                    Enter test details like course, type , max time for test and more
                  </Text>
                </Flex>
                <Box mt={10}>
                  <Grid>
                    <Col md={6}>
                      <Select
                        size="lg"
                        data={courseData || []}
                        searchable
                        nothingFound="No course found"
                        label="Select Course"
                        placeholder="Select Course"
                        {...testForm.getInputProps("course")}
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        size="lg"
                        data={test_types || []}
                        nothingFound="No test type found"
                        label="Type of Test"
                        placeholder="Select Test Type"
                        {...testForm.getInputProps("type")}
                      />
                    </Col>
                    {testForm.values.type === "chapter_wise_test" ? (
                      <>
                        <Col md={6}>
                          <Select
                            size="lg"
                            data={subjectData !== undefined ? getAlteredData(subjectData) : []}
                            searchable
                            nothingFound="No subject found"
                            label="Select subject"
                            placeholder="Select subject"
                            {...testForm.getInputProps("subject_id")}
                          />
                        </Col>
                        <Col md={6}>
                          <Select
                            size="lg"
                            data={
                              chapterwiseData !== undefined ? getAlteredData(chapterwiseData) : []
                            }
                            searchable
                            nothingFound="No chapter found"
                            label="Select chapter"
                            placeholder="Select chapter"
                            {...testForm.getInputProps("chapter_id")}
                          />
                        </Col>
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Box>
                <Flex direction="column" justify="center" mt={20}>
                  <Text fw={700} fz="xl" c={theme.colors.textColor[0]} mb={10}>
                    Test Timings
                  </Text>

                  <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                    Enter timing and date for test
                  </Text>
                  <Flex gap={24} mt={10}>
                    <Checkbox
                      fw={500}
                      size="md"
                      c={theme.colors.textColor[0]}
                      label="Timer"
                      {...testForm.getInputProps("make_timer_compulsary", { type: "checkbox" })}
                    />
                    <Checkbox
                      fw={500}
                      size="md"
                      c={theme.colors.textColor[0]}
                      label="Live Test"
                      {...testForm.getInputProps("live", { type: "checkbox" })}
                    />
                    <Checkbox
                      fw={500}
                      size="md"
                      c={theme.colors.textColor[0]}
                      label="Reveal Answer"
                      {...testForm.getInputProps("reveal_answer", { type: "checkbox" })}
                    />
                    <Checkbox
                      fw={500}
                      size="md"
                      c={theme.colors.textColor[0]}
                      label="Active"
                      {...testForm.getInputProps("active", { type: "checkbox" })}
                    />
                  </Flex>
                  <Grid mt={10}>
                    <Col md={4}>
                      <DateInput
                        size="lg"
                        label="Date"
                        placeholder="Pick date"
                        {...testForm.getInputProps("timestamp")}
                      />
                    </Col>
                    {/* <Col md={4}>
                      <TimeInput
                        size="lg"
                        label="Starting Time"
                        placeholder="Enter start time"
                        ref={startRef}
                        rightSection={
                          <ActionIcon onClick={() => startRef.current.showPicker()}>
                            <IconClock size="1rem" stroke={1.5} />
                          </ActionIcon>
                        }
                        {...testForm.getInputProps("start_time")}
                      />
                    </Col> */}
                    <Col md={4}>
                      <NumberInput
                        size="lg"
                        label="Duration (Minutes)"
                        placeholder="Enter Time Duration"
                        {...testForm.getInputProps("max_time")}
                      />
                    </Col>
                  </Grid>
                </Flex>
                {/* <Flex direction="column" justify="center" mt={20}>
                  <Text fw={700} fz="xl" c={theme.colors.textColor[0]} mb={10}>
                    Test Marks
                  </Text>

                  <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                    Add marks for this test
                  </Text>
                </Flex>
                <Grid mt={10}>
                  <Col md={6}>
                    <NumberInput
                      hideControls
                      size="lg"
                      label="Correct Marks"
                      placeholder="Enter Correct Marks"
                      {...testForm.getInputProps("mark")}
                    />
                  </Col>
                  <Col md={6}>
                    <NumberInput
                      hideControls
                      size="lg"
                      label="Negative Marks"
                      placeholder="Enter Negative Marks"
                      {...testForm.getInputProps("negative_mark")}
                    />
                  </Col>
                </Grid> */}
                <Flex direction="column" justify="center" mt={20}>
                  <Text fw={700} fz="xl" c={theme.colors.textColor[0]} mb={10}>
                    Test Name
                  </Text>

                  <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                    Enter name and instructions for the test
                  </Text>
                </Flex>
                <Grid mt={10}>
                  <Col md={12}>
                    <TextInput
                      size="lg"
                      label="Test Name"
                      placeholder="Enter Test Name"
                      {...testForm.getInputProps("test")}
                    />
                  </Col>
                  {/* <Col md={10}>
                    <Textarea
                      autosize
                      minRows={5}
                      maxRows={5}
                      size="lg"
                      label="Instructions"
                      placeholder="Enter Instructions"
                      value={instructionText}
                      onChange={event => setInstructionText(event.currentTarget.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Flex direction="column">
                      <Button
                        w="100%"
                        mt={25}
                        onClick={() => {
                          if (instructionText !== "") {
                            setInstructions([...instructions, instructionText]);
                          }
                          setInstructionText("");
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        w="100%"
                        mt={25}
                        onClick={() => {
                          setInstructions([]);
                          setInstructionText("");
                        }}
                      >
                        Clear All
                      </Button>
                    </Flex>
                  </Col>
                  {instructions.map((value, index) => (
                    <Col
                      md={11}
                      key={index}
                      mt={10}
                      mb={10}
                      ml={10}
                      style={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: "8px" }}
                    >
                      <Flex align={"center"} justify={"space-between"}>
                        <Text>{value}</Text>
                        <Flex align={"center"} justify={"right"} gap={"md"}>
                          <IconEdit
                            width={20}
                            onClick={() => {
                              setModalOpenedInstruction(true);
                              setEditInstructionText(instructions[index]);
                              setEditInstructionIndex(index);
                            }}
                          />
                          <IconTrash
                            width={20}
                            color="red"
                            onClick={() => {
                              let instructionsArray = instructions;
                              instructionsArray.splice(index, 1);
                              setInstructions([...instructions]);
                            }}
                          />
                        </Flex>
                      </Flex>
                    </Col>
                  ))} */}
                </Grid>
                {/* <Flex direction="column" justify="center" mt={20}>
                  <Text fw={700} fz="xl" c={theme.colors.textColor[0]} mb={10}>
                    Add Questions
                  </Text>

                  <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                    Select subject, chapter, topic and number of questions
                  </Text>
                </Flex> */}
                <Box mt={10}>
                  <Grid>
                    {/* <Col md={4}>
                      <Select
                        size="lg"
                        data={subjects || []}
                        searchable
                        nothingFound="No subject found"
                        label="Select subject"
                        placeholder="Select subject"
                        {...testForm.getInputProps("subject")}
                      />
                    </Col>
                    <Col md={4}>
                      <Select
                        size="lg"
                        data={chapterData !== undefined ? getAlteredData(chapterData) : []}
                        searchable
                        nothingFound="No chapter found"
                        label="Select chapter"
                        placeholder="Select chapter"
                        {...testForm.getInputProps("chapter")}
                      />
                    </Col>
                    <Col md={4}>
                      <Select
                        size="lg"
                        data={topicData !== undefined ? getAlteredData(topicData) : []}
                        searchable
                        nothingFound="No topic found"
                        label="Select topic"
                        placeholder="Select topic"
                        {...testForm.getInputProps("topic")}
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        size="lg"
                        data={[
                          { value: "easy", label: "Easy" },
                          { value: "medium", label: "Medium" },
                          { value: "hard", label: "Hard" },
                        ]}
                        nothingFound="No level found"
                        label="Select level"
                        placeholder="Select level"
                        {...testForm.getInputProps("difficulty_level")}
                      />
                    </Col>
                    <Col md={6}>
                      <NumberInput
                        size="lg"
                        label="Number of Question"
                        placeholder="Select Question Count"
                        hideControls
                        {...testForm.getInputProps("question_limit")}
                      />
                    </Col>
                    <Col md={3} mt={10}>
                      <UnstyledButton
                        onClick={() => {
                          let testQuestionConditionsArray = {
                            question_filters: {
                              chapter__id: testForm.values.chapter,
                              subject__id: testForm.values.subject,
                              topic__id: testForm.values.topic,
                              difficulty_level: testForm.values.difficulty_level,
                            },
                            question_limit: testForm.values.question_limit,
                          };

                          if (
                            isNaN(testQuestionConditionsArray.question_filters.chapter__id) ||
                            testQuestionConditionsArray.question_filters.chapter__id === null ||
                            testQuestionConditionsArray.question_filters.chapter__id === ""
                          ) {
                            delete testQuestionConditionsArray.question_filters["chapter__id"];
                          }

                          if (
                            isNaN(testQuestionConditionsArray.question_filters.subject__id) ||
                            testQuestionConditionsArray.question_filters.subject__id === null ||
                            testQuestionConditionsArray.question_filters.subject__id === ""
                          ) {
                            delete testQuestionConditionsArray.question_filters["subject__id"];
                          }

                          if (
                            isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
                            testQuestionConditionsArray.question_filters.topic__id === null ||
                            testQuestionConditionsArray.question_filters.topic__id === ""
                          ) {
                            delete testQuestionConditionsArray.question_filters["topic__id"];
                          }

                          if (
                            testQuestionConditionsArray.question_filters.difficulty_level ===
                              null ||
                            testQuestionConditionsArray.question_filters.difficulty_level === ""
                          ) {
                            delete testQuestionConditionsArray.question_filters["difficulty_level"];
                          }

                          if (
                            isNaN(testQuestionConditionsArray.question_limit) ||
                            testQuestionConditionsArray.question_limit === null ||
                            testQuestionConditionsArray.question_limit === ""
                          ) {
                            delete testQuestionConditionsArray["question_limit"];
                          }

                          if (
                            (isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
                              testQuestionConditionsArray.question_filters.topic__id === "") &&
                            (isNaN(testQuestionConditionsArray.question_filters.subject__id) ||
                              testQuestionConditionsArray.question_filters.subject__id === "") &&
                            (isNaN(testQuestionConditionsArray.question_filters.chapter__id) ||
                              testQuestionConditionsArray.question_filters.chapter__id === "") &&
                            testQuestionConditionsArray.question_filters.difficulty_level === "" &&
                            (isNaN(testQuestionConditionsArray.question_limit) ||
                              testQuestionConditionsArray.question_limit === "")
                          ) {
                          } else {
                            testQuestionConditionsArray.question_filters["count"] = questionCount;
                            setTestQuestionConditions([
                              ...testQuestionConditions,
                              testQuestionConditionsArray,
                            ]);
                          }
                          // testForm.setFieldValue("chapter", "");
                          // testForm.setFieldValue("subject", "");
                          testForm.setFieldValue("topic", "");
                          testForm.setFieldValue("difficulty_level", "");
                          testForm.setFieldValue("question_limit", "");
                        }}
                      >
                        <Flex direction="row">
                          <IconCirclePlus
                            color={theme.colors.brand[8]}
                            stroke={2}
                            style={{ width: "20px" }}
                          />
                          <Text ml={10} fw={500} fz="lg" c={theme.colors.textColor[1]}>
                            Add More Test
                          </Text>
                        </Flex>
                      </UnstyledButton>
                    </Col>
                    <Col md={9}></Col> */}
                    {/* {testQuestionConditions.length ? (
                      <>
                        <Col md={12}>
                          <Flex align={"center"} justify={"right"}>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setTestQuestionConditions([]);
                              }}
                            >
                              Clear All
                            </Button>
                          </Flex>
                        </Col>
                        <Col md={12} mt={10}>
                          <Table fontSize={"md"} withBorder>
                            <thead>
                              <tr>
                                <th>Chapter</th>
                                <th>Subject</th>
                                <th>Topic</th>
                                <th>Level</th>
                                <th>Number of Questions</th>
                                <th>Available Questions</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {testQuestionConditions.map((value, index) => (
                                <tr key={index}>
                                  <td>
                                    {getTestQuestionConditionsValue(
                                      value.question_filters,
                                      "chapter"
                                    )}
                                  </td>
                                  <td>
                                    {getTestQuestionConditionsValue(
                                      value.question_filters,
                                      "subject"
                                    )}
                                  </td>
                                  <td>
                                    {getTestQuestionConditionsValue(
                                      value.question_filters,
                                      "topic"
                                    )}
                                  </td>
                                  <td>{value.question_filters?.difficulty_level}</td>
                                  <td>{value.question_limit}</td>
                                  <td>{value.question_filters?.count}</td>
                                  <td>
                                    <Flex align={"center"} gap={"md"}>
                                      <IconEdit
                                        width={20}
                                        onClick={() => {
                                          setModalOpenedTest(true);
                                          //console.log(testQuestionConditions);
                                          editTestForm.setFieldValue(
                                            "chapter",
                                            testQuestionConditions[index]?.question_filters
                                              ?.chapter__id
                                          );
                                          editTestForm.setFieldValue(
                                            "subject",
                                            testQuestionConditions[index]?.question_filters
                                              ?.subject__id
                                          );
                                          editTestForm.setFieldValue(
                                            "topic",
                                            testQuestionConditions[index]?.question_filters
                                              ?.topic__id
                                          );
                                          editTestForm.setFieldValue(
                                            "difficulty_level",
                                            testQuestionConditions[index]?.question_filters
                                              ?.difficulty_level
                                          );
                                          editTestForm.setFieldValue(
                                            "question_limit",
                                            testQuestionConditions[index]?.question_limit
                                          );
                                          editTestForm.setFieldValue("index", index);
                                        }}
                                      />
                                      <IconTrash
                                        width={20}
                                        color="red"
                                        onClick={() => {
                                          let testQuestionConditionsArray = testQuestionConditions;
                                          testQuestionConditionsArray.splice(index, 1);
                                          setTestQuestionConditions([...testQuestionConditions]);
                                        }}
                                      />
                                    </Flex>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </>
                    ) : (
                      <></>
                    )} */}
                    <Col md={3}>
                      <Button
                        mt={10}
                        size="lg"
                        w={"100%"}
                        type="submit"
                        onClick={() => {
                          setIsExit(true);
                        }}
                      >
                        Edit & Exit
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button
                        mt={10}
                        size="lg"
                        w={"100%"}
                        type="submit"
                        onClick={() => {
                          setIsExit(false);
                        }}
                      >
                        Edit & Continue
                      </Button>
                    </Col>
                  </Grid>
                </Box>
              </form>
            </Box>
          </Flex>
        </Box>
      </Container>

      <Modal
        opened={modalOpenedTest}
        onClose={() => {
          setModalOpenedTest(false);
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
                Edit Test
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
            <Grid>
              <Col md={4}>
                <Select
                  size="lg"
                  data={[]}
                  searchable
                  nothingFound="No subject found"
                  label="Select subject"
                  placeholder="Select subject"
                  {...editTestForm.getInputProps("subject")}
                />
              </Col>
              <Col md={4}>
                <Select
                  size="lg"
                  data={chapterData || []}
                  searchable
                  nothingFound="No chapter found"
                  label="Select chapter"
                  placeholder="Select chapter"
                  {...editTestForm.getInputProps("chapter")}
                />
              </Col>
              <Col md={4}>
                <Select
                  size="lg"
                  data={topicData || []}
                  searchable
                  nothingFound="No topic found"
                  label="Select topic"
                  placeholder="Select topic"
                  {...editTestForm.getInputProps("topic")}
                />
              </Col>
              <Col md={6}>
                <Select
                  size="lg"
                  data={[
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ]}
                  nothingFound="No level found"
                  label="Select level"
                  placeholder="Select level"
                  {...editTestForm.getInputProps("difficulty_level")}
                />
              </Col>
              <Col md={4}>
                <NumberInput
                  size="lg"
                  label="Number of Question"
                  placeholder="Select Question Count"
                  hideControls
                  {...editTestForm.getInputProps("question_limit")}
                />
              </Col>
            </Grid>
            <Button
              mt={10}
              size="md"
              onClick={() => {
                let testArray = testQuestionConditions;

                let testQuestionConditionsArray = {
                  question_filters: {
                    chapter__id: editTestForm.values.chapter,
                    subject__id: editTestForm.values.subject,
                    topic__id: editTestForm.values.topic,
                    difficulty_level: editTestForm.values.difficulty_level,
                  },
                  question_limit: editTestForm.values.question_limit,
                };

                if (
                  isNaN(testQuestionConditionsArray.question_filters.chapter__id) ||
                  testQuestionConditionsArray.question_filters.chapter__id === null ||
                  testQuestionConditionsArray.question_filters.chapter__id === ""
                ) {
                  delete testQuestionConditionsArray.question_filters["chapter__id"];
                }

                if (
                  isNaN(testQuestionConditionsArray.question_filters.subject__id) ||
                  testQuestionConditionsArray.question_filters.subject__id === null ||
                  testQuestionConditionsArray.question_filters.subject__id === ""
                ) {
                  delete testQuestionConditionsArray.question_filters["subject__id"];
                }

                if (
                  isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
                  testQuestionConditionsArray.question_filters.topic__id === null ||
                  testQuestionConditionsArray.question_filters.topic__id === ""
                ) {
                  delete testQuestionConditionsArray.question_filters["topic__id"];
                }

                if (
                  testQuestionConditionsArray.question_filters.difficulty_level === null ||
                  testQuestionConditionsArray.question_filters.difficulty_level === ""
                ) {
                  delete testQuestionConditionsArray.question_filters["difficulty_level"];
                }

                if (
                  isNaN(testQuestionConditionsArray.question_limit) ||
                  testQuestionConditionsArray.question_limit === null ||
                  testQuestionConditionsArray.question_limit === ""
                ) {
                  delete testQuestionConditionsArray["question_limit"];
                }

                if (
                  (isNaN(testQuestionConditionsArray.question_filters.topic__id) ||
                    testQuestionConditionsArray.question_filters.topic__id === "") &&
                  (isNaN(testQuestionConditionsArray.question_filters.subject__id) ||
                    testQuestionConditionsArray.question_filters.subject__id === "") &&
                  (isNaN(testQuestionConditionsArray.question_filters.chapter__id) ||
                    testQuestionConditionsArray.question_filters.chapter__id === "") &&
                  testQuestionConditionsArray.question_filters.difficulty_level === "" &&
                  (isNaN(testQuestionConditionsArray.question_limit) ||
                    testQuestionConditionsArray.question_limit === "")
                ) {
                } else {
                  testArray[editTestForm.values?.index] = testQuestionConditionsArray;
                  setTestQuestionConditions(testArray);
                }
                // editTestForm.setFieldValue("chapter", "");
                // editTestForm.setFieldValue("subject", "");
                editTestForm.setFieldValue("topic", "");
                editTestForm.setFieldValue("difficulty_level", "");
                editTestForm.setFieldValue("question_limit", "");

                setModalOpenedTest(false);
              }}
            >
              Save Changes
            </Button>
          </Container>
        </Box>
      </Modal>

      <Modal
        opened={modalOpenedInstruction}
        onClose={() => {
          setModalOpenedInstruction(false);
          setEditInstructionText("");
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
                Edit Instruction
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
            <Textarea
              autosize
              minRows={5}
              maxRows={5}
              size="lg"
              placeholder="Edit Instruction"
              value={editInstructionText}
              onChange={event => setEditInstructionText(event.currentTarget.value)}
            />

            <Button
              mt={10}
              size="md"
              onClick={() => {
                if (editInstructionText !== "" && editInstructionText !== null) {
                  let instructionsArray = instructions;
                  instructionsArray[editInstructionIndex] = editInstructionText;
                  setInstructions(instructionsArray);
                  setModalOpenedInstruction(false);
                }
              }}
            >
              Save Changes
            </Button>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

export default AddTest;
