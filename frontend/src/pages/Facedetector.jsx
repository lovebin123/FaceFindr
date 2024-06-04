import { DownloadIcon } from '@chakra-ui/icons';
import { Button, Flex, Input, Text, Spinner, Box } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import './facedetector.css';

function Facedetector() {
  const inputFileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async () => {
    setLoading(true);
    const file = inputFileRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://face-recognizer-zdyxexhcyq-uc.a.run.app/upload', {
        method: 'POST',
        mode: 'no-cors',
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="80vh">
      <Box position="relative">
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
          position={'relative'}  // changed from fixed to relative
          borderWidth={2}
          borderColor={'#00ADB5'}
        >
          <Button as="label" colorScheme="none" htmlFor="upload" disabled={loading}>
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
        {loading && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            justifyContent="center"
            alignItems="center"
            background="rgba(0, 0, 0, 0.5)"
            borderRadius={12}
          >
            <Spinner size="xl" color="#00ADB5" />
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export default Facedetector;
