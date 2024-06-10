import React, { useEffect, useState } from 'react';
import { Flex, useDisclosure, Button, Image, Avatar, Stack, CircularProgress } from '@chakra-ui/react';
import axios from 'axios';
import { Gallery } from "react-grid-gallery";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

function Facegallary() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [keys, setKeys] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://facefindr-0dej.onrender.com/dash/keys');
        setKeys(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleAvatarClick = (images) => {
    const imageURLs = images
      .replace(/[\[\]']/g, '') 
      .split(',')
      .map(url => {
        const trimmedURL = decodeHTML(url.trim());
        const lowercaseJpgIndex = trimmedURL.indexOf(".jpg");
        const uppercaseJpgIndex = trimmedURL.indexOf(".JPG");
        const lowercaseJpegIndex = trimmedURL.indexOf(".jpeg");
        const uppercaseJpegIndex = trimmedURL.indexOf(".JPEG");
        const firebaseIndex = trimmedURL.indexOf("https://kkhsobiinyhntegdenee.supabase.co/");
        const startIndex = firebaseIndex !== -1 ? firebaseIndex : 0;

        let endIndex = -1;

        // Determine the end index for .jpg or .JPG
        if (lowercaseJpgIndex !== -1) {
          endIndex = lowercaseJpgIndex + 4;
        } else if (uppercaseJpgIndex !== -1) {
          endIndex = uppercaseJpgIndex + 4;
        }
        // Determine the end index for .jpeg or .JPEG
        if (lowercaseJpegIndex !== -1) {
          endIndex = lowercaseJpegIndex + 5;
        } else if (uppercaseJpegIndex !== -1) {
          endIndex = uppercaseJpegIndex + 5;
        }

        let modifiedURL = endIndex !== -1 ? trimmedURL.substring(startIndex, endIndex) : trimmedURL.substring(startIndex);

        // Remove %22 after the image extension (.jpg, .JPG, .jpeg, .JPEG) at the end of the URL
        modifiedURL = modifiedURL.replace(/\.jpg%22$/, ".jpg")
                                .replace(/\.JPG%22$/, ".JPG")
                                .replace(/\.jpeg%22$/, ".jpeg")
                                .replace(/\.JPEG%22$/, ".JPEG");

        return modifiedURL;
      })
      .map(url => url.replace("http://localhost:5174/dash/%22", ""));
    
    setSelectedImages(imageURLs);
    onOpen();
  };

  return (
    <Flex justifyContent="center" gap={10} alignItems="center" flexWrap={'wrap'} pt={8}>
      {loading ? (
        <CircularProgress isIndeterminate color='#00ADB5' />
      ) : (
        keys.map((item, index) => (
          <Flex key={index} cursor="pointer" onClick={() => handleAvatarClick(item.values)} pl={10}>
            <Avatar src={item.key} size={'2xl'} borderColor={'#00ADB5'} borderWidth={4} objectFit={'cover'} />
          </Flex>
        ))
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={'4xl'} >
        <ModalOverlay />
        <ModalContent background={'#3A4750'} >
          <ModalCloseButton color={'#EEEEEE'} />
          <ModalBody>
            <Flex flex={1} alignItems={'start'}  flexWrap={'wrap'}   gap={6}    >
              {selectedImages.map((image, index) => (
                
                <Image  width={'20vw'} height={'100%'} objectFit={'cover'} margin={"0 auto"} position={'relative'} top={4} borderRadius={12} key={index} src={image.trim()}   />
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Facegallary;
