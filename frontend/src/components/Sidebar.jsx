import { Flex,Tabs,TabList, Tab ,Text, TabPanel, TabPanels} from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import Facedetector from '../pages/Facedetector'

function Sidebar() {
  return (
    <Flex  justifyContent={'center'} p={8} minH={'100vh'}
    minW={'100vw'}
     >
   <Tabs variant={'soft-rounded'} colorScheme='blue' align='center' >
    <TabList gap={80}>
      <Tab as={Link} to={'/dash/home'} ><Text>Home</Text></Tab>
      <Tab as={Link} to={'/dash/photo'}><Text>Photo Gallary</Text></Tab>
    </TabList>
    <TabPanels pt={80}>
      <TabPanel>
        <Facedetector/>
      </TabPanel>
    
    </TabPanels>
   </Tabs>
    </Flex>
  )
}

export default Sidebar