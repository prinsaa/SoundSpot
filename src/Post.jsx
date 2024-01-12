import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "./createClient";
import "../src/Post.css";
import Nav from "../src/Nav";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Flex,
  Spacer,
  VStack,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { TriangleUpIcon } from "@chakra-ui/icons";
import { HStack, Box, Center, Text } from "@chakra-ui/react";

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(postId.title);
  const [newDescription, setNewDescription] = useState(postId.description);

  const [input, setInput] = useState("");
  const isError = input === "";
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPostById(postId) {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .single();

        if (error) {
          console.error("Error fetching post:", error.message);
        } else {
          let temp_days =
            (new Date() - new Date(data.time)) / (1000 * 60 * 60 * 24);
          let temp_hours =
            (new Date() - new Date(data.time)) / (1000 * 60 * 60);
          let temp_mins = (new Date() - new Date(data.time)) / (1000 * 60);

          if (temp_days >= 1) {
            data.time = "Posted " + Math.floor(temp_days) + " days ago";
          } else if (temp_days < 1 && temp_hours >= 1) {
            data.time = "Posted " + Math.floor(temp_hours) + " hours ago";
          } else if (temp_days < 1 && temp_hours < 1 && temp_mins >= 1) {
            data.time = "Posted " + Math.floor(temp_mins) + " mins ago";
          } else {
            data.time = "Posted 1 min ago";
          }
          getAllComments(data.id);
          setPost(data);
        }
      } catch (error) {
        console.error("Error fetching post:", error.message);
      }
    }

    if (postId) {
      fetchPostById(postId);
    }
  }, [postId, isEditing, comments]);

  async function updatePost(postId, obj) {
    const { error } = await supabase
      .from("posts")
      .update({
        id: postId,
        title: obj.title,
        description: obj.description,
      })
      .eq("id", postId);

    if (error) {
      console.log(error);
    } else {
      console.log("Post updated successfully!");
    }
  }

  async function deletePost(postId) {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        console.error(error);
      } else {
        console.log("Post deleted successfully");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleUpdate = () => {
    // Call the updatePost function with the new values
    updatePost(postId, { title: newTitle, description: newDescription });
    // Exit the edit mode after updating
    setIsEditing(false);
  };

  const submitComment = async (id) => {
    const { data, error } = await supabase.from("comments").insert({
      post_id: id,
      comment: input,
    });

    if (error) {
      console.log(error);
    } else {
      setInput("");
    }
  };

  const getAllComments = async (id) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id);

    if (error) {
      console.log(error);
    } else {
      setComments(data);
    }
  };

  const updateLikes = async (id) => {
    const { data, error } = await supabase
      .from("posts")
      .update({
        likes: post.likes + 1,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Nav />
      <Box backgroundColor="gray">
        <Center>
          <Flex display="row" width="60%" paddingTop="4rem">
            {post ? (
              <Flex
                backgroundColor="#242424"
                padding="1rem"
                justifyContent="space-evenly"
                borderRadius="1rem"
              >
                {isEditing ? (
                  <VStack width="100%">
                    <Flex
                      width="100%"
                      type="text"
                      placeholder={post.title}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="edit-input"
                    />
                    <Flex
                      placeholder={post.description}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="edit-textarea"
                      w="100%"
                      mb={4}
                    />
                    <button onClick={handleUpdate} className="update-button">
                      Save
                    </button>
                  </VStack>
                ) : (
                  <VStack width="100%">
                    <HStack
                      width="100%"
                      justifyContent="space-between"
                      padding="0.5rem"
                    >
                      <Text textColor="#808080" as="b">
                        {post.time}
                      </Text>
                      <HStack>
                        <Text textColor="#808080" as="i">
                          {post.likes}
                        </Text>
                        <TriangleUpIcon
                          color="#1ED760"
                          onClick={() => {
                            updateLikes(post.id);
                          }}
                        />
                      </HStack>
                    </HStack>
                    <Text
                      textColor="#4caf50"
                      as="b"
                      fontSize="xl"
                      paddingBottom="20px"
                    >
                      {post.title}
                    </Text>
                    <Text textColor="white">{post.description}</Text>
                    <HStack>
                      <Button
                        colorScheme="green"
                        variant="solid"
                        boxShadow="dark-lg"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        Update Post
                      </Button>
                      <Button
                        colorScheme="red"
                        variant="solid"
                        boxShadow="dark-lg"
                        size="sm"
                        onClick={() => deletePost(postId)}
                      >
                        Delete Post
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Flex>
            ) : (
              <p>Loading...</p>
            )}
            {post ? (
              <VStack justifyContent="center" padding="1rem" width="100%">
                <FormControl isInvalid={isError}>
                  <Input
                    backgroundColor="white"
                    placeholder="Write a Comment"
                    type="Comment Here"
                    value={input}
                    _placeholder={{ color: "#242424" }}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  {!isError ? (
                    <FormHelperText>
                      Writing a positive comment...
                    </FormHelperText>
                  ) : (
                    <FormErrorMessage>Comment is required.</FormErrorMessage>
                  )}
                </FormControl>{" "}
                <Button
                  color="#242424"
                  backgroundColor="#1ed760"
                  variant="solid"
                  boxShadow="dark-lg"
                  size="sm"
                  onClick={() => submitComment(post.id)}
                >
                  Post Comment
                </Button>
              </VStack>
            ) : (
              <p>Loading...</p>
            )}
            {post ? (
              comments.map((comment, key) => (
                <Flex
                  key={key}
                  background="#242424"
                  justifyContent="center"
                  borderRadius="1rem"
                  padding="1rem"
                  marginBottom="1rem"
                  textColor="white"
                >
                  {comment.comment}
                </Flex>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </Flex>
        </Center>
      </Box>
    </>
  );
};

export default Post;
