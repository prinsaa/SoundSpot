import { Flex, HStack, background, color } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { Link as Lin } from "@chakra-ui/react";

const Nav = () => {
  return (
    <Flex
      backgroundColor="#242424"
      justifyContent="space-between"
      textColor="#1ed760"
      as="b"
      padding="1rem"
    >
      <Flex _hover={{ color: "gray" }}>
        <Lin href="/" style={{ textDecoration: "none" }} fontSize="25px">
          SoundSpot
        </Lin>
      </Flex>

      <HStack spacing="8">
        <Flex _hover={{ color: "gray" }}>
          {" "}
          <Link to="/">Home</Link>
        </Flex>
        <Flex _hover={{ color: "gray" }}>
          <Link to="/Create">Create New Post</Link>
        </Flex>
        <Flex _hover={{ color: "gray" }}>
          <Link to="/Login">Spotify Stats</Link>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default Nav;
