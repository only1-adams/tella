import { image_url, image_url2 } from "config";

export default function usePdf() {
  const generateQuestion = function ({ question, icon, index, choices, for2 }) {
    return `<td style="border-right: ${!for2 ? "1px solid #00000030" : ""}; padding-left:${
      !for2 ? "" : "10px"
    }">
                <div>
                    <p style="font-size: 15px; font-weight: bold; margin: 0;">
                        ${index}. <span>${question}</span>
                    </p>
                    <div>
                        <ul style="list-style: upper-alpha; margin-top: 6px">
                            ${generateChoices({ choices })}
                        </ul>
                    </div>
                </div>
            </td>`;
  };

  const generateSolution = function ({ index, value }) {
    return `<td style="border:1px solid black">
                <div>
                    <p style="font-size: 15px; font-weight: bold; margin: 0;">
                        Solution:
                    </p>
                    <p style="font-size: 15px; font-weight: bold; margin-top: 10px;">
                        Choice: ${choiceToOption(value)}
                    </p>
                    
                </div>
            </td>`;
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

    if (choices.choice1 !== null) {
      choicesStr += ` <li>${choices.choice1}</li>`;
    }

    if (choices.choice2 !== null) {
      choicesStr += ` <li>${choices.choice2}</li>`;
    }

    if (choices.choice3 !== null) {
      choicesStr += ` <li>${choices.choice3}</li>`;
    }

    if (choices.choice4 !== null) {
      choicesStr += ` <li>${choices.choice4}</li>`;
    }

    return choicesStr;
  };

  const generateRow = function ({ col1, col2 }) {
    return `<tr>
                ${col1} ${col2}
            </tr>`;
  };

  const pageContent = function ({
    contentsArr,
    pageNum,
    isQuestions,
    testTile,
    totalQuestions,
    timing,
  }) {
    const BodyContents = {
      firstHalf: [],
      secondHalf: [],
    };
    const midpoint = Math.ceil(contentsArr.length / 2);
    let firstHalf = contentsArr.slice(0, midpoint);
    let secondHalf = contentsArr.slice(midpoint);

    firstHalf.map(item => {
      BodyContents.firstHalf.push(
        isQuestions
          ? generateQuestion({
              question: item.item.questions,
              index: item.originalIndex + 1,
              choices: item.item.choices.length > 0 ? item.item.choices[0] : [],
              icon: item.item.icon,
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
                </head>
                <body style="display: flex; align-items: center; justify-content: center">
                    <div style="width: 100%">
                        ${
                          pageNum === 1
                            ? `<table cellspacing="0" style="width: 100%; margin-bottom:35px">
                          <tr>
                              <td>
                                <div>
                                  <img width="100" height="55" src="${
                                    image_url +
                                    "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftella-logo.d913eb8b.png&w=256&q=75"
                                  }"/>
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
                        <table cellspacing="0" style="width: 100%">
                            ${rows}
                        </table>
                        <div
                            style="
                            height: 100px;
                            border-top: 2px solid black;
                            border-bottom: 2px solid black;
                            margin-top: 10px;
                            "
                        >
                            <p style="font-size:15px;font-weight:600; text-align:center;">Space for rough work</p>
                        </div>
                        <p style="font-size:15px;font-weight:500; text-align:center; margin-top:5px">(${pageNum})</p>
                    </div>
                </body>
            </html>
        `;
  };

  return { pageContent };
}
