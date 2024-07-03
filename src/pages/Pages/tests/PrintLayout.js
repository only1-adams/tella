import { Box, Button, Flex, Text } from "@mantine/core";
import { image_url, image_url2 } from "config";
import usePdf from "hooks/usePdf";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import AppLoader from "./Loader";

const PrintLayout = props => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [isPrinting, setIsPrinting] = useState(false);

  const { pageContent } = usePdf();

  var page_size = 1120;

  var size = 0;

  async function generatePDF(htmlContent) {
    const doc = new jsPDF({
      onePage: true,
      compress: true,
      scale: 0.5,
    });

    return new Promise(resolve => {
      doc.html(htmlContent, {
        callback: function (doc) {
          // Save the PDF
          const pdfBytes = doc.output("arraybuffer");
          resolve(new Uint8Array(pdfBytes));
        },
        margin: [10, 10, 10, 10],
        autoPaging: "text",
        x: 0,
        y: 0,
        width: 190, //target width in the PDF document
        windowWidth: 675, //window width in CSS pixels
      });
    });
  }

  async function mergePDFs(pdfs) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfBytes of pdfs) {
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
  }

  async function generateFile() {
    let pages = [];

    setIsPrinting(true);

    console.log(props.pagesQuestions);

    props.pagesQuestions.forEach((item, index) => {
      const page = pageContent({
        contentsArr: item,
        pageNum: index + 1,
        isQuestions: props.isQuestions,
        timing: props.timing,
        totalQuestions: props.totalQuestions,
        testTile: props.testTitle,
      });
      pages.push(page);
    });

    const bytes = [];
    for (const page of pages) {
      const byte = await generatePDF(page);
      bytes.push(byte);
    }

    const mergedPdfBytes = await mergePDFs(bytes);

    // Handle the merged PDF (e.g., display it, upload it, etc.)
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsPrinting(false);
  }

  return (
    <Box>
      <Flex align={"center"} justify={"right"} mb={20}>
        <Button
          onClick={() => {
            // handlePrint();
            generateFile();
          }}
        >
          Print {props.title}
        </Button>
      </Flex>

      {isPrinting && <AppLoader />}

      <Box mt={0} mb={0} p={10} pb={0} pt={0} ref={componentRef}>
        {props.elements?.map((e, index) => (
          <Box key={index} mb={0}>
            {e}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PrintLayout;
