import React, { useEffect, useState } from 'react';
import { Flex, useDisclosure, Button, Image, Avatar, Stack } from '@chakra-ui/react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react'
function Facegallary() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [keys, setKeys] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/dash/keys');
        setKeys(response.data);
      } catch (error) {
        console.log(error);
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
        const altIndex = trimmedURL.indexOf(".jpg");
        const capitalAltIndex = trimmedURL.indexOf(".JPG");
        const firebaseIndex = trimmedURL.indexOf("https://kkhsobiinyhntegdenee.supabase.co/");
        const startIndex = firebaseIndex !== -1 ? firebaseIndex : 0;
        let modifiedURL = altIndex !== -1 ? trimmedURL.substring(startIndex, altIndex + 4) : trimmedURL.substring(startIndex); // Increase index by 4 to include .jpg
        if (capitalAltIndex !== -1) {
            modifiedURL = trimmedURL.substring(startIndex, capitalAltIndex + 4); // Include .JPG
        }
        // Remove %22 after .jpg or .JPG at the end of the URL
        modifiedURL = modifiedURL.replace(/\.jpg%22$/, ".jpg").replace(/\.JPG%22$/, ".JPG"); // Remove %22 if it comes after .jpg or .JPG
        return modifiedURL;
      })
      .map(url => url.replace("http://localhost:5174/dash/%22", ""));
    setSelectedImages(imageURLs);
    onOpen();
};


  return (
    <Flex justifyContent="center" gap={10} alignItems="center" flexWrap={'wrap'} pt={8}>
      {keys.map((item, index) => (
        <Flex key={index} cursor="pointer" onClick={() => handleAvatarClick(item.values)} pl={10}>
        <Avatar src={item.key} size={'2xl'} borderColor={'#00ADB5'} borderWidth={4} objectFit={'cover'} />
        </Flex>
      ))}
      <Modal isOpen={isOpen} onClose={onClose} size={'4xl'}   >
  <ModalOverlay />
  <ModalContent background={'#3A4750'} >
    <ModalCloseButton color={'#EEEEEE'} />
    <ModalBody>
      <Flex flexWrap="wrap" gap={10} flexShrink={1} >
        {selectedImages.map((image, index) => (
          <Image margin={"0 auto"} position={'relative'} top={4}   borderRadius={12} key={index} src={image.trim()} w={'18vw'}    />
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
