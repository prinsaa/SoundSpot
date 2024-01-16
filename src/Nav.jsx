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
        <Lin
          href="/SoundSpot"
          style={{ textDecoration: "none" }}
          fontSize="25px"
        >
          SoundSpot
        </Lin>
      </Flex>

      <HStack spacing="8">
        <Flex _hover={{ color: "gray" }}>
          {" "}
          <Link to="/SoundSpot">Home</Link>
        </Flex>
        <Flex _hover={{ color: "gray" }}>
          <Link to="/SoundSpot/Create">Create New Post</Link>
        </Flex>
        <Flex _hover={{ color: "gray" }}>
          <Link to="/SoundSpot/Login">Spotify Stats</Link>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default Nav;
