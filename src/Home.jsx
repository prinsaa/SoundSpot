import React, { useState, useEffect } from "react";
import { supabase } from "./createClient";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import "./App.css";
import { Box, Flex, Input, VStack } from "@chakra-ui/react";
import { TriangleUpIcon } from "@chakra-ui/icons";
import { HStack, Center, Button, Text } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");

  const [postChange, setPostChange] = useState({
    id: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchPosts();
  }, [filter, search]);

  async function fetchPosts() {
    let { data } = await supabase.from("posts").select("*");
    data = data.filter((d) =>
      d.title.toLowerCase().startsWith(search.toLowerCase())
    );
    if (filter) {
      setPosts(data.sort((a, b) => b.likes - a.likes));
    }
    // Newest
    else {
      setPosts(data.sort((a, b) => new Date(b.time) - new Date(a.time)));
    }
  }

  async function displayPost(postId) {
    posts.map((post) => {
      if (post.id == postId) {
        setPostChange({
          id: postId.id,
          title: postId.title,
          description: postId.description,
        });
      }
    });
  }

  const date_converter = (post_date) => {
    let temp_days = (new Date() - new Date(post_date)) / (1000 * 60 * 60 * 24);
    let temp_hours = (new Date() - new Date(post_date)) / (1000 * 60 * 60);
    let temp_mins = (new Date() - new Date(post_date)) / (1000 * 60);

    if (temp_days >= 1) {
      post_date = "Posted " + Math.floor(temp_days) + " days ago";
    } else if (temp_days < 1 && temp_hours >= 1) {
      post_date = "Posted " + Math.floor(temp_hours) + " hours ago";
    } else if (temp_days < 1 && temp_hours < 1 && temp_mins >= 1) {
      post_date = "Posted " + Math.floor(temp_mins) + " mins ago";
    } else {
      post_date = "Posted 1 min ago";
    }
    return post_date;
  };

  return (
    <>
      <Nav />
      <Box backgroundColor="grey">
        <Center>
          <Flex
            display="row"
            width="60%"
            justifyContent="center"
            alignItems="center"
          >
            <Flex padding="1rem" justifyContent="space-evenly">
              <HStack>
                <Button
                  color="#4caf50"
                  variant="solid"
                  backgroundColor="#242424"
                  onClick={() => setFilter(false)}
                  boxShadow="dark-lg"
                >
                  Newest
                </Button>
                <Button
                  color="#4caf50"
                  backgroundColor="#242424"
                  borderColor="invisible"
                  onClick={() => setFilter(true)}
                  boxShadow="dark-lg"
                >
                  Most Popular
                </Button>
              </HStack>
              <Input
                placeholder="Search"
                variant="filled"
                width="50%"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Flex>
            {posts.map((post) => (
              <VStack width="100%">
                <ChakraLink
                  as={Link}
                  to={`/SoundSpot/post/${post.id}`}
                  key={post.id}
                  textDecoration="none"
                  width="100%"
                  margin="1rem"
                >
                  <Center
                    width="100%"
                    backgroundColor="#242424"
                    padding="1rem"
                    borderRadius="1rem"
                    boxShadow="dark-lg"
                    _hover={{
                      backgroundColor: "#444f44",
                    }}
                  >
                    <VStack width="100%">
                      <Flex
                        width="100%"
                        justifyContent="space-between"
                        padding="0.5rem"
                      >
                        <Text color="#808080" as="b">
                          {date_converter(post.time)}
                        </Text>
                        <HStack>
                          <Text color="#808080" as="i">
                            {post.likes}
                          </Text>
                          <TriangleUpIcon color="#1ED760" />
                        </HStack>
                      </Flex>
                      <Text color="#4caf50">{post.title}</Text>
                    </VStack>
                  </Center>
                </ChakraLink>
              </VStack>
            ))}
          </Flex>
        </Center>
      </Box>
    </>
  );
};

export default Home;
