import { ChakraProvider, Flex } from '@chakra-ui/react'
import React from 'react'
import Sidebar from './components/Sidebar'
import { Meteors } from './components/ui/meteors'
import Vortex from './components/ui/vortex'


function Layout() {
  return (

    <Flex
      style={{
        background: 'linear-gradient(68.6deg, rgb(252, 165, 241) 1.8%, rgb(181, 255, 255) 100.5%)',
          
      }}
      
    >
      <Meteors number={90}  />
      <ChakraProvider >

        <Flex direction={'column'} justifyContent={'center'} alignItems={'center'} >
          <Sidebar />
        </Flex>
      </ChakraProvider>
    </Flex>



  )
}

export default Layout