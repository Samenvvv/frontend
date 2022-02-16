import {
  Avatar,
  Box,
  ButtonGroup,
  Divider,
  HStack,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaPlus, FaTimes } from 'react-icons/fa'

import { formatNumber } from '@utils'

interface MentionListItemProps {
  user_data: ITweetUserData
  onAddItem: (value: ITweetUserData) => void
  onRemoveItem?: (value: ITweetUserData) => void
}

export const MentionListItem = ({
  user_data,
  onAddItem,
  onRemoveItem,
}: MentionListItemProps): JSX.Element => {
  const { t } = useTranslation()

  if (!user_data) return <></>

  return (
    <Popover trigger="hover" placement="right">
      <PopoverTrigger>
        <HStack
          px={4}
          py={2}
          cursor="pointer"
          transition="padding 0.3s"
          _hover={{
            shadow: 'base',
            pl: 6,
          }}
        >
          <HStack flex="1" fontSize="sm">
            <Avatar
              name={user_data.screen_name}
              src={user_data.profile_image_url_https}
              size="sm"
              pos="static"
            />
            <Box>
              <Text isTruncated maxW="120px">
                {user_data.name}
              </Text>
              <Text>@{user_data.screen_name}</Text>
            </Box>
          </HStack>
          <ButtonGroup>
            {onRemoveItem && (
              <Tooltip label={t`post-share.remove`}>
                <IconButton
                  pos="static"
                  aria-label={t`post-share.remove` + ' mention'}
                  variant="ghost"
                  onClick={() => onRemoveItem(user_data)}
                  colorScheme="blackAlpha"
                  _hover={{ color: 'red.400' }}
                  rounded="full"
                  size="sm"
                  icon={<FaTimes />}
                />
              </Tooltip>
            )}
            <Tooltip label={t`post-share.add`}>
              <IconButton
                pos="static"
                aria-label={t`post-share.add` + ' mention'}
                variant="ghost"
                onClick={() => onAddItem(user_data)}
                colorScheme="blackAlpha"
                _hover={{ color: 'green.400' }}
                rounded="full"
                size="sm"
                icon={<FaPlus />}
              />
            </Tooltip>
          </ButtonGroup>
        </HStack>
      </PopoverTrigger>
      <PopoverContent
        overflow="hidden"
        placement="right"
        bg="white"
        color="black"
        minW={200}
        rounded="lg"
        py={2}
        textAlign="center"
      >
        <VStack w="full" fontSize="sm">
          <Avatar
            name={user_data.screen_name}
            size="lg"
            src={user_data.profile_image_url_https}
            shadow="primary"
          />
          <Box fontWeight={600}>
            <Text fontSize="xl">{user_data.name}</Text>
            <Text color="twitter.400">@{user_data.screen_name}</Text>
          </Box>

          <Text px={4}>{user_data.description}</Text>

          <Divider />

          <HStack w="full" justify="space-evenly">
            <Box>
              <Text>Following</Text>
              <Text>{formatNumber(user_data.friends_count)}</Text>
            </Box>
            <Box>
              <Text>Followers</Text>
              <Text>{formatNumber(user_data.followers_count)}</Text>
            </Box>
          </HStack>
        </VStack>
      </PopoverContent>
    </Popover>
  )
}
