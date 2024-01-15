import {
  Text,
  Flex,
  VStack,
  Link,
  Button,
  Input,
  OrderedList,
  ListItem,
  Grid,
  HStack,
  WrapItem,
  Wrap,
  Center,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Nav from "./Nav";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./createClient";
import { Form } from "react-router-dom";

const Login = () => {
  const CLIENT_ID = "0163df7b849d41d38fc556f529f97060";
  const REDIRECT_URL = "http://localhost:5173/Login";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      console.log(token);
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    setArtists([]);
    setTopTracks([]);
    setSelectedArtist(null);
    window.localStorage.removeItem("token");
  };

  const searchArtist = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });

    console.log(data);
    setTopTracks([]); //reset the data if new search
    setSelectedArtist(null); //reset the data if new search
    setArtists(data.artists.items);
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <VStack
        key={artist.id}
        justifyContent="center"
        paddingTop="2rem"
        style={{ cursor: "pointer" }}
        onClick={() => getTopTracks(artist.id, artist.name)}
      >
        <Text fontSize="2xl" as="b">
          {artist.name}
        </Text>

        {artist.images.length ? (
          <img width={"20%"} src={artist.images[0].url} alt="" />
        ) : (
          <Text>No Image</Text>
        )}
      </VStack>
    ));
  };

  const getTopTracks = async (artistId, artistName) => {
    console.log("Clicked artist ID:", artistId);
    console.log("Clicked artist Name:", artistName);
    const { data } = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=CA`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    setTopTracks(data.tracks);
    setSelectedArtist({ id: artistId, name: artistName });
  };

  return (
    <>
      <Nav />
      <Flex justifyContent="center" paddingTop="2rem">
        {!token ? (
          <Button background="#1ed760">
            <Link
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=${RESPONSE_TYPE}`}
            >
              Login to Spotify
            </Link>
          </Button>
        ) : (
          <Button background="gray" variant="solid" onClick={logout}>
            Log Out
          </Button>
        )}
      </Flex>

      <VStack justifyContent="center" paddingTop="3rem" width="100%">
        {token ? (
          <form onSubmit={searchArtist}>
            <FormControl isRequired width="100%">
              <FormLabel>Search</FormLabel>
              <Input
                type="text"
                placeholder="Artist Name"
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <FormHelperText justifyContent="center">
                Which top tracks of an artist are you curious about? (based on
                Canada Spotify)
              </FormHelperText>

              <Button
                type="submit"
                background="#1ed760"
                mt={4}
                justifyContent="center"
              >
                Search
              </Button>
            </FormControl>
          </form>
        ) : (
          <Text justifyContent="center" width="50%">
            Login now to groove to the top tracks of an artist of YOUR CHOICE!
            Elevate your vibe in seconds – it's that simple, and that
            sensational!
          </Text>
        )}
      </VStack>

      <>
        {selectedArtist ? (
          <>
            <VStack paddingBottom="5rem">
              <Text fontSize="2xl" as="b" paddingTop="3rem" color="#242424">
                Top Tracks for {selectedArtist.name}:
              </Text>
              <Text fontSize="md" as="i" paddingBottom="2rem" color="#242424">
                Click on the song to listen and become a #1 fan 🔥
              </Text>
              <OrderedList>
                {topTracks.map((track) => (
                  <ListItem key={track.id} fontSize="xl">
                    <Link
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      _hover={{
                        background: "#1ed760",
                      }}
                    >
                      {track.name}
                    </Link>
                  </ListItem>
                ))}
              </OrderedList>
            </VStack>
          </>
        ) : (
          <>{renderArtists()}</>
        )}
      </>

      {/* {renderArtists()}

      {topTracks.length > 0 && (
        <Flex>
          <Text fontSize="xl" as="b" paddingTop="2rem">
            Top Tracks:
          </Text>
          <VStack>
            {topTracks.map((track) => (
              <li key={track.id}>{track.name}</li>
            ))}
          </VStack>
        </Flex> */}
    </>
  );
};

export default Login;

/* <VStack justifyContent="center">
  <Text>Welcome Back!</Text>
  <Text>Login to your account</Text>
  <Auth
    theme="dark"
    magicLink
    providers={["spotify"]}
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
  />
</VStack> */
