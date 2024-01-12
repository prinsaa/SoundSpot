import React, { useState } from "react";
import "../src/App.css";
import { supabase } from "./createClient";
import Nav from "../src/Nav";

const Create = () => {
  const [post, setPost] = useState({ title: "", description: "" }); //empty object
  const [submissionMessage, setSubmissionMessage] = useState(null);

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

    if (error) {
      console.error(error);
    } else {
      setSubmissionMessage("♫ Music Note posted successfully! ♫");
    }
  }

  return (
    <>
      <Nav />
      <div className="post-square">
        <div className="form-container">
          <h2 className="Title">Create a Music Note</h2>
          <form
            className="Form"
            onSubmit={async (e) => {
              e.preventDefault();
              await createPost();
            }}
          >
            <div className="post_title">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                onChange={handleChange}
              />
            </div>

            <div className="post_description">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                name="description"
                placeholder="Description (Optional)"
                onChange={handleChange}
              />
            </div>
            <button className="postBtn">CREATE NOTE</button>
            <h3 classname="submitted">{submissionMessage}</h3>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
