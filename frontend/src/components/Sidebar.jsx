import { Flex,Tabs,TabList, Tab ,Text, TabPanel, TabPanels} from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import Facedetector from '../pages/Facedetector'
import Facegallary from '../pages/Facegallary'

function Sidebar() {
  return (
    <Flex p={8}   
    
     >
   <Tabs defaultIndex={1} variant={'soft-rounded'} colorScheme='#00ADB5'  >
    <TabList gap={80}  >
      <Tab defaultChecked as={Link} to={'/home'}  borderColor={'#00ADB5'} borderWidth={2}><Text color={'#EEEEEE'}>Home</Text></Tab>
      <Tab as={Link} to={'/photo'} borderColor={'#00ADB5'} borderWidth={2}><Text color={'#EEEEEE'}>Photo Gallary</Text></Tab>
    </TabList>
   
   </Tabs>
    </Flex>
  )
}

export default Sidebar