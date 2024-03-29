import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import "./Movie.css";

export default function Movie() {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(true);
    useEffect(() => {
        if (localStorage.getItem("access_token") === null) {
            setIsAuth(false)
        } else {
            (async () => {
                const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + "/api/profile/", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (data) {
                    if (!data.is_email_verified) {
                        navigate("/signup");
                    }
                } else {
                    navigate("/login");
                }
            })();
        }
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFav, setIsFav] = useState(false);
    const { movieId } = useParams();
    const [movieData, setMovieData] = useState({
        name: '',
        image: '',
        description: '',
        rating: 0,
        release_date: '',
        content_rating: "",
        trailer: '',
        duration: '',
        tags: '',
        language: '',
        platform: '',
        genre: ""
    });
    const [reviewData, setReviewData] = useState([]);
    const [errors, setErrors] = useState({});
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewRating, setReviewRating] = useState(null);
    const [reviewBody, setReviewBody] = useState('');
    const [recomendations, setRecomendations] = useState([]);
    const loaderRef = useRef(null);




    useEffect(() => {
        (async () => {
            const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + '/api/movie/' + movieId + '/');
            setMovieData(data);
        })();
    }, [movieId]);


    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + '/api/favourites/');
                if (data) {
                    if (data.fav.includes(movieId)) setIsFav(true);
                    else setIsFav(false)
                }
            } catch (e) {
                console.log(e)
            }
        })();
    }, [movieId]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + '/api/recomendations/', {
                params: {
                    movie: movieId,
                }
            });
            if (data) {
                setRecomendations(data['results']);
                console.log(data['results']);
            }
        })();
    }, [movieId]);

    const toogleFav = async () => {
        const request = await axios.get(process.env.REACT_APP_BASE_BACKEND + '/api/favourites/', {
            params: {
                id: movieId
            }
        });
        if (request.data) {
            setIsFav(request.data.fav);
            setErrors({});
        } else setErrors(request.response.data);
    }

    const submitReview = async () => {
        if (reviewRating < 0 || reviewRating > 10) {
            setErrors({ 'rating': 'rating value must be out of 10' });
            return;
        }
        const request = await axios.post(process.env.REACT_APP_BASE_BACKEND + '/api/reviews/', {
            movie: movieId,
            body: reviewBody,
            title: reviewTitle,
            rating: reviewRating,
        });
        if (request.data) {
            setReviewBody('');
            setReviewRating(null);
            setReviewTitle('');
            setCurrentPage(1);
            setReviewData([]);
            setErrors({});
        } else setErrors(request.response.data);
    }
    const fetchData = async () => {
        const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + '/api/reviews/', {
            params: {
                page: currentPage,
                movie: movieId,
            }
        });
        if (data) {
            setReviewData((prevReviews) => [...prevReviews, ...data['results']]);
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }

    // check if user scrolled till end
    // if yes then fetchData()
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                fetchData();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [fetchData, movieId]);

    return (
        <>
            <div className="movie-container-descriptive">
                <img src={movieData.image.slice(0, -4) + 'QL168_UY631_CR12,0,427,631_.jpg'} alt={movieData.name} className="movie-poster" />
                <div className="movie-info">
                    <div className="movie-header">
                        <h1>{movieData.name}</h1>
                        <p className="date">{movieData.release_date}</p>
                    </div>
                    <button className="toogle-fav" onClick={toogleFav}>{isFav ? "Remove from fav" : "Add to fav"}</button>
                    <p className="rating">Rating: {movieData.rating}</p>
                    <p className="content-rating">Content Rating: {movieData.content_rating}</p>
                    <p className="duration">Duration: {movieData.duration}</p>


                    <p class="summary">{movieData.description}</p>
                    <Link to={movieData.trailer} target="_blank" className="trailer" rel="noreferrer">
                        Watch Trailer
                    </Link>
                    <p>
                        <ul className="tabs">
                            Genre:&nbsp;
                            {movieData.genre.slice(0, -1).split(",").map((g) => (
                                <li key={g}>{g}</li>
                            ))}
                        </ul>
                        <ul className="tabs">
                            Available in: &nbsp;
                            {movieData.language.slice(0, -1).split(",").map((tag) => (
                                <li key={tag}> {tag}</li>
                            ))}
                        </ul>
                        <ul className="tabs">
                            Available on: &nbsp;
                            {movieData.platform.slice(0, -1).split(",").map((tag) => (
                                <li key={tag}> {tag}</li>
                            ))}
                        </ul>
                        <ul className="tabs">
                            Tags:&nbsp;
                            {movieData.tags.split(",").map((tag) => (
                                <li key={tag}>{tag}</li>
                            ))}
                        </ul>
                    </p>
                </div>
            </div>
            {recomendations.length > 0 && (
                <><h2>You might also like...</h2>
                    <div class="recomendation-container">
                        {recomendations.map((movie) => (
                            <div className="movie-item">
                                <Link to={'/movie/' + movie.id}>
                                    <img src={movie.image.slice(0, -3) + 'QL112_UY421_CR12,0,285,421_.jpg'} alt={movie.name} />
                                    <div className="movie-info">
                                        <h3>{movie.name}</h3>
                                        <div className='rating'>Rating: {movie.rating}</div>
                                        <div>Release Date: {movie.release_date}</div>
                                        <div>Content Rating: {movie.content_rating}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div></>
            )}
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <div class="review-container">
                <div className="add-review">
                    <h2>Add Review</h2>
                    <input type="text" placeholder="Enter title" className="review-title" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} />
                    &nbsp;&nbsp;&nbsp;<label for="rating">Rate the movie out of 10:</label><input type="number" id="rating" className="review-rating" max="9" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} />
                    <textarea placeholder="Share your thoughts on this movie..." className="review-body" rows="7" value={reviewBody} onChange={(e) => setReviewBody(e.target.value)}></textarea>
                    <button className="submit-review" onClick={submitReview}>Submit Review</button>
                </div>
                <hr />
                <h2>Reviews</h2>
                <ul className="reviews-list">
                    {reviewData.map((review) => (
                        <li key={review.id} className="review">
                            <h3>{review.title}</h3>
                            <p>By <b>@{review.user ? review.user : "IMDB User"}</b></p>
                            <p className="rating">Rating: {review.rating}</p>
                            <p className="date">{review.date}</p>
                            <p>{review.body}</p>
                        </li>
                    ))}
                    <div ref={loaderRef}></div>
                </ul>
            </div>
        </>

    );
};