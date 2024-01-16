import dotenv from "dotenv";

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
  const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;
  const REDIRECT_URL = "https://prinsaa.github.io/SoundSpot/Login";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-top-read";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  //for tracks
  const [userTopTen, setUserTopTen] = useState([]);
  const [userWantsTopTen, setuserWantsTopTen] = useState(false);
  //for artists
  const [userTopTenArt, setUserTopTenArt] = useState([]);
  const [userWantsTopTenArt, setuserWantsTopTenArt] = useState(false);

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
    setuserWantsTopTen(false);
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

  const getTopTenTracks = async (e) => {
    e.preventDefault();

    const timeRange = "medium_term";
    const { data } = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(data);
    setUserTopTen(data.items);

    // setUserTopTen((prevUserTopTen) => {
    //   console.log("userTopTen", prevUserTopTen);
    //   return prevUserTopTen; // Return the updated state
    // });

    setuserWantsTopTen(true);
  };

  const getTopTenArtists = async (e) => {
    e.preventDefault();

    const timeRange = "medium_term";
    const { data } = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(data);
    setUserTopTenArt(data.items);
    setuserWantsTopTenArt(true);
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
      <Flex justifyContent="center" paddingTop="8rem" background="#242424">
        {!token ? (
          <Button background="#1ed760">
            <Link
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(
                SCOPE
              )}`}
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
      <VStack
        justifyContent="center"
        background="#242424"
        paddingTop="3rem"
        width="100%"
      >
        {token ? (
          <>
            <form onSubmit={searchArtist}>
              <FormControl isRequired width="100%" color="white">
                <FormLabel>Search</FormLabel>
                <Input
                  type="text"
                  placeholder="Artist Name"
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <FormHelperText justifyContent="center" color="white">
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

            <Text paddingTop="5rem" color="white" fontSize="lg">
              You don't have to wait until December for Spotify Wrap, get your
              Top 10 immediately!😎
            </Text>

            <Text color="white" as="i">
              Click on any to take your enthusiasm to the next level!
            </Text>

            <HStack width="100%">
              <VStack
                justifyContent="center"
                padding="3rem"
                width="100%"
                align="flex-end"
              >
                <Button
                  background="#1ed760"
                  onClick={getTopTenTracks}
                  disabled={setuserWantsTopTen}
                >
                  Get My Top 10 Tracks
                </Button>

                <OrderedList width="65%" color="white">
                  {userWantsTopTen &&
                    userTopTen.map((track) => (
                      <ListItem
                        key={track.id}
                        fontSize="xl"
                        justifyContent="center"
                        // padding="10px"
                      >
                        <Link
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          _hover={{
                            background: "#1ed760",
                            textColor: "black",
                          }}
                        >
                          {track.name} by {track.artists[0].name}
                        </Link>
                      </ListItem>
                    ))}
                </OrderedList>
              </VStack>

              <VStack
                justifyContent="center"
                padding="3rem"
                width="100%"
                align="flex-start"
              >
                <Button
                  background="#1ed760"
                  onClick={getTopTenArtists}
                  disabled={setuserWantsTopTenArt}
                >
                  Get My Top 10 Artists
                </Button>

                <OrderedList width="65%" color="white" as="b">
                  {userWantsTopTenArt &&
                    userTopTenArt.map((art) => (
                      <ListItem
                        key={art.id}
                        fontSize="xl"
                        justifyContent="center"
                        padding="1.52px"
                      >
                        <Link
                          href={art.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          _hover={{
                            background: "#1ed760",
                            textColor: "black",
                          }}
                        >
                          {art.name}
                        </Link>
                      </ListItem>
                    ))}
                </OrderedList>
              </VStack>
            </HStack>
          </>
        ) : (
          <Text justifyContent="center" width="40%" color="white">
            Login now to groove to the
            <span style={{ color: "#1ed760" }}> top tracks</span> of an artist
            of YOUR CHOICE! Elevate your vibe in seconds – it's that simple. Did
            I mention you can get{" "}
            <span style={{ color: "#1ed760" }}>your TOP 10</span> artists/tracks
            instantly? No need to wait until December 😉
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
      {/* <VStack justifyContent="center" padding="2rem">
        <Button onClick={getTopTenTracks} disabled={setuserWantsTopTen}>
          Get My Top 10 Tracks
        </Button>

        <OrderedList>
          {userWantsTopTen &&
            userTopTen.map((track) => (
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
      </VStack> */}
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
