import { ChangeEvent, useCallback, useEffect, useRef } from 'react'

import {
  AspectRatio,
  Box,
  Button,
  chakra,
  Flex,
  SimpleGrid,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useBoolean,
  VStack,
  Wrap,
} from '@chakra-ui/react'
import { TwitterShareButton } from 'next-share'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { FaAt, FaEdit, FaRandom, FaTwitter } from 'react-icons/fa'

import { ChakraNextImage, Navigate } from '@components'
import {
  checkCharacterCount,
  removeMention,
  removeTrend,
  setPostContent,
  setPostText,
  useAppDispatch,
  useAppSelector,
} from '@store'

export const PostContainer = ({
  onOpen,
  post,
}: {
  onOpen: () => void
  post: IHashtagPost
}): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [editable, setEditable] = useBoolean(false)
  const { push, locale } = useRouter()

  const contentRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    postText,
    postContent,
    mentions,
    trends,
    isCharCountExceeded: isCharacterCountExceeded,
    totalCharCount,
  } = useAppSelector(state => state.postShare)

  const redirectToRandomPost = useCallback(() => {
    const randomPostIndex = Math.floor(
      Math.random() * (post?.posts?.length || 0),
    )

    const randomPost = post?.posts?.[randomPostIndex]

    push(
      `/${post?.hashtag?.page?.slug}/${post?.hashtag?.slug}/${randomPost?.slug}`,
    )
  }, [post, push])

  const tweetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${post?.hashtag?.page?.slug}/${post?.hashtag?.slug}/${post.slug}`

  useEffect(() => {
    const mentionsStr = mentions.join('\n@').replace('@@', '@')
    // prettier-ignore
    const trendsStr = post.hashtag?.hashtag + (trends.length > 0 ? '\n' + trends.join('\n') : '')
    const postContent = `${postText}\n\n${mentionsStr}\n\n${trendsStr}`

    dispatch(setPostContent(postContent))
    dispatch(checkCharacterCount())
  }, [postText, mentions, trends, post, dispatch, locale])

  const onRemoveMention = (mention: string) => {
    dispatch(removeMention(mention))
  }
  const onRemoveTrend = (trend: string) => {
    dispatch(removeTrend(trend))
  }

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    dispatch(setPostText(e.target.value))
  }

  useEffect(() => {
    dispatch(setPostText(post.text))
  }, [post, dispatch])

  useEffect(() => {
    if (editable) {
      contentRef.current?.focus()
      contentRef.current?.select()
    }
  }, [editable])

  return (
    <Stack
      p={4}
      rounded="lg"
      bg="orange.50"
      borderWidth={1}
      align="stretch"
      borderColor="gray.500"
      spacing={4}
      flex={1}
      direction={{ base: 'column', lg: 'row' }}
    >
      <VStack align="stretch" flex="1">
        <Flex justify="space-between">
          <Text
            color="gray.500"
            fontSize="sm"
          >{t`post-share.content-label`}</Text>
          <Text color="gray.500" fontSize="sm">
            <chakra.span
              {...(isCharacterCountExceeded && {
                color: 'red.400',
                fontWeight: 'bold',
              })}
            >
              {totalCharCount}
            </chakra.span>
            /280
          </Text>
        </Flex>
        <Box h={600} overflow="auto">
          <Box
            p={4}
            rounded="lg"
            borderWidth={1}
            bg={isCharacterCountExceeded ? 'red.50' : 'gray.50'}
            borderColor={isCharacterCountExceeded ? 'red.500' : 'gray.500'}
          >
            {editable ? (
              <chakra.textarea
                borderColor="gray.500"
                borderWidth={1}
                rounded="lg"
                rows={6}
                ref={contentRef}
                p={2}
                w="full"
                onBlur={setEditable.toggle}
                onChange={onChangeContent}
              >
                {postText}
              </chakra.textarea>
            ) : (
              <chakra.div
                p={2}
                cursor="text"
                borderWidth={2}
                borderColor="transparent"
                rounded="lg"
                transition="all 0.3s ease-in-out"
                _hover={{ borderColor: 'gray.400', bg: 'white' }}
                whiteSpace="pre-line"
                onClick={setEditable.toggle}
                overflow="auto"
              >
                {postText}
              </chakra.div>
            )}
            <Box mt={2}>
              {mentions?.length > 0 && (
                <Box mb={2}>
                  <Text color="gray.500" fontSize="sm">
                    Mentions
                  </Text>
                  <Wrap>
                    {mentions.map((mention, i) => (
                      <Tag
                        rounded="full"
                        key={i}
                        variant="outline"
                        colorScheme="primary"
                      >
                        <TagLabel>{mention}</TagLabel>
                        <TagCloseButton
                          onClick={() => onRemoveMention(mention)}
                        />
                      </Tag>
                    ))}
                  </Wrap>
                </Box>
              )}
              <Box mb={2}>
                <Text color="gray.500" fontSize="sm">
                  Trends
                </Text>
                <Wrap>
                  <Tag rounded="full" variant="outline">
                    <TagLabel>{post?.hashtag?.hashtag}</TagLabel>
                  </Tag>
                  {trends.map((trend, i) => (
                    <Tag rounded="full" key={i} variant="outline">
                      <TagLabel>{trend}</TagLabel>
                      <TagCloseButton onClick={() => onRemoveTrend(trend)} />
                    </Tag>
                  ))}
                </Wrap>
              </Box>
            </Box>
            {post?.image && (
              <AspectRatio
                borderColor="gray.500"
                borderWidth={1}
                rounded="2xl"
                pos="relative"
                ratio={1200 / 675}
                overflow="hidden"
                flexShrink={0}
              >
                <ChakraNextImage h={'100%'} image={post?.image.url} />
              </AspectRatio>
            )}
          </Box>
        </Box>
        <SimpleGrid
          columns={2}
          spacing={2}
          mt="auto"
          flex={1}
          alignContent="end"
        >
          <Button
            display={{ base: 'flex', lg: 'none' }}
            isFullWidth
            rounded="full"
            colorScheme="purple"
            onClick={onOpen}
            rightIcon={<FaAt />}
          >
            {t`post-share.add-mention`}
          </Button>
          <Button
            display={{ base: 'flex', lg: 'none' }}
            isFullWidth
            rounded="full"
            colorScheme="green"
            onClick={setEditable.on}
            rightIcon={<FaEdit />}
          >
            {t`post-share.edit-content`}
          </Button>
          <Button
            isFullWidth
            rounded="full"
            colorScheme="primary"
            onClick={redirectToRandomPost}
            rightIcon={<FaRandom />}
          >
            {t`post-share.next-tweet`}
          </Button>
          <TwitterShareButton title={postContent} url={tweetUrl}>
            <Button
              isFullWidth
              rounded="full"
              colorScheme="twitter"
              rightIcon={<FaTwitter />}
              isDisabled={isCharacterCountExceeded}
            >
              {t`post-share.share-tweet`}
            </Button>
          </TwitterShareButton>
        </SimpleGrid>
      </VStack>
      <Box
        pos="relative"
        w={{ base: 'full', lg: 150 }}
        h={{ base: 115, lg: 'full' }}
        overflow="hidden"
      >
        <Stack pos="absolute" top={0} left={0} h="full" w="full">
          <Text
            color="gray.500"
            fontSize="sm"
          >{t`post-share.other-posts`}</Text>
          <Stack
            direction={{ base: 'row', lg: 'column' }}
            h="full"
            w="full"
            overflowY={{ base: 'hidden', lg: 'auto' }}
            overflowX={{ base: 'auto', lg: 'hidden' }}
          >
            {post?.posts?.slice(0, 15).map((p, i) => (
              <Box
                key={i}
                borderWidth={1}
                borderColor="gray.500"
                rounded="lg"
                overflow="hidden"
                flexShrink={0}
              >
                <Navigate
                  href={`/${post?.hashtag?.page?.slug}/${post?.hashtag?.slug}/${p?.slug}`}
                >
                  <ChakraNextImage
                    w={150}
                    h={85}
                    image={p.image?.url as string}
                  />
                </Navigate>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}
