import React from 'react'
import { Parser } from 'html-to-react'
import markdownIt from 'markdown-it';

import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import deflist from 'markdown-it-deflist';
import abbr from 'markdown-it-abbr';
import footnote from 'markdown-it-footnote';
import insert from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import taskLists from 'markdown-it-task-lists';
import container from 'markdown-it-container';
import katex from 'markdown-it-katex-external';
import miip from 'markdown-it-images-preview';
import html5Embed from 'markdown-it-html5-embed';
import markdownItImSize from 'markdown-it-imsize';
import $ from "jquery";
import './style.css'

const md = markdownIt({
  html: true,        // Enable HTML tags in source
  xhtmlOut: true,        // Use '/' to close single tags (<br />).
  breaks: true,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'lang-',  // CSS language prefix for fenced blocks. Can be
  linkify: false,
  typographer: true,
  quotes: '“”‘’'
});

md.use(emoji)
  .use(taskLists)
  .use(sup)
  .use(sub)
  .use(container)
  .use(container, 'hljs-left') /* align left */
  .use(container, 'hljs-center')/* align center */
  .use(container, 'hljs-right')/* align right */
  .use(deflist)
  .use(abbr)
  .use(footnote)
  .use(insert)
  .use(mark)
  .use(container)
  .use(miip)
  .use(katex)
  .use(html5Embed, {
    html5embed: {
      useImageSyntax: true
    }
  }).use(markdownItImSize)

const parser = new Parser();

const Markdown = (props) => {
  const { markdown } = props;

  React.useEffect(() => {
    $(document.links).filter(function () {
      return this.hostname != window.location.hostname;
    }).attr('target', '_blank');
  }, [])

  let htmlInput = md.render(markdown || '');

  if (props.useCORS) {
    htmlInput = htmlInput.replace(
      /<img src="(.*?)" (.*?)>/g,
      `<img src="$1?not-from-cache-please" width="200" height="200" crossOrigin="anonymous" $2 />`
    )
  }

  htmlInput = htmlInput.replace(
    /<img src="(.*?)" (.*?)>/g,
    `<div class="markdown-image"><img src="$1" $2></div>`
  );

  return (
    <div className='markdown-body'>
      {parser.parse(htmlInput)}
    </div>
  )
}

export default Markdown;
