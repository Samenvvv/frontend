import { Box, Stack } from '@chakra-ui/react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextSeoProps } from 'next-seo'

import { CardGroup, Container, Hero, Layout, Markdown } from '@components'

interface MainViewProps {
  slug: Record<string, string[]>
  source: MDXRemoteSerializeResult<Record<string, unknown>>
  pageData: IPage
  seo: NextSeoProps
  link: string
}

const MainView = ({ pageData, seo, source }: MainViewProps): JSX.Element => {
  return (
    <Layout scrollHeight={100} seo={seo}>
      <Hero
        isFullHeight={false}
        title={pageData.title}
        image={pageData.image}
      />
      <Container>
        <Stack spacing={8} my={8}>
          {source && (
            <Box
              my={4}
              fontSize="md"
              maxW="container.md"
              mx="auto"
              textAlign="center"
            >
              <Markdown source={source} />
            </Box>
          )}
          <CardGroup
            items={pageData?.subpages as ISubpage[]}
            isSocial={false}
            hasLink
          />
        </Stack>
      </Container>
    </Layout>
  )
}

export default MainView
