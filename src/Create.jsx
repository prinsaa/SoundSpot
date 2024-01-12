import React, { useState } from "react";
import "../src/App.css";
import { supabase } from "./createClient";
import Nav from "../src/Nav";
import {
  Box,
  Flex,
  Text,
  Input,
  VStack,
  Center,
  FormControl,
  Button,
  FormLabel,
} from "@chakra-ui/react";

const Create = () => {
  const [post, setPost] = useState({ title: "", description: "" }); //empty object
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const resetForm = () => {
    setPost({ title: "", description: "" });
  };

  function handleChange(e) {
    setPost((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.name]: e.target.value,
      };
    });
  }

  async function createPost() {
    const { data, error } = await supabase.from("posts").insert({
      title: post.title,
      description: post.description,
      time: new Date(),
      likes: 0,
    });

    console.log("Creating post:", post.title);

    if (error) {
      console.error(error);
    } else {
      setSubmissionMessage("♫ Music Note posted successfully! ♫");
      setShowMessage(true);

      setTimeout(() => {
        setSubmissionMessage("");
        setShowMessage(false);
      }, 3000);
    }
  }

  return (
    <>
      <Nav />
      <Box backgroundColor="grey">
        <Center>
          <Flex
            width="100%"
            justifyContent="center"
            paddingTop="5rem"
            paddingBottom="5rem"
          >
            <VStack
              width="40%"
              background="white"
              padding="1rem"
              borderRadius="1rem"
            >
              <Text color="#1ed760" as="b" fontSize="xl">
                Create a Music Note
              </Text>
              <FormControl
                justifyContent="center"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await createPost();
                }}
              >
                <FormLabel color="black" as="b" htmlFor="title">
                  Title*
                </FormLabel>
                <Input
                  color="black"
                  width="100%"
                  marginBottom="2rem"
                  isRequired
                  name="title"
                  placeholder="Title"
                  onChange={handleChange}
                  value={post.title}
                />
                <FormLabel color="black" as="b" htmlFor="description">
                  Description
                </FormLabel>
                <Input
                  color="black"
                  width="100%"
                  type="text"
                  name="description"
                  placeholder="Description (Optional)"
                  onChange={handleChange}
                  style={{ height: "150px" }}
                  value={post.description}
                />
                <Flex justifyContent="center" paddingTop="1rem">
                  <Button
                    color="#242424"
                    backgroundColor="#1ed760"
                    variant="solid"
                    boxShadow="dark-lg"
                    size="md"
                    type="submit"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (post.title.trim() !== "") {
                        await createPost();
                        resetForm();
                      } else {
                        setSubmissionMessage(
                          "Ensure title is not empty and please try again."
                        );
                        console.error("Title cannot be empty");
                      }
                    }}
                  >
                    POST NOTE
                  </Button>
                </Flex>
              </FormControl>
              <Text>{submissionMessage}</Text>
            </VStack>
          </Flex>
        </Center>
      </Box>
    </>
  );
};

export default Create;
