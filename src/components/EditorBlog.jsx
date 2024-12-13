// Editor.js
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditorBlog = ({ content, setContent }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size', 'align',
    'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'list', 'bullet', 'indent', 'direction',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div style={{ width: '100%', minHeight: 'fit-content', overflow: 'auto' }}>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        placeholder="Write something amazing..."
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default EditorBlog;
