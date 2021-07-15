import React from 'react';
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default ({ children }) => (
  <ReactMarkdown remarkPlugins={[gfm]} children={children.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2')} />
)