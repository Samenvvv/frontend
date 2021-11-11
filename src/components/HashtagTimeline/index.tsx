import {
  VStack,
  HStack,
  Image,
  Text,
  Heading,
  StackDivider,
  Container,
  Spacer,
} from '@chakra-ui/react'
import { getTwitterVideoUrl } from '@utils'

import twData from '../../data/twitter-data.json'

export const HashtagTimeline = (): JSX.Element => {
  function listHashtags() {
    return (
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        <Spacer />

        {twData.statuses.map((data, index) => {
          const twitImg = data?.extended_entities?.media?.[0]?.media_url_https
          const profileImg = data?.user?.profile_image_url_https
          const videoVariants =
            data.extended_entities?.media[0].video_info.variants
          return (
            <HStack key={index} alignItems="flex-start">
              <HStack justifyContent="space-evenly">
                <Image
                  maxWidth="none"
                  rounded="100%"
                  width="80px"
                  src={profileImg}
                />
              </HStack>
              <HStack justifyContent="space-evenly">
                <VStack>
                  <Heading margin="-0.5" as="h5" size="xs">
                    {data.user.name}
                  </Heading>
                  <Text margin="-0.5" fontSize="14px">
                    {data.text}
                  </Text>
                  {videoVariants ? (
                    <video controls muted width="250">
                      <source
                        src={getTwitterVideoUrl(videoVariants as any)}
                        type={'video/mp4'}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    twitImg && <Image rounded="10%" src={twitImg} />
                  )}
                </VStack>
              </HStack>
            </HStack>
          )
        })}
      </VStack>
    )
  }

  return (
    <div className="content">
      <Container maxW="500px">{listHashtags()}</Container>
      <Spacer />
    </div>
  )
}
