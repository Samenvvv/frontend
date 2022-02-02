import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AspectRatio,
  Box,
  Button,
  chakra,
  Flex,
  IconButton,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react'
import useDebounce from '@rooks/use-debounce'
import { TwitterShareButton } from 'next-share'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { FaAt, FaEdit, FaRandom, FaTwitter } from 'react-icons/fa'

import { ChakraNextImage, Navigate, TagList } from '@components'
import { useCheckCharacterCount, useItemLink } from '@hooks'
import {
  removeMentionUsername,
  removeTrendName,
  setPostContent,
  setPostText,
  useAppDispatch,
  useAppSelector,
} from '@store'
import { getItemLink, getRandomPostSentence } from '@utils'

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
  const [editArea, setEditArea] = useState<string>('')

  const { postText, postContent, mentionUsernames, trendNames } =
    useAppSelector(state => state.postShare)

  const [totalCharCount, isCharacterCountExceeded] = useCheckCharacterCount()

  const redirectToRandomPost = useCallback(() => {
    const randomPostIndex = Math.floor(
      Math.random() * (post?.posts?.length || 0),
    )

    const randomPost = post?.posts?.[randomPostIndex] as IHashtagPost
    randomPost.hashtag = post.hashtag
    const randomPostLink = getItemLink(randomPost, locale as string)

    push(randomPostLink as string)
  }, [post, locale, push])

  const postUrlAbsolute = useItemLink(post, true)

  useEffect(() => {
    const mentionsStr = mentionUsernames.join('\n')
    // prettier-ignore
    const trendsStr = post.hashtag?.hashtag + (trendNames.length > 0 ? '\n' + trendNames.join('\n') : '')
    const postContent = `${postText}\n\n${mentionsStr}\n\n${trendsStr}`

    dispatch(setPostContent(postContent))
  }, [postText, mentionUsernames, trendNames, post, dispatch, locale])

  const onRemoveMention = (mention: string) => {
    dispatch(removeMentionUsername(mention))
  }
  const onRemoveTrend = (trend: string) => {
    dispatch(removeTrendName(trend))
  }

  const onChangeContent = useDebounce((): void => {
    dispatch(setPostText(editArea))
  }, 800)

  const generateRandomPostText = useCallback(() => {
    const randomPostSentence = getRandomPostSentence(locale as string)
    const combinations = [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 2],
      [1, 3],
    ]
    const randomCombination =
      combinations[Math.floor(Math.random() * (combinations.length - 1))]

    const randomPostText = post.text
      .split('.')
      .slice(randomCombination[0], randomCombination[1])
      .join('.')
      .trim()

    const combinedText = `${randomPostText}\n\n"${randomPostSentence}"`

    dispatch(setPostText(combinedText))
  }, [dispatch, locale, post.text])

  useEffect(() => {
    generateRandomPostText()
  }, [generateRandomPostText])

  useEffect(() => {
    if (editable) {
      contentRef.current?.focus()
      contentRef.current?.select()
    }
  }, [editable])

  return (
    <Stack
      p={4}
      shadow="md"
      bg="orange.50"
      align="stretch"
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
          <Text
            color="gray.500"
            fontSize="sm"
            data-tour="step-character-limit"
            data-tour-mob="step-character-limit"
          >
            <chakra.span
              {...(isCharacterCountExceeded && {
                color: 'red.400',
                fontWeight: 600,
              })}
            >
              {totalCharCount}
            </chakra.span>
            /280
          </Text>
        </Flex>
        <Stack
          spacing={0}
          overflow="auto"
          pos="relative"
          h={{ base: 470, xl: 520 }}
        >
          <IconButton
            pos="absolute"
            top={1}
            right={1}
            rounded="full"
            colorScheme="twitter"
            aria-label="random post"
            icon={<FaRandom />}
            onClick={generateRandomPostText}
          />
          <Stack
            flex={1}
            data-tour="step-post-content"
            data-tour-mob="step-post-content"
            p={4}
            rounded="sm"
            borderWidth={1}
            bg={isCharacterCountExceeded ? 'red.50' : 'gray.50'}
            borderColor={isCharacterCountExceeded ? 'red.500' : 'gray.200'}
            fontSize="md"
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
                onChange={event => {
                  setEditArea(event.target.value)
                  onChangeContent()
                }}
              >
                {postText}
              </chakra.textarea>
            ) : (
              <chakra.div
                data-tour="step-post-text"
                data-tour-mob="step-post-text"
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
            <Box
              mt={2}
              data-tour-mob="step-post-added"
              data-tour="step-post-added"
            >
              {mentionUsernames?.length > 0 && (
                <Box mb={2}>
                  <Text color="gray.500" fontSize="sm">
                    Mentions
                  </Text>
                  <TagList
                    tags={mentionUsernames}
                    onClickButton={onRemoveMention}
                    colorScheme="primary"
                  />
                </Box>
              )}
              <Box mb={2}>
                <Text color="gray.500" fontSize="sm">
                  {t`post-share.trends-label`}
                </Text>
                <TagList
                  tags={[
                    post?.hashtag?.hashtag as string,
                    post?.hashtag?.hashtag_extra as string,
                    ...trendNames,
                  ]}
                  onClickButton={onRemoveTrend}
                />
              </Box>
            </Box>
            <Spacer />
            {post?.image && (
              <AspectRatio
                rounded="md"
                pos="relative"
                ratio={1200 / 675}
                overflow="hidden"
                flexShrink={0}
                borderColor="gray.300"
                borderWidth={1}
              >
                <ChakraNextImage h={'100%'} image={post?.image.url} />
              </AspectRatio>
            )}
          </Stack>
        </Stack>
        <SimpleGrid
          columns={{ base: 1, xl: 2 }}
          spacing={2}
          mt="auto"
          flex={1}
          alignContent="end"
        >
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
            data-tour-mob="step-mention-button"
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
            data-tour-mob="step-next-button"
            data-tour="step-next-button"
            isFullWidth
            rounded="full"
            colorScheme="primary"
            onClick={redirectToRandomPost}
            rightIcon={<FaRandom />}
          >
            {t`post-share.next-tweet`}
          </Button>
          <TwitterShareButton
            title={postContent}
            url={postUrlAbsolute as string}
          >
            <Button
              data-tour="step-share-button"
              data-tour-mob="step-share-button"
              as="span"
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
        <Stack
          pos="absolute"
          top={0}
          left={0}
          h="full"
          w="full"
          data-tour="step-other-posts"
          data-tour-mob="step-other-posts"
        >
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
            {post?.posts?.slice(0, 15).map((p, i) => {
              p.hashtag = post.hashtag

              return (
                <Box
                  key={i}
                  rounded="md"
                  shadow="base"
                  overflow="hidden"
                  flexShrink={0}
                >
                  <Navigate href={getItemLink(p, locale as string) as string}>
                    <ChakraNextImage
                      w={150}
                      h={85}
                      image={p.image?.url as string}
                    />
                  </Navigate>
                </Box>
              )
            })}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}
