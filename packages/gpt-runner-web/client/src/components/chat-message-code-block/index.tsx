import type { FC } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { CodeBlockHeader, CodeBlockWrapper } from './chat-message-code-block.styles'
import { vscodeDarkPlus } from './code-style'

export interface BuildCodeToolbarState {
  contents: string
}

export interface MessageCodeBlockProps {
  contents: string
  language: string
  buildCodeToolbar?: (state: BuildCodeToolbarState) => React.ReactNode
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = (props) => {
  const { contents, language, buildCodeToolbar } = props

  return (
    <CodeBlockWrapper className='msg-code-block'>
      {buildCodeToolbar && <CodeBlockHeader>
        {buildCodeToolbar({ contents })}
      </CodeBlockHeader>}
      <SyntaxHighlighter
        useInlineStyles={true}
        codeTagProps={{ style: {} }}
        style={vscodeDarkPlus}
        language={language}
      >
        {contents}
      </SyntaxHighlighter>
    </CodeBlockWrapper>
  )
}
