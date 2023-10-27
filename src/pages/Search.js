import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ACCESS_KEY } from "../config";
import imgnotfound from "../images/img-notfound.jpg";
import {Container, Form, FormControl, InputGroup, Col, Row, Card} from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import { ColorButton } from "../components/Styled";

// Navigate to detail page of the plant
const Details = (navigate, id) => {
  navigate("/plant/" + id);
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // If image is not available, due to API restrictions or another error, alternate image is displayed
  const handleImageError = (altImage) => {
    altImage.src = imgnotfound; // Set the src to the alternate image
  };

  useEffect(() => {
    // Event listener for popstate event to handle browser back button
    const handlePopstate = () => {
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    // Extract the search query from the URL params
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");

    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Asynchronous function that is called when the search form is submitted.
  // It makes a GET request to the Plant API using axios, passing the query and the ACCESS_KEY as parameters.
  // If succesful, set the plant state with the received data.
  const handleSearch = async (query) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://perenual.com/api/species-list?page=1&key=${ACCESS_KEY}`,
        // Get your own access key, when registering into perenual.com
        {
          params: { q: query },
        }
      );
      console.log("Search query:", query);
      console.log("Result:", response.data.data);
      setList(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }

    const updatedSearches = [query, ...recentSearches];
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  let plantList;
  // Based on the list state, the plantList variable is populated.
  // If the list contains items, it maps through each item and renders them in a column.
  if (list !== null) {
    if (list.length > 0) {
      plantList = list.map((item) => (
        <Col key={item.id} md={4} className="pb-4 img-column">
          <Card>
            {/* If the default_image exists, it is displayed; otherwise, the imgnotfound image is shown. */}
            {item.default_image && item.default_image.regular_url ? (
              <img
                src={item.default_image && item.default_image.regular_url}
                alt={item.common_name}
                className="img-fluid"
                onError={(e) => handleImageError(e.target)}
              />
            ) : (
              <img src={imgnotfound} alt="Not Found" className="img-fluid" />
            )}
            <div className="card-body">
              <h4 className="card-title">{item.common_name}</h4>
              <p className="card-text" style={{ fontStyle: "italic" }}>
                {item.scientific_name}
              </p>
              <ColorButton onClick={() => Details(navigate, item.id)}>
                Details
              </ColorButton>
            </div>
          </Card>
        </Col>
      ));
    } else {
      // Message will be displayed if the list is empty.
      plantList = <p>No plants found.</p>;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
    // Update the browser URL with the search query
    navigate(`?q=${query}`);
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center flex-column container-fluid custom-container form">
        <h1>Search plant</h1>
        <p className="lead" style={{ maxWidth: "500px" }}>
          This React app is using{" "}
          <a
            href="https://perenual.com/docs/api"
            target="_blank"
            rel="noreferrer"
            className="link-light"
          >
            Perenual API
          </a>{" "}
          to get data from different plant species.
          App is using free version of this API, so not all data is available.
        </p>
        <Form
          onSubmit={handleSubmit}
          className="d-flex justify-content-center align-items-center w-75"
        >
          <InputGroup style={{ maxWidth: "500px" }}>
            <span className="input-group-text" id="addon-wrapping">
              <SearchIcon />
            </span>
            <FormControl
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <ColorButton variant="contained" type="submit">
              Search
            </ColorButton>
          </InputGroup>
        </Form>
      </Container>
      <Container className="d-flex justify-content-center align-items-center flex-column plant-container">
        {isLoading ? (
          <span className="loader" style={{marginTop: '50px'}}></span>
        ) : (
          <Row className="mt-5 plants">{plantList}</Row>
        )}
      </Container>
    </>
  );
};

export default Search;
