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
} from "@chakra-ui/react";
import { TriangleUpIcon } from "@chakra-ui/icons";
import { HStack } from "@chakra-ui/react";

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
    <div>
      <Nav />
      <div className="post-container">
        {post ? (
          <div className="post">
            {isEditing ? (
              <VStack className="edit-container">
                <Input
                  w="100%"
                  type="text"
                  placeholder={post.title}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="edit-input"
                />
                <Spacer></Spacer>
                <Textarea
                  placeholder={post.description}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="edit-textarea"
                  w="100%"
                  mb={4}
                ></Textarea>
                <button onClick={handleUpdate} className="update-button">
                  Save
                </button>
              </VStack>
            ) : (
              <div>
                <Flex spacing={20}>
                  <h4>{post.time}</h4>
                  <Spacer></Spacer>
                  <HStack>
                    <span>{post.likes}</span>
                    <TriangleUpIcon
                      color="#1ED760"
                      onClick={() => {
                        updateLikes(post.id);
                      }}
                    />
                  </HStack>
                </Flex>
                <h1>{post.title}</h1>
                <h4>{post.description}</h4>
                <div className="post-buttons">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="update-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deletePost(postId)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {post ? (
          <div className="post">
            <FormControl isInvalid={isError}>
              <FormLabel>Comment</FormLabel>
              <Input
                type="Comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                w="80%"
                className="edit-input"
              />
              <Spacer></Spacer>
              <Flex justify="center" align="center">
                {!isError ? (
                  <FormHelperText>
                    Entering a positive comment...
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>Comment is required.</FormErrorMessage>
                )}
              </Flex>
            </FormControl>{" "}
            <div>
              <button onClick={() => submitComment(post.id)}>Comment</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {post ? (
          comments.map((comment, key) => (
            <div className="post" key={key}>
              <span>{comment.comment}</span>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Post;
