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
  Text,
  TextInput,
  Textarea,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { DateInput, DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { IconArrowNarrowLeft, IconEdit, IconEye, IconTrash } from "@tabler/icons";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "utilities/Toast";

import { getAlteredData } from "./helperFunctions";
import {
  api_addTopic,
  api_deleteTopic,
  api_editTopic,
  api_getCourseSubjectChaptersTopic,
  api_getFilteredTopic,
  api_getSubjectChaptersTopic,
  api_getTopics,
} from "./question.service";
import { api_getDistinctValues } from "../tests/test.service";

const confirm_delete_props = {
  title: "Please confirm delete topic",
  children: (
    <Text size="sm">
      Are you sure you want to delete this topic ? Everything related to this topic will be deleted.
    </Text>
  ),
  labels: { confirm: "Delete Topic", cancel: "Cancel" },
  onCancel: () => console.log("Cancel"),
  confirmProps: { color: "red" },
};

const TopicList = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // STARTS : States
  const [editingValue, setEditingValue] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState(null);
  const [chapterFilter, setchapterFilter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(searchParams.get("add") || searchParams.get("edit"));
  const [testData, setTestData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [chapterData, setChapterData] = useState([]);
  const [allDataDistinct, setAllDataDistinct] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const topicForm = useForm({
    validateInputOnBlur: true,
    shouldUnregister: false,
    initialValues: {
      subject: null,
      chapter: null,
      topic: null,
    },
  });

  // const subjectChaptersTopic = useQuery("getSubjectChaptersTopic", api_getSubjectChaptersTopic, {
  //   refetchOnWindowFocus: false,
  //   onSuccess: data => {
  //     setSubjectData(data.data.subject !== undefined ? getAlteredData(data.data.subject) : []);
  //     setChapterData(data.data.chapter !== undefined ? getAlteredData(data.data.chapter) : []);
  //   },
  // });

  const distinctValues = useQuery("getDistinctValues", api_getDistinctValues, {
    refetchOnWindowFocus: false,
    onSuccess: data => {
      console.log(data.data);
      setAllDataDistinct(data.data);
      setSubjectData(getAlteredData(data.data));
      setSubjects(getAlteredData(data.data));
    },
  });

  useEffect(() => {
    topicForm.values.chapter = "";
    topicForm.values.topic = "";
    if (topicForm.values.subject !== "") {
      let data = allDataDistinct?.find(
        (e, i) => e.id === topicForm.values.subject
      )?.quesiton_bank_chapter;
      setChapters(data);
    }
    if (subjectFilter !== "") {
      setchapterFilter("");
      let data = allDataDistinct?.find((e, i) => e.id === subjectFilter)?.quesiton_bank_chapter;
      setChapterData(data);
    }
  }, [topicForm.values.subject, subjectFilter]);

  const topics = useQuery({
    queryKey: [
      "topics",
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when ordepagination.pageSize changes
    ],
    queryFn: () => api_getTopics(pagination.pageIndex + 1, pagination.pageSize),
    onSuccess: data => {
      console.log(data.data);
      setTestData(data.data);
    },
  });

  const columns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "id", //simple accessorKey pointing to flat data
      },
      {
        header: "Topic Name",
        accessorKey: "name", //simple accessorKey pointing to flat data
      },
      {
        header: "Available Questions",
        accessorKey: "count", //simple accessorKey pointing to flat data
      },
    ],
    []
  );

  useEffect(() => {
    let payload = {};

    if (chapterFilter !== null && chapterFilter !== "") {
      payload = {
        chapter__id: chapterFilter,
      };
    }

    console.log(payload, testData);

    api_getFilteredTopic(payload).then(res => {
      console.log(res);
      if (res.success) {
        setTestData(res.data);
      }
    });
  }, [subjectFilter, chapterFilter]);

  const initAddingTopic = () => {
    setIsAdding(true);
    setIsEditing(false);
  };

  const initEditingTopic = row => {
    console.log(row);
    setEditingValue(row);
    setIsAdding(false);

    topicForm.setFieldValue("topic", row.name);

    setIsEditing(true);
  };

  const openDeleteConfirmation = id => {
    openConfirmModal({
      ...confirm_delete_props,
      onConfirm: async () => await deleteTopic(id),
    });
  };

  const deleteTopic = async id => {
    await api_deleteTopic(id)
      .then(res => {
        if (res.success) {
          showSuccessToast({ title: "Deleted Topic", message: res.message });
          topics.refetch();
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(e => {
        showErrorToast({ title: "Error", message: e.message });
      });
  };

  const editTopic = async values => {
    console.log(values);

    let payload = {
      //subject_id: editingValue.subject,
      //chapter_id: editingValue.chapter,
      name: values.topic,
      sort_order: 2,
      topic_id: editingValue.id,
    };

    await api_editTopic(payload).then(res => {
      console.log("Response", res);

      if (res.success) {
        showSuccessToast({
          title: "Success",
          message: "Topic succesfully edited",
        });
        setIsAdding(false);
        setIsEditing(false);
        topics.refetch();
      } else {
        showErrorToast({
          title: "Error",
          message: res.message,
        });
      }
    });
  };

  const addTopic = async values => {
    console.log(values);

    let payload = {
      //subject_id: values.subject,
      chapter_id: values.chapter,
      name: values.topic,
      sort_order: 1,
    };

    await api_addTopic(payload).then(res => {
      console.log("Response", res);

      if (res.success) {
        showSuccessToast({
          title: "Success",
          message: "Topic succesfully added",
        });
        setIsAdding(false);
        setIsEditing(false);
        topics.refetch();
      } else {
        showErrorToast({
          title: "Error",
          message: res.message,
        });
      }
    });
  };

  return (
    <div>
      <Container fluid>
        <Box p={35}>
          <UnstyledButton
            onClick={() => {
              if (isAdding || isEditing) {
                if (searchParams.get("add")) {
                  navigate("/questions/add");
                } else if (searchParams.get("edit")) {
                  navigate("/questions/edit");
                } else {
                  setIsAdding(false);
                  setIsEditing(false);
                }
              } else {
                navigate("/");
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
              Topics
            </Text>
            <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
              {isAdding ? "Add Topic" : isEditing ? "Edit Topic" : "Topic List"}
            </Text>
          </Flex>
          <Box
            p={25}
            mt={40}
            bg="#fff"
            style={{ boxShadow: "0px 4px 40px 0px #A3ABAE52", borderRadius: "1rem" }}
          >
            {isAdding || isEditing ? (
              <Container fluid p={0}>
                <Flex direction="row" align="flex-end" justify="space-between">
                  <Flex direction="column">
                    <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
                      {isAdding ? "Add Topic" : "Edit Topic"}
                    </Text>
                    <Text fw={400} fz="lg" c={theme.colors.textColor[1]}>
                      Select subject, chapter and {isAdding ? "add topic" : "edit topic"}
                    </Text>
                  </Flex>
                </Flex>
                <form
                  onSubmit={topicForm.onSubmit(values => {
                    console.log(values);
                    isAdding ? addTopic(values) : editTopic(values);
                  })}
                >
                  <Grid grow mt={15}>
                    {isAdding ? (
                      <>
                        <Col md={6} lg={6}>
                          <Select
                            size="lg"
                            data={subjects || []}
                            searchable
                            nothingFound="No subject found"
                            label="Select Subject"
                            placeholder="Select Subject"
                            {...topicForm.getInputProps("subject")}
                          />
                        </Col>
                        <Col md={6} lg={6}>
                          <Select
                            size="lg"
                            data={chapters !== undefined ? getAlteredData(chapters) : []}
                            searchable
                            nothingFound="No chapter found"
                            label="Select Chapter"
                            placeholder="Select Chapter"
                            {...topicForm.getInputProps("chapter")}
                          />
                        </Col>
                      </>
                    ) : (
                      <></>
                    )}
                    <Col md={6} lg={6}>
                      <Textarea
                        minRows={1}
                        size="lg"
                        label="Topic Name"
                        placeholder="Enter Topic Name"
                        {...topicForm.getInputProps("topic")}
                      />
                    </Col>
                    <Col md={isAdding ? 12 : 12}>
                      <Button mt={16} size="lg" w={"100%"} type="submit">
                        {isAdding ? "Add Topic" : "Edit Topic"}
                      </Button>
                    </Col>
                  </Grid>
                </form>
              </Container>
            ) : (
              <Container fluid p={0}>
                <Flex m={10} mt={0} align="center" justify="right" gap={"md"}>
                  {isFilter ? (
                    <>
                      <Select
                        placeholder="Filter Subject"
                        data={subjectData || []}
                        value={subjectFilter}
                        onChange={setSubjectFilter}
                      />
                      <Select
                        placeholder="Filter Chapter"
                        data={chapterData !== undefined ? getAlteredData(chapterData) : []}
                        value={chapterFilter}
                        onChange={setchapterFilter}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <Button
                    variant={isFilter ? "default" : "outline"}
                    size="md"
                    onClick={() => {
                      setIsFilter(!isFilter);
                      if (isFilter) {
                        setSubjectFilter(null);
                        setchapterFilter(null);
                      }
                    }}
                  >
                    {isFilter ? "Clear Filter" : "Filter Topics"}
                  </Button>
                  <Button
                    size="md"
                    onClick={() => {
                      topicForm.reset();
                      initAddingTopic();
                    }}
                  >
                    Add Topic
                  </Button>
                </Flex>
                <Box sx={{ borderRadius: 2 }}>
                  <Box>
                    <MantineReactTable
                      mantineTableHeadProps={{
                        sx: {
                          "& th>div>div>div": {
                            fontSize: theme.fontSizes.lg,
                          },
                        },
                      }}
                      mantineTableProps={{
                        className: "datatable",
                        fontSize: theme.fontSizes.md,
                        striped: true,
                      }}
                      enableRowActions
                      positionActionsColumn="last"
                      renderTopToolbarCustomActions={({ row }) => (
                        <Box px={24} py={10}>
                          <Text
                            fw={600}
                            tt="uppercase"
                            size={"sm"}
                            sx={theme => ({
                              letterSpacing: 1,
                              color: theme.colors.brand[7],
                            })}
                          >
                            Customers List
                          </Text>
                        </Box>
                      )}
                      renderRowActions={({ row }) => (
                        <Flex>
                          <Tooltip label="Edit Topic">
                            <ActionIcon
                              sx={theme => ({ color: theme.colors.brand[7] })}
                              ml={10}
                              onClick={() => {
                                initEditingTopic(row.original);
                              }}
                            >
                              <IconEdit style={{ width: 20 }} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete Topic">
                            <ActionIcon
                              sx={theme => ({ color: theme.colors.red[6] })}
                              ml={10}
                              onClick={() => {
                                openDeleteConfirmation(row.original.id);
                              }}
                            >
                              <IconTrash style={{ width: 20 }} />
                            </ActionIcon>
                          </Tooltip>
                        </Flex>
                      )}
                      enableTopToolbar={false}
                      initialState={{ density: "xs" }}
                      state={{ pagination }} //isLoading: test.isLoading, pagination }}
                      columns={columns}
                      enableDensityToggle={false}
                      enableFullScreenToggle={false}
                      enableColumnActions={false}
                      data={testData || []}
                      enableStickyHeader
                      enableGlobalFilter={false} //turn off a feature
                      rowCount={testData.count} //test?.data?.count}
                      manualPagination
                      onPaginationChange={setPagination}
                    />
                  </Box>
                </Box>
              </Container>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default TopicList;
