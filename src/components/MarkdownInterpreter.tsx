"use client"

import { useTheme } from 'next-themes'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const MarkdownInterpreter = ({ content, className }: { content: string; className?: string }) => {
  const { theme } = useTheme()
  const themeStyle = theme === 'dark' ? okaidia : oneLight
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className={'flex flex-col gap-3 markdown ' + className}
      components={{
        code(props) {
          const { children, className, node, ...rest } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              style={themeStyle}
              PreTag="div"
              language={match[1]}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownInterpreter

