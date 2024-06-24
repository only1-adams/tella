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
  Image,
  List,
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
} from "@tabler/icons";
import { image_url, image_url2 } from "config";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import PrintLayout from "./PrintLayout";
import { api_getTestsById } from "./test.service";

const ViewTest = props => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [testId, setTestId] = useState(props.testId);
  const [isQuestions, setIsQuestions] = useState(props.isQuestions);
  const [questions, setQuestions] = useState(null);
  const [sortedQuestions, setSortedQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  let prevSubject = "";

  // Fetching test questions and solution
  const testsById = useMutation("getTestsById", {
    mutationFn: testId => api_getTestsById(testId),
    onSuccess: data => {
      setQuestions(data.data);
      const sorted_questions = data.data?.question?.sort((a, b) =>
        a.subject_name > b.subject_name ? 1 : -1
      );
      setSortedQuestions(sorted_questions);
      const subject_list = [...new Set(sorted_questions.map(item => item.subject_name))];
      setSubjects(subject_list);
      prevSubject = subject_list.length
        ? subject_list[0] === null
          ? "null"
          : subject_list[0]
        : "";
    },
  });

  useEffect(() => {
    testsById.mutate(testId);
  }, [testId]);

  if (testId !== props.testId) {
    setTestId(props.testId);
  }

  const QuestionBox = props => {
    return (
      <Box
        mb={10}
        p={10}
        //h={"240px"}
        pt={props.question?.includes("<!DOCTYPE html>") ? 0 : 10}
        w="100%"
        fw={500}
        fz="md"
        style={{
          // border: "1px solid rgba(0,0,0,0.5)",
          color: theme.colors.textColor[0],
          //overflow: "hidden",
        }}
      >
        <Flex direction="column" align="flex-start" wrap="wrap">
          {props.question?.includes("<!DOCTYPE html>") ? (
            <Flex direction="row" align="flex-start">
              <div style={{ marginTop: "14px", paddingRight: "5px" }}>{props.index}.</div>
              <div dangerouslySetInnerHTML={{ __html: props.question }} />
            </Flex>
          ) : (
            <Text mb={3} ta="justify">
              {props.index}. {props.question === "null" ? "" : props.question}
            </Text>
          )}
          <Image
            width={props.icon !== null ? "50%" : "0px"}
            // height={props.icon !== null ? "60px" : "0px"}
            fit="contain"
            src={props.icon !== null ? image_url2 + props.icon : ""}
            alt=""
          />
        </Flex>

        {props.choices?.length === 0 ? (
          <></>
        ) : (
          <List
            type="ordered"
            listStyleType="upper-alpha"
            w={"100%"}
            fw={500}
            fz="md"
            ta="justify"
            pl={10}
            pr={10}
            style={{ color: theme.colors.textColor[1] }}
          >
            {props.choices?.choice1 !== "null" ? (
              <Flex w={"100%"}>
                <List.Item>
                  {props.choices?.choice1 === "null" ? "" : props.choices?.choice1}
                </List.Item>
                <Image
                  width={props.choices?.choice1_icon !== null ? "50%" : "0px"}
                  // height={props.choices?.choice1_icon !== null ? "25px" : "0px"}
                  fit="contain"
                  src={
                    props.choices?.choice1_icon !== null
                      ? image_url2 + props.choices?.choice1_icon
                      : ""
                  }
                  alt=""
                />
              </Flex>
            ) : (
              <></>
            )}
            {props.choices?.choice2 !== "null" ? (
              <Flex w={"100%"}>
                <List.Item>
                  {props.choices?.choice2 === "null" ? "" : props.choices?.choice2}
                </List.Item>
                <Image
                  width={props.choices?.choice2_icon !== null ? "50%" : "0px"}
                  // height={props.choices?.choice2_icon !== null ? "25px" : "0px"}
                  fit="contain"
                  src={
                    props.choices?.choice2_icon !== null
                      ? image_url2 + props.choices?.choice2_icon
                      : ""
                  }
                  alt=""
                />
              </Flex>
            ) : (
              <></>
            )}
            {props.choices?.choice3 !== "null" ? (
              <Flex w={"100%"}>
                <List.Item>
                  {props.choices?.choice3 === "null" ? "" : props.choices?.choice3}
                </List.Item>
                <Image
                  width={props.choices?.choice3_icon !== null ? "50%" : "0px"}
                  // height={props.choices?.choice3_icon !== null ? "25px" : "0px"}
                  fit="contain"
                  src={
                    props.choices?.choice3_icon !== null
                      ? image_url2 + props.choices?.choice3_icon
                      : ""
                  }
                  alt=""
                />
              </Flex>
            ) : (
              <></>
            )}
            {props.choices?.choice4 !== "null" ? (
              <Flex w={"100%"}>
                <List.Item>
                  {props.choices?.choice4 === "null" ? "" : props.choices?.choice4}
                </List.Item>
                <Image
                  width={props.choices?.choice4_icon !== null ? "50%" : "0px"}
                  // height={props.choices?.choice4_icon !== null ? "25px" : "0px"}
                  fit="contain"
                  src={
                    props.choices?.choice4_icon !== null
                      ? image_url2 + props.choices?.choice4_icon
                      : ""
                  }
                  alt=""
                />
              </Flex>
            ) : (
              <></>
            )}
          </List>
        )}
      </Box>
    );
  };

  function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      // Create chunks of the array, each item paired with its original index
      const chunk = array.slice(i, i + chunkSize).map((item, index) => ({
        item,
        originalIndex: i + index,
      }));
      result.push(chunk);
    }
    return result;
  }

  const choiceToOption = value => {
    switch (value?.answer[0]?.answer) {
      case "choice1":
        return `A. ${
          value.choices.length === 0 || value?.choices[0]?.choice1 === "null"
            ? ""
            : value?.choices[0]?.choice1
        }`;
      case "choice2":
        return `B. ${
          value.choices.length === 0 || value?.choices[0]?.choice2 === "null"
            ? ""
            : value?.choices[0]?.choice2
        }`;
      case "choice3":
        return `C. ${
          value.choices.length === 0 || value?.choices[0]?.choice3 === "null"
            ? ""
            : value?.choices[0]?.choice3
        }`;
      case "choice4":
        return `D. ${
          value.choices.length === 0 || value?.choices[0]?.choice4 === "null"
            ? ""
            : value?.choices[0]?.choice4
        }`;
      case "a":
        return `A. ${
          value.choices.length === 0 || value?.choices[0]?.choice1 === "null"
            ? ""
            : value?.choices[0]?.choice1
        }`;
      case "b":
        return `B. ${
          value.choices.length === 0 || value?.choices[0]?.choice2 === "null"
            ? ""
            : value?.choices[0]?.choice2
        }`;
      case "c":
        return `C. ${
          value.choices.length === 0 || value?.choices[0]?.choice3 === "null"
            ? ""
            : value?.choices[0]?.choice3
        }`;
      case "d":
        return `D. ${
          value.choices.length === 0 || value?.choices[0]?.choice4 === "null"
            ? ""
            : value?.choices[0]?.choice4
        }`;

      default:
        return "";
    }
  };

  const choiceToIcon = value => {
    switch (value?.answer[0]?.answer) {
      case "choice1":
        return `${value?.choices[0]?.choice1_icon}`;
      case "choice2":
        return `${value?.choices[0]?.choice2_icon}`;
      case "choice3":
        return `${value?.choices[0]?.choice3_icon}`;
      case "choice4":
        return `${value?.choices[0]?.choice4_icon}`;

      default:
        return null;
    }
  };

  const SolutionBox = props => {
    return (
      <>
        <Text w="100%" fw={600} fz="md" mb={5}>
          Question {props.index}
        </Text>
        <Box
          mb={10}
          w="100%"
          // h={210}
          p={10}
          fw={500}
          fz="md"
          style={{
            border: "1px solid rgba(0,0,0,0.5)",
            color: theme.colors.textColor[0],
            // overflow: "hidden",
          }}
        >
          <Text fw={500} fz="md" mb={5} color={theme.colors.textColor[1]}>
            Solution :
          </Text>
          <Text fw={400} fz="md" mb={5} color={theme.colors.textColor[0]}>
            Choice : {choiceToOption(props.value)}
          </Text>
          {props.value?.choices.length ? (
            <Image
              width={choiceToIcon(props.value) !== "null" ? "50px" : "0px"}
              // height={choiceToIcon(props.value) !== "null" ? "70px" : "0px"}
              fit="contain"
              src={
                choiceToIcon(props.value) !== "null" ? image_url2 + choiceToIcon(props.value) : ""
              }
              alt=""
            />
          ) : (
            ""
          )}
          {props.value?.answer[0]?.solution !== null ? (
            <Image
              width={props.value?.answer[0]?.solution !== null ? "60%" : "0px"}
              // height={props.value?.answer[0]?.solution !== null ? "100px" : "0px"}
              fit="contain"
              src={
                props.value?.answer[0]?.solution !== null
                  ? image_url2 + props.value?.answer[0]?.solution
                  : ""
              }
              alt=""
            />
          ) : (
            ""
          )}

          {props.value?.answer[0]?.solution_text?.includes("<!DOCTYPE html>") ? (
            <div dangerouslySetInnerHTML={{ __html: props.value?.answer[0]?.solution_text }} />
          ) : (
            <Text fw={400} fz="md" mb={5} color={theme.colors.textColor[0]} ta="justify">
              {props.value?.answer[0]?.solution_text || ""}
            </Text>
          )}
        </Box>
      </>
    );
  };

  const SubjectBox = props => {
    if (prevSubject !== props.value.subject_name) {
      prevSubject = props.value.subject_name;
      return (
        <>
          {props.value.subject_name !== null ? (
            <Flex
              align="center"
              justify="center"
              m={5}
              p={5}
              pr={10}
              pl={10}
              style={{
                border: "1px solid rgba(0,0,0,0.5)",
              }}
            >
              <Text ta="center" fw={500} fz="md" color={theme.colors.textColor[0]}>
                {props.value.subject_name === null ? "" : props.value.subject_name}
              </Text>
            </Flex>
          ) : (
            <></>
          )}
        </>
      );
    }
    return <></>;
  };

  const PrintHeader = () => {
    return (
      <>
        <Grid justify="center" align="center" mt={10}>
          <Col span={4}>
            <Image
              width={100}
              height={55}
              fit="contain"
              src={
                image_url +
                "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftella-logo.d913eb8b.png&w=256&q=75"
              }
            />
          </Col>
          <Col span={4}>
            <Text
              ta="center"
              fw={700}
              fz="xl"
              color={theme.colors.textColor[0]}
              style={{ border: !isQuestions ? "1px solid rgba(0,0,0,0.5)" : "none" }}
            >
              {questions?.test}
            </Text>
            {isQuestions ? (
              <></>
            ) : (
              <Text ta="center" fw={500} fz="xl">
                Solutions
              </Text>
            )}
          </Col>
          <Col span={4}>
            {!isQuestions ? (
              <></>
            ) : (
              <Flex direction="column" align="flex-end">
                <Text ta="center" fw={500} fz="md">
                  Total No. Of Questions: {sortedQuestions?.length}
                </Text>
                <Text ta="center" fw={500} fz="md">
                  Total Time: {questions?.timing} Minutes
                </Text>
              </Flex>
            )}
          </Col>
        </Grid>
        <Divider mb={10} mt={10} />
      </>
    );
  };

  const PrintBody = () => {
    let bodyContents = [];

    if (sortedQuestions?.length !== 0) {
      bodyContents = [];
      const results = chunkArray(sortedQuestions, 8);

      results.forEach(item => {
        const testBodyContents = {
          firstHalf: [],
          secondHalf: [],
        };
        const midpoint = Math.ceil(item.length / 2);
        let firstHalf = item.slice(0, midpoint);
        let secondHalf = item.slice(midpoint);

        firstHalf.map((value, index) => {
          isQuestions
            ? testBodyContents.firstHalf.push(
                <Flex direction="column" align="center">
                  <SubjectBox value={value.item} />
                  <QuestionBox
                    key={index}
                    index={value.originalIndex + 1}
                    icon={value.item.icon}
                    question={value.item.questions}
                    choices={value.item.choices?.length ? value.item.choices[0] : []}
                  />
                </Flex>
              )
            : testBodyContents.firstHalf.push(
                <Flex direction="column" align="center">
                  <SubjectBox value={value.item} />
                  <SolutionBox key={index} index={value.originalIndex + 1} value={value.item} />
                </Flex>
              );
        });

        secondHalf.map((value, index) => {
          isQuestions
            ? testBodyContents.secondHalf.push(
                <Flex direction="column" align="center">
                  <SubjectBox value={value.item} />
                  <QuestionBox
                    key={index}
                    index={value.originalIndex + 1}
                    icon={value.item.icon}
                    question={value.item.questions}
                    choices={value.item.choices?.length ? value.item.choices[0] : []}
                  />
                </Flex>
              )
            : testBodyContents.secondHalf.push(
                <Flex direction="column" align="center">
                  <SubjectBox value={value.item} />
                  <SolutionBox key={index} index={value.originalIndex + 1} value={value.item} />
                </Flex>
              );
        });

        testBodyContents.firstHalf?.map((value, index) => {
          return bodyContents.push(
            <Box
              style={{
                borderBottom: isQuestions ? "6px" : "",
                paddingBottom: isQuestions ? "30px" : "",
              }}
            >
              <Grid>
                <Grid.Col span={6}>
                  <Box
                    style={{
                      borderRight: isQuestions ? "1px solid rgba(0,0,0,0.5)" : "",
                    }}
                  >
                    {value}
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>{testBodyContents.secondHalf[index]}</Grid.Col>
              </Grid>
            </Box>
          );
        });
      });
    }

    return bodyContents;
  };

  return (
    <Container fluid>
      <Box p={35}>
        <UnstyledButton
          onClick={() => {
            props.setIsView(false);
            //navigate("/test/print");
          }}
        >
          <Flex direction="row">
            <IconArrowNarrowLeft stroke={2} style={{ width: "20px" }} />
            <Text fw={500} fz="md" c={theme.colors.textColor[0]}>
              Back
            </Text>
          </Flex>
        </UnstyledButton>
        <Flex direction="row" justify="space-between" mt={20}>
          <Flex direction="column">
            <Text fw={700} fz="xl" c={theme.colors.textColor[0]}>
              {isQuestions ? "Print Questions" : "Print Solutions"}
            </Text>
            <Text fw={400} fz="md" c={theme.colors.textColor[1]}>
              {isQuestions ? "Print the questions" : "Print the solutions"}
            </Text>
          </Flex>
          {/* <Button
            fz="md"
            variant="outline"
            onClick={() => {
              handlePrint();
            }}
          >
            {isQuestions ? "Print Questions" : "Print Solutions"}
          </Button> */}
        </Flex>
        {/* <div style={{ marginTop: "10px" }}>
          <Flex gap="lg" direction={"column"} ref={componentRef}>
            {Array(Math.floor(sortedQuestions?.length / 8) + 1 || 0)
              .fill(1)
              .map((x, pageIndex) => (
                <Box key={pageIndex} p={15} h="1080px" bg="#fff" style={{ overflow: "hidden" }}>
                  <Grid mt={10} h="100%">
                    <Col span={6} style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                      {sortedQuestions?.map((value, index) =>
                        index >= pageIndex * 8 && index < pageIndex * 8 + 4 ? (
                          isQuestions ? (
                            <Flex direction="column" align="center">
                              <SubjectBox value={value} />
                              <QuestionBox
                                key={index}
                                index={index + 1}
                                icon={value.icon}
                                question={value.questions}
                                choices={value.choices?.length ? value.choices[0] : []}
                              />
                            </Flex>
                          ) : (
                            <Flex direction="column" align="center">
                              <SubjectBox value={value} />
                              <SolutionBox key={index} index={index + 1} value={value} />
                            </Flex>
                          )
                        ) : (
                          <div key={index}></div>
                        )
                      )}
                    </Col>
                    <Col
                      span={6}
                      style={{
                        borderTop: "1px solid rgba(0,0,0,0.1)",
                        borderLeft: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      {sortedQuestions?.map((value, index) =>
                        index >= pageIndex * 8 + 4 && index < pageIndex * 8 + 8 ? (
                          isQuestions ? (
                            <Flex direction="column" align="center">
                              <SubjectBox value={value} />
                              <QuestionBox
                                key={index}
                                index={index + 1}
                                icon={value.icon}
                                question={value.questions}
                                choices={value.choices[0]}
                              />
                            </Flex>
                          ) : (
                            <Flex direction="column" align="center">
                              <SubjectBox value={value} />
                              <SolutionBox key={index} index={index + 1} value={value} />
                            </Flex>
                          )
                        ) : (
                          <div key={index}></div>
                        )
                      )}
                    </Col>
                  </Grid>
                </Box>
              ))}
          </Flex>
        </div> */}
        <PrintLayout
          title="Questions"
          pagesQuestions={chunkArray(sortedQuestions, 6)}
          isQuestions={isQuestions}
          totalQuestions={sortedQuestions.length}
          timing={questions?.timing}
          testTitle={questions?.test}
          elements={[<PrintHeader />, ...PrintBody()]}
        />
      </Box>
    </Container>
  );
};

export default ViewTest;
