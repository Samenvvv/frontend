import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { Card } from '@components'

interface SubpageSidebarTabsProps {
  page: IPage
}

export const SubpageSidebarTabs = ({
  page,
}: SubpageSidebarTabsProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Tabs isFitted colorScheme="primary" variant="soft-rounded">
      <TabList>
        <Tab textTransform="capitalize">{t`subpage.latest`}</Tab>
        <Tab textTransform="capitalize">{t`subpage.most-readed`}</Tab>
      </TabList>

      <TabPanels
        borderWidth={1}
        borderColor="gray.200"
        h="calc(100vh - 180px)"
        overflow="auto"
        mt={2}
      >
        <TabPanel>
          <VStack spacing={4}>
            {page.subpages?.slice(0, 5)?.map((subpage, i) => (
              <Card
                key={i}
                item={{ ...subpage, page }}
                isSimple
                shadow="sm"
                rounded={0}
                hasLink
              />
            ))}
          </VStack>
        </TabPanel>
        <TabPanel>
          <VStack spacing={4}>
            {page.popular?.map((subpage, i) => (
              <Card
                key={i}
                item={{ ...subpage, page }}
                isSimple
                hasLink
                shadow="sm"
              />
            ))}
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
