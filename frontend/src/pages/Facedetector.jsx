import { DownloadIcon } from '@chakra-ui/icons';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useRef } from 'react';
import './facedetector.css'
function Facedetector() {
  const inputFileRef = useRef(null);

  const handleFileSelect = async () => {
    const file = inputFileRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5050/upload', {
        // Replace 'your-ngrok-url' with your Ngrok URL
        method: 'POST',
        mode:'no-cors',
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Response from backend:', data);
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="80vh">
      <Flex
        justifyContent="center"
        w={60}
        h={40}
        background={'#3A4750'}
        borderRadius={12}
        alignItems="center"
        fontWeight="medium"
        fontSize="sm"
        id="box"
        textAlign="center"
        position={'fixed'}
        borderWidth={2} b
        borderColor={'#00ADB5'}
      >
        <Button as="label" colorScheme="none" htmlFor="upload" >
          <Flex direction="column" justifyContent="center" alignItems="center" gap={4}>
            <DownloadIcon color="#EEEEEE" boxSize={8} />
            <Text color={'#EEEEEE'}>Upload your file</Text>
          </Flex>
          <Input
            id="upload"
            ref={inputFileRef}
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
    </Flex>
  );
}

export default Facedetector;
