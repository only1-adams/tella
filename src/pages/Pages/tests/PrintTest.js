import {
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
  Input,
  Modal,
  NumberInput,
  Radio,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { DateInput, DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconArrowAutofitLeft,
  IconArrowNarrowLeft,
  IconCirclePlus,
  IconCloudUpload,
  IconEdit,
  IconPencil,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons";
import FileSelection from "components/FileSelection";
import QuillEditor from "components/QuillEditor";
import { image_url } from "config";
import { MantineReactTable } from "mantine-react-table";
import OptionModal from "pages/Pages/question/OptionModal";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import ViewTest from "./ViewTest";
import { getAlteredTestData } from "./helperFunctions";
import { api_filterTest, api_getTests, api_getTestsSearch } from "./test.service";
import { getAlteredData } from "../question/helperFunctions";
import {
  api_getCourseSubjectChaptersTopic,
  api_getSubjectChaptersTopic,
} from "../question/question.service";

const PrintTest = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // STARTS : States
  const [testData, setTestData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [course, setCourse] = useState(null);
  const [testCount, setTestCount] = useState(1);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryState, setSearchQueryState] = useState(false);
  const [subjectData, setSubjectData] = useState([]);
  const [chapterData, setChapterData] = useState([]);
  const [filter, setFilter] = useState({ state: false, payload: {} });
  const [isView, setIsView] = useState(false);
  const [isViewQuestions, setIsViewQuestions] = useState(false);
  const [viewTestId, setViewTestId] = useState(null);
  const [allData, setAllData] = useState([]);
  // END : States

  const testForm = useForm({
    validateInputOnBlur: true,
    shouldUnregister: false,
    initialValues: {
      course: "",
      subject: "",
      chapter: "",
    },
  });

  const columns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "id", //simple accessorKey pointing to flat data
      },
      {
        header: "Test Name",
        accessorKey: "name", //simple accessorKey pointing to flat data
      },
      {
        header: "Active",
        accessorKey: "active", //simple accessorKey pointing to flat data
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* <Button
              onClick={() => {
                navigate(`/test/edit?test_id=${row.original.value}`);
              }}
            >
              View Test
            </Button> */}
            <Button
              onClick={() => {
                setIsView(true);
                setIsViewQuestions(true);
                setViewTestId(row.original.value);
                //navigate(`/test/view?test_id=${row.original.value}&questions=true`);
              }}
            >
              PDF Questions
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsView(true);
                setIsViewQuestions(false);
                setViewTestId(row.original.value);
                //navigate(`/test/view?test_id=${row.original.value}&solutions=true`);
              }}
            >
              PDF Solutions
            </Button>
          </Box>
        ),
      },
    ],
    []
  );

  // Fetching tests
  const test = useMutation("tests", {
    mutationFn: data => api_getTests(pagination.pageIndex + 1, pagination.pageSize),
    onSuccess: data => {
      console.log(data.data);
      if (course !== null) {
        setTestData(
          getAlteredTestData(
            data.data?.filter(value => value.course === course),
            pagination
          )
        );
      } else {
        setTestData(getAlteredTestData(data.data, pagination));
      }
      setTestCount(data?.count);
    },
  });

  // Fetching tests search
  const testSearch = useMutation("testsSearch", {
    mutationFn: search => api_getTestsSearch(pagination.pageIndex + 1, pagination.pageSize, search),
    onSuccess: data => {
      console.log(data.data);
      if (course !== null) {
        setTestData(
          getAlteredTestData(
            data.data?.filter(value => value.course === course),
            pagination
          )
        );
      } else {
        setTestData(getAlteredTestData(data.data, pagination));
      }
      setTestCount(data?.count);
    },
  });

  // Fetching tests filter
  const testFilter = useMutation("testsFilter", {
    mutationFn: data => api_filterTest(data),
    onSuccess: data => {
      console.log(data.data);
      if (course !== null) {
        setTestData(
          getAlteredTestData(
            data.data?.filter(value => value.course === course),
            pagination
          )
        );
      } else {
        setTestData(getAlteredTestData(data.data, pagination));
      }
      setTestCount(data?.count);
      setFilter({ state: false, payload: {} });
    },
  });

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
      },
    }
  );

  useEffect(() => {
    testForm.values.subject = "";
    testForm.values.chapter = "";
    if (testForm.values.course !== "") {
      let data = allData?.find((e, i) => e.id === testForm.values.course)?.Course_Subject;
      setSubjectData(data);
    }
  }, [testForm.values.course]);

  useEffect(() => {
    testForm.values.chapter = "";
    if (testForm.values.subject !== "") {
      let data = subjectData?.find((e, i) => e.id === testForm.values.subject)?.chapter;
      setChapterData(data);
    }
  }, [testForm.values.subject]);

  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };

  const subjectChaptersTopic = useQuery("getSubjectChaptersTopic", api_getSubjectChaptersTopic, {
    refetchOnWindowFocus: false,
    onSuccess: data => {
      //setSubjectData(data.data.subject !== undefined ? getAlteredData(data.data.subject) : []);
      //setChapterData(data.data.chapter !== undefined ? getAlteredData(data.data.chapter) : []);
    },
  });

  useEffect(() => {
    if (filter.state) {
      testFilter.mutate(filter.payload);
    } else {
      if (!searchQuery) {
        test.mutate("");
      } else {
        testSearch.mutate(searchQuery);
      }
    }
  }, [pagination]);

  useEffect(() => {
    if (
      testForm.values.chapter === "" &&
      testForm.values.course === "" &&
      testForm.values.subject === ""
    ) {
    } else {
      let payload = {};

      if (testForm.values.chapter !== null && testForm.values.chapter !== "") {
        payload["chapters__id"] = testForm.values.chapter;
      }

      if (testForm.values.subject !== null && testForm.values.subject !== "") {
        payload["chapters__subject__id"] = testForm.values.subject;
      }

      if (testForm.values.course !== null && testForm.values.course !== "") {
        payload["course__id"] = testForm.values.course;
      }
      setFilter({ state: true, payload: payload });
      setPagination({
        pageIndex: 0,
        pageSize: pagination.pageSize,
      });
    }
  }, [testForm.values.chapter, testForm.values.course, testForm.values.subject]);

  return (
    <div>
      {isView ? (
        <ViewTest testId={viewTestId} isQuestions={isViewQuestions} setIsView={setIsView} />
      ) : (
        <Container fluid>
          <Box p={35}>
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
            <Flex direction="column" mt={20}>
              <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
                Print Test
              </Text>
              <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
                Print test as pdf
              </Text>
            </Flex>
            <Flex gap="lg">
              <Box
                p={25}
                mt={40}
                w="100%"
                bg="#fff"
                style={{ boxShadow: "0px 4px 40px 0px #A3ABAE52", borderRadius: "1rem" }}
              >
                <Flex justify={"space-between"} align={"end"}>
                  <Flex direction="column" justify="center">
                    <Text fw={700} fz="xl" c={theme.colors.textColor[0]} mb={10}>
                      Tests
                    </Text>

                    <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                      View test list
                    </Text>
                  </Flex>
                  <Flex justify={"right"}>
                    <Button
                      mt={20}
                      mr={20}
                      variant="default"
                      onClick={() => {
                        setSearchQueryState(false);
                        setPagination({
                          pageIndex: 0,
                          pageSize: pagination.pageSize,
                        });
                        setSearchQuery("");
                        testForm.reset();
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
                              if (
                                searchQuery !== undefined &&
                                searchQuery !== null &&
                                searchQuery !== ""
                              ) {
                                setPagination({
                                  pageIndex: 0,
                                  pageSize: pagination.pageSize,
                                });
                                setSearchQueryState(true);
                              }
                            }}
                            stroke={2}
                            style={{ display: "block", opacity: 0.5, cursor: "pointer" }}
                          />
                        </div>
                      }
                    />
                  </Flex>
                </Flex>
                <Flex justify={"space-between"} mt={10} wrap={"wrap"} gap={"md"}>
                  <Select
                    w={"30%"}
                    clearable
                    data={courseData || []}
                    searchable
                    nothingFound="No course found"
                    label="Filter Course"
                    placeholder="Filter Course"
                    {...testForm.getInputProps("course")}
                  />
                  <Select
                    w={"30%"}
                    clearable
                    data={subjectData !== undefined ? getAlteredData(subjectData) : []}
                    searchable
                    nothingFound="No subject found"
                    label="Filter Subject"
                    placeholder="Filter Subject"
                    {...testForm.getInputProps("subject")}
                  />
                  <Select
                    w={"30%"}
                    clearable
                    data={chapterData !== undefined ? getAlteredData(chapterData) : []}
                    searchable
                    nothingFound="No chapter found"
                    label="Filter Chapter"
                    placeholder="Filter Chapter"
                    {...testForm.getInputProps("chapter")}
                  />
                </Flex>
                {/* <form
                onSubmit={testForm.onSubmit(values => {
                  console.log(values);
                  setCourse(values.course);
                  //test.mutate("");
                  test.refetch();
                })}
              >
                <Flex direction="column" justify="center">
                  <Text fw={700} fz="xl" c={theme.colors.textColor[0]} mb={10}>
                    Select Course
                  </Text>

                  <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                    Select Course to print test
                  </Text>
                </Flex>
                <Box mt={10}>
                  <Grid>
                    <Col span={12}>
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
                    <Col span={2}>
                      <Button mt={10} size="lg" fw={400} w={"100%"} type="submit">
                        Submit
                      </Button>
                    </Col>
                  </Grid>
                </Box>
              </form> */}
                <Container fluid mt={30} p={0}>
                  <Box sx={{ borderRadius: 2 }}>
                    <Box>
                      <MantineReactTable
                        mantineTableHeadProps={{
                          sx: {
                            "& tr": {
                              backgroundColor: "#000",
                            },
                            "& th>div>div>div": {
                              color: "#fff",
                              fontSize: theme.fontSizes.lg,
                            },
                          },
                        }}
                        mantineTableProps={{
                          className: "datatable",
                          fontSize: theme.fontSizes.md,
                          striped: true,
                        }}
                        enableTopToolbar={false}
                        initialState={{ density: "xs" }}
                        state={{ isLoading: test.isLoading, pagination }}
                        columns={columns}
                        enableDensityToggle={false}
                        enableFullScreenToggle={false}
                        enableColumnActions={false}
                        data={testData || []}
                        enableStickyHeader
                        enableGlobalFilter={false} //turn off a feature
                        rowCount={testCount}
                        manualPagination
                        onPaginationChange={setPagination}
                      />
                    </Box>
                  </Box>
                </Container>
              </Box>
            </Flex>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default PrintTest;
