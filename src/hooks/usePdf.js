import { image_url, image_url2 } from "config";

export default function usePdf() {
  const generateQuestion = function ({ question, icon, index, choices, for2 }) {
    console.log(question);
    return `<div style="padding-left:${!for2 ? "" : "10px"}; word-break: break-all">
                <p style="font-size: 14px; font-weight: bold; margin: 0; word-break: break-all;">
                    <span>${question.subject_name}</span>
                </p>
                <p style="font-size: 14px; font-weight: bold; margin: 0; word-break: break-all;">
                    ${index}. <span>${question}</span>
                </p>
                <img width="${icon !== null ? "50%" : "0px"}" src="${
      icon !== null ? image_url2 + icon : ""
    }"/>
                <div>
                    <ul style="list-style: upper-alpha; margin-top: 6px; word-break: break-all; padding-left: 20px; font-size: 12px;">
                        ${generateChoices({ choices })}
                    </ul>
                </div>
            </div>`;
  };

  const generateSolution = function ({ index, value }) {
    return `<div style="border:1px solid black; padding: 10px;">
                <p style="font-size: 14px; font-weight: bold; margin: 0;">
                    Question: ${index}
                </p>
                <p style="font-size: 14px; font-weight: bold; margin: 0;">
                    Solution:
                </p>
                <p style="font-size: 14px; font-weight: bold; margin-top: 10px;">
                    Choice: ${choiceToOption(value)}
                </p>
            </div>`;
  };

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

  const generateChoices = function ({ choices }) {
    if (choices.length === 0) return ``;

    let choicesStr = ``;

    if (choices.choice1 !== "null") {
      choicesStr += ` <li>${choices.choice1}</li>`;
    }

    if (choices.choice2 !== "null") {
      choicesStr += ` <li>${choices.choice2}</li>`;
    }

    if (choices.choice3 !== "null") {
      choicesStr += ` <li>${choices.choice3}</li>`;
    }

    if (choices.choice4 !== "null") {
      choicesStr += ` <li>${choices.choice4}</li>`;
    }

    return choicesStr;
  };

  const generateRow = function ({ col1, col2 }) {
    return `<tr>
                <td style="width: 49%; vertical-align: top; padding-right: 1%;">${col1}</td>
                <td style="width: 2%; vertical-align: top; border-left: 1px solid black;"></td>
                <td style="width: 49%; vertical-align: top; padding-left: 1%;">${col2}</td>
            </tr>`;
  };

  const pageContent = function ({
    contentsArr,
    pageNum,
    isQuestions,
    testTile,
    totalQuestions,
    timing
  }) {
    const BodyContents = {
      firstHalf: [],
      secondHalf: [],
    };
    const midpoint = Math.ceil(contentsArr.length / 2);
    let firstHalf = contentsArr.slice(0, midpoint);
    let secondHalf = contentsArr.slice(midpoint);

    firstHalf.map((item, index) => {
      BodyContents.firstHalf.push(
        isQuestions
          ? generateQuestion({
              question: item.item.questions,
              index: item.originalIndex + 1,
              choices: item.item.choices.length > 0 ? item.item.choices[0] : [],
              icon: item.item.icon,
              subject: index === 0 ? item.item.subject_name :""
            })
          : generateSolution({ index: item.originalIndex + 1, value: item.item })
      );
    });

    secondHalf.map(item => {
      BodyContents.secondHalf.push(
        isQuestions
          ? generateQuestion({
              question: item.item.questions,
              index: item.originalIndex + 1,
              choices: item.item.choices.length > 0 ? item.item.choices[0] : [],
              icon: item.item.icon,
              for2: true,
            })
          : generateSolution({ index: item.originalIndex + 1, value: item.item })
      );
    });

    let rows = ``;

    BodyContents.firstHalf.forEach((item, index) => {
      rows += generateRow({ col1: item, col2: BodyContents.secondHalf[index] ?? "" });
    });

    return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>PDF</title>
                    <style>
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                            font-family: Arial, sans-serif;
                            width: 210mm;
                            height: 297mm;
                            position: relative;
                        }
                        .content {
                            padding: 20mm;
                            height: calc(297mm - 130px - 40mm); /* 297mm - (header + footer + padding) */
                            box-sizing: border-box;
                        }
                        .footer {
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            height: 100px;
                            border-top: 2px solid #000000;
                            border-bottom: 2px solid #000000;
                            padding:20px 0;
                            box-sizing: border-box;
                            text-align: center;
                            background-color: red;
                        }
                        .page-number {
                            font-size: 15px;
                            font-weight: 500;
                            text-align: center;
                            margin-top: 5px;
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            box-sizing: border-box;
                        }
                    </style>
                </head>
                <body>
                    <div style="width: 100%; box-sizing: border-box;">
                        ${
                          pageNum === 1
                            ? `<table cellspacing="0" style="width: 100%; margin-bottom:35px">
                          <tr>
                              <td>
                                <div>
                                  <img style="width:100px" src="https://www.tellaclasses.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftella-logo.d913eb8b.png&w=256&q=75"/>
                                </div> 
                              </td>
                              <td>
                                <div style="text-align:center">
                                  <p style="font-size:17px;font-weight:bold;margin:0px">${testTile}</p>
                                  ${
                                    !isQuestions
                                      ? `<p style="font-size:17px;font-weight:medium;margin:0px">solutions</p>`
                                      : ``
                                  }
                                </div>
                              </td>
                              <td>
                                <div style="text-align:right">
                                  <p style="font-size:17px;font-weight:medium;margin:0px">Total No. Of Questions: ${totalQuestions}</p>
                                  <p style="font-size:17px;font-weight:medium;margin:0px">Total Time: ${timing} minutes</p>
                                </div>
                              </td>
                          </tr>
                        </table>`
                            : ``
                        }
                        <div class="content">
                            <table cellspacing="0" style="width: 100%">
                              <tr>
                                <td>
                <p style="font-size: 14px; text-align:center; font-weight: bold; margin: 0; word-break: break-all;">${firstHalf[0].item.subject_name??""}</p>
                              </td>
                              </tr>
                                ${rows}
                            </table>
                        </div>
                        
                        <div style="width: 100%;
                            height: 70px;
                            border-top: 2px solid #000000;
                            border-bottom: 2px solid #000000;
                            box-sizing: border-box;
                            text-align: center" class="footer">
                        </div>
                        <p style="font-size:12px; font-weight:bold;  text-align: center; width:100%; font-weight:600;">Space for rough work</p>
                    </div>
                </body>
            </html>`;
  };

  return { pageContent };
}
