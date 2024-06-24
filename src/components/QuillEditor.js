import React from "react";
import ReactQuill from "react-quill";

import QuillCustom, { formats, modules } from "./QuillCustom";
import "react-quill/dist/quill.snow.css";

export const QuillEditor = props => {
  const handleChange = value => {
    props.setState({ value });
  };

  return (
    <div className="text-editor" style={props.style}>
      <QuillCustom style={{ width: props.width, background: props.background, display: props.readOnly?"none":"block" }} />
      <ReactQuill
        readOnly={props.readOnly}
        style={{ height: props.height, width: props.width }}
        theme="snow"
        value={props.state.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default QuillEditor;
