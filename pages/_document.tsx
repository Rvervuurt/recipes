import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { getCssText } from '@xooom/ui'

class Document extends NextDocument {
  render() {
    return (
      <Html lang='da'>
        <Head>
          <style
            id='stitches'
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
