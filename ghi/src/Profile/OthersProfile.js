import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import { useParams } from "react-router-dom";
import "./profile.css";

function OthersProfile({
  posts,
  carousels,
  socials,
  user,
  userInfo,
  getSocials,
  getUser,
  getAllConnections,
  connections,
}) {
  const username = useParams();
  const { token } = useAuthContext();
  const [postsNum, setPostsNum] = useState(10);
  const [followers, setFollowers] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSocials, setLoadingSocials] = useState(true);
  const [filteredConnections, setFilteredConnections] = useState([]);

  const navigate = useNavigate();

  const handleCarouselNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carousels.length);
  };

  const handleCarouselPrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? carousels.length - 1 : prevIndex - 1
    );
  };

  const getUserStats = () => {
    if (Array.isArray(connections)) {
      const connectionsFiltered = connections.filter((connection) => {
        return connection.user_id === userInfo.user_id;
      });
      setFollowers(connectionsFiltered.length);
      setFilteredConnections(connectionsFiltered);
    }
  };

  const handleFollow = async (event) => {
    event.preventDefault();
    const connectionUrl = `${process.env.REACT_APP_USERS_SERVICE_API_HOST}/api/connections`;
    const fetchConfig = {
      method: "post",
      credentials: "include",
      body: JSON.stringify({
        user_id: userInfo.user_id,
        following_id: user.user_id,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(connectionUrl, fetchConfig);
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      setFilteredConnections([data]);
      setFollowers(followers + 1)
    }
  };

  const handleUnFollow = async (event, connection_id) => {
    event.preventDefault();
    const connectionUrl = `${process.env.REACT_APP_USERS_SERVICE_API_HOST}/api/connections/${connection_id}`;
    const fetchConfig = {
      method: "delete",
      credentials: "include",
    };
    const response = await fetch(connectionUrl, fetchConfig);
    if (response.ok) {
      setFilteredConnections([])
      setFollowers(followers - 1);
    }
  };

  const isFollowed = filteredConnections?.find((connection) => {
    return (
      connection.following_id === user.user_id &&
      connection.user_id === userInfo.user_id
    );
  });

  useEffect(() => {
    if (userInfo !== undefined || userInfo !== "") {
      setIsLoading(false);
    }
    let i = 
      performance.getEntriesByType("navigation")[0].type === "reload" ? 0 : 1;
    if (i === 1) {
      const timer = setTimeout(() => {
        if (!token) {
          navigate("/login");
        }
      }, 3750);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        if (!token) {
          navigate("/login");
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [token, navigate, userInfo]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        await getSocials();
        setLoadingSocials(false);
      } catch (error) {
        console.log("Error fetching socials: ", error);
        setLoadingSocials(false);
      }
    };
    fetchSocials();
    if (!user) {
      getUser(username.username);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userInfo) {
      getUserStats();
      getAllConnections();
    }
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getAllConnections();
  }, [filteredConnections]); // eslint-disable-line react-hooks/exhaustive-deps

  if (user !== "" && user !== null && user !== undefined) {
    if (isLoading) {
      return;
    }
    socials = socials || [];
    carousels = carousels || [];
    let filteredPosts = [];
    let filteredCarousels = [];
    let filteredSocials = [];

    if (posts.length !== 0 && Array.isArray(posts)) {
      filteredPosts = posts.filter((post) => {
        return post.username === user.username;
      });
    }

    if (carousels.length !== 0 && Array.isArray(carousels)) {
      filteredCarousels = carousels.filter((carousel) => {
        return carousel.user_id === user.user_id;
      });
    }

    if (socials.length !== 0 && Array.isArray(socials)) {
      filteredSocials = socials.filter((social) => {
        return social.user_id === user.user_id;
      });
    }

    const slicedPosts = filteredPosts.slice(0, postsNum);

    const handlePosts = () => {
      setPostsNum(postsNum + 10);
    };


    if (user !== "" && user !== null && user !== undefined) {
      return (
        <div className="container">
          <div id="profile-body" className="row mt-5">
            <div className="card mb-5">
              <div className="card inner-card m-3">
                <div
                  className="card-header  d-flex  justify-content-between  align-items-center"
                  style={{
                    backgroundImage: `url(${user.header_image})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                  }}
                >
                  <div
                    className="d-flex flex-column-reverse align-items-center"
                    style={{
                      backgroundImage: `url(${user.profile_picture})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundSize: "128px",
                      width: "128px",
                      height: "128px",
                    }}
                  ></div>
                  <>
                    {isFollowed === undefined && (
                      <button
                        className="btn btn-dark align-self-end flex-shrink-1"
                        onClick={(event) => handleFollow(event)}
                      >
                        Follow me!
                      </button>
                    )}
                    {isFollowed !== undefined && (
                      <button
                        className="btn btn-dark align-self-end flex-shrink-1"
                        onClick={(event) =>
                          handleUnFollow(event, isFollowed.id)
                        }
                      >
                        Unfollow
                      </button>
                    )}
                  </>
                </div>
                <div className="mt-3 mb-3 d-block">
                  <div className="text-center">
                    <h4 className="m-3">{user.display_name}</h4>
                    <h5>{`${user.first_name} ${user.last_name}`}</h5>
                    <h5>Followers - {followers}</h5>
                  </div>
                </div>
                <div className=" mt-3 mb-3 d-block text-center">
                  <div className="p-2">
                    <h2 className="">About Me</h2>
                    <p>{`${user.about}`}</p>
                  </div>
                </div>
                <h2 className="text-center">My Socials</h2>
                <div className="d-flex justify-content-evenly flex-wrap mx-5">
                  {loadingSocials ? (
                    <p>Loading social links...</p>
                  ) : (
                    filteredSocials.map((social) => {
                      if (
                        social.link.includes(".com") ||
                        social.link.includes(".tv") ||
                        social.link.includes(".gg") ||
                        social.link.includes(".org")
                      ) {
                        return (
                          <a
                            key={social.id}
                            href={`http://${social.link}`}
                            className="profile-link mx-3"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="position-relative">
                              {social.link}
                            </span>
                          </a>
                        );
                      } else {
                        return (
                          <>
                            <p
                              key={social.id}
                              className="mx-3 position-relative profile-link"
                              style={{
                                color: "black",
                              }}
                            >
                              {social.link}
                            </p>
                          </>
                        );
                      }
                    })
                  )}
                </div>
                <div
                  id="carousel"
                  className="carousel carousel-dark slide m-3"
                  data-bs-interval="false"
                >
                  <div className="carousel-inner">
                    {filteredCarousels.map((image, index) => {
                      if (filteredCarousels.length === 0) {
                        return (
                          <div
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                          >
                            <img
                              src="https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"
                              alt="..."
                              className="d-block w-100"
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className={`carousel-item ${
                              index === activeIndex ? "active" : ""
                            }`}
                            key={image.id}
                          >
                            <img
                              src={image.link}
                              alt="..."
                              className="d-block w-100"
                              style={{
                                maxHeight: "1080px",
                              }}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                  {filteredCarousels.length > 0 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carousel"
                        data-bs-slide="prev"
                        onClick={() => {
                          handleCarouselPrev();
                        }}
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carousel"
                        data-bs-slide="next"
                        style={{
                          top: "50px !important",
                        }}
                        onClick={() => {
                          handleCarouselNext();
                        }}
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="text-center">
                <h4 className="m-3">Activity</h4>
                {slicedPosts.map((post) => {
                  return (
                    <div className="card m-3 " key={post.id}>
                      <div className="card-header d-flex flex-column">
                        <div>
                          <img
                            src={user.profile_picture}
                            alt="user pfp"
                            className="rounded img-thumbnail"
                            style={{
                              width: "68px",
                              float: "left",
                            }}
                          />
                          <small
                            id="display-name"
                            className="position-absolute"
                            style={{
                              float: "left",
                            }}
                          >
                            <strong>{user.display_name}</strong>
                          </small>
                        </div>
                        <div>
                          <img
                            src={post.image}
                            className="rounded mb-3 mt-3 w-100"
                            alt="post pic"
                          />
                        </div>
                        <p className="mb-0">{post.text}</p>
                      </div>
                    </div>
                  );
                })}
                {filteredPosts.length > postsNum && (
                  <button
                    className="btn btn-success m-3 btn-sm"
                    onClick={handlePosts}
                  >
                    Show More
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="row"></div>
        </div>
      );
    } else {
      return (
        <div className="d-center">
          <h4
            className="alert alert-danger m-5 position-absolute top-50 start-50 translate-middle"
            style={{ width: "400px" }}
          >
            could not get user info -
            <br />
            please log in and try again
          </h4>
        </div>
      );
    }
  }
}

export default OthersProfile;
