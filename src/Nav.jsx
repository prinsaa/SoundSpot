import { Flex, HStack } from "@chakra-ui/react";
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
      <Lin href="/" style={{ textDecoration: "none" }} fontSize="25px">
        SoundSpot
      </Lin>

      <HStack spacing="8">
        <Link to="/">Home</Link>
        <Link to="/Create">Create New Post</Link>
      </HStack>
    </Flex>
  );
};

export default Nav;
