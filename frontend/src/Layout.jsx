import { ChakraProvider, Flex } from '@chakra-ui/react'
import React from 'react'
import Sidebar from './components/Sidebar'
import { Meteors } from './components/ui/meteors'
import { Outlet } from 'react-router-dom'


function Layout() {
  return (
<ChakraProvider >
    <Flex
      style={{
        background: '#303841',
       
      }}
      direction={'column'} 
       h={'100vh'} w={'100vw'} 
      
    >
     <Flex justifyContent={'center'}  >
          <Sidebar />
        </Flex>
     
       
      <div  >
                <Outlet />
            </div>
    </Flex>
    </ChakraProvider>




  )
}

export default Layout