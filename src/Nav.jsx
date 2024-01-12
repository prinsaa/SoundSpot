import { VStack, Flex, HStack, Heading } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <Flex
      backgroundColor="#242424"
      justifyContent="space-between"
      textColor="#1ed760"
      as="b"
      padding="1rem"
    >
      <Heading fontSize="30px">SoundSpot</Heading>

      <HStack spacing="8">
        <Link to="/">Home</Link>
        <Link to="/Create">Create New Post</Link>
      </HStack>
    </Flex>
  );
};

export default Nav;
