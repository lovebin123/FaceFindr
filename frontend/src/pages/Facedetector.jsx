import { DownloadIcon } from '@chakra-ui/icons';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React from 'react';
function Facedetector() {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:5001/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Handle response from backend
      console.log('Response from backend:', data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
  };

  return (
    <Flex
      justifyContent="center"
      w={60}
      h={40}
      bgGradient="linear(to-bl, rgb(252, 165, 241),rgb(110, 255, 255))"
      borderRadius={12}
      alignItems="center"
      fontWeight="medium"
      fontSize="sm"
      id='box'
      textAlign="center"
    
      
      className="gradient-border"
    >    
      <Button as="label" colorScheme="none" htmlFor="upload">
        <Flex direction={'column'} justifyContent={'center'} alignItems={'center'} gap={4}>
          <DownloadIcon color={'white.400'} boxSize={8}/>
          <Text textColor={'white.400'}>Upload your file</Text>
        </Flex>
        <Input
          id="upload"
          type="file"
          opacity="0"
          cursor="pointer"
          aria-hidden="true"
          accept="image/*"
          onChange={handleFileSelect}
          display="none"
        />
      </Button>
    </Flex>
  );
}

export default Facedetector;
