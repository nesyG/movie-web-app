import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import { getMovieById } from "@/api/movies";
import { addReview, editReview, deleteReview } from "@/api/review";
import { useAuth } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";

jest.mock("@/api/movies");
jest.mock("@/api/review");
jest.mock("@/hooks");
jest.mock("@/components/ui/use-toast");

const mockGetMovieById = getMovieById as jest.Mock;
const mockAddReview = addReview as jest.Mock;
const mockDeleteReview = deleteReview as jest.Mock;
const mockEditReview = editReview as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe("MovieDetails Component", () => {
  const toast = jest.fn();

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast });
    mockUseAuth.mockReturnValue({
      authInfo: {
        user: {
          id: "1",
          firstName: "Abdullah",
          lastName: "Umer",
          email: "abd@gmail.com",
        },
        token: "eyJhbGciOiJIUzI1NiJ9eyJpZCI6MX0JAWUkAU2mWhxcd6MS8r9pd44yBIfkEBmpr3WLeqIccM",
      },
      isLoggedIn: true,
      loadingAuth: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the MovieDetails component and fetches movie details", async () => {
    mockGetMovieById.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        },
        rank: 1,
        reviews: [],
      },
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    expect(screen.getByTestId(/movie-title-heading/i)).toBeInTheDocument();
    expect(screen.getByText(/2010/i)).toBeInTheDocument();
    expect(screen.getByText(/Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality./i)).toBeInTheDocument();
    expect(screen.getByTestId(/rank-span/i)).toHaveTextContent("1");
  });

  test("handles adding a review", async () => {
    mockGetMovieById.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        },
        rank: 1,
        reviews: [],
      },
    });

    mockAddReview.mockResolvedValue({
      error: false,
      message: "Review successfully added",
      data: {
        review: {
          userId: "1",
          movieId: "1",
          comment: "Great movie!",
          rating: 4,
        },
      },
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByPlaceholderText(/Share your thoughts here/i), {
      target: { value: "Great movie!" },
    });

    fireEvent.click(screen.getByTestId(/add-review-button/i));

    await waitFor(() => {
      expect(mockAddReview).toHaveBeenCalledWith({
        movieId: "1",
        rating: 4,
        comment: "Great movie!",
      });
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "default",
      title: "Success",
      description: "Review successfully added",
    });
  });

  test("handles editing a review", async () => {
    mockGetMovieById.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        },
        rank: 1,
        reviews: [
          {
            movieId: "1",
            userId: "1",
            comment: "Great movie!",
            createdAt: "2024-05-20T14:42:15.850Z",
            edited: false,
            rating: 4,
            user: {
              email: "abd@gmail.com",
              firstName: "Abdullah",
              lastName: "Umer",
              id: "1",
            }
          },
        ],
      },
    });

    mockEditReview.mockResolvedValue({
      error: false,
      message: "Review successfully updated",
      data: {
        review: {
          userId: "1",
          movieId: "1",
          comment: "Updated review!!",
          rating: 4,
        },
      },
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId(/edit-review-button/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(/edit-review-button/i));

    fireEvent.change(screen.getByPlaceholderText(/Share your thoughts here/i), {
      target: { value: "Updated review!!" },
    });

    fireEvent.click(screen.getByTestId(/save-review-button/i));

    await waitFor(() => {
      expect(mockEditReview).toHaveBeenCalledWith({
        movieId: "1",
        rating: 4,
        comment: "Updated review!!",
      });
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "default",
      title: "Success",
      description: "Review successfully updated",
    });
  });

  test("handles deleting a review", async () => {
    mockGetMovieById.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        },
        rank: 1,
        reviews: [
          {
            movieId: "1",
            userId: "1",
            comment: "Great movie!",
            createdAt: "2024-05-20T14:42:15.850Z",
            edited: false,
            rating: 4,
            user: {
              email: "abd@gmail.com",
              firstName: "Abdullah",
              lastName: "Umer",
              id: "1",
            }
          },
        ],
      },
    });

    mockDeleteReview.mockResolvedValue({
      error: false,
      message: "Review successfully deleted",
      data: {
        count: 1,
      },
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId(/delete-review-button/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(/delete-review-button/i));

    await waitFor(() => {
      expect(mockDeleteReview).toHaveBeenCalledWith("1");
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "default",
      title: "Success",
      description: "Review successfully deleted",
    });
  });

  test("handles errors during fetching movie details", async () => {
    mockGetMovieById.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Movie does not exist",
        }
      }
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "Movie does not exist",
    });
  });

  test("handles errors during adding a review", async () => {
    mockGetMovieById.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        },
        rank: 1,
        reviews: [],
      },
    });

    mockAddReview.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Movie does not exist",
        }
      },
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByPlaceholderText(/Share your thoughts here/i), {
      target: { value: "Great movie!" },
    });

    fireEvent.click(screen.getByTestId(/add-review-button/i));

    await waitFor(() => {
      expect(mockAddReview).toHaveBeenCalled();
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "Movie does not exist",
    });
  });

  test("handles errors during editing a review", async () => {
    mockGetMovieById.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        },
        rank: 1,
        reviews: [
          {
            movieId: "1",
            userId: "1",
            comment: "Great movie!",
            createdAt: "2024-05-20T14:42:15.850Z",
            edited: false,
            rating: 4,
            user: {
              email: "abd@gmail.com",
              firstName: "Abdullah",
              lastName: "Umer",
              id: "1",
            }
          },
        ],
      },
    });

    mockEditReview.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Review does not exist",
        }
      },
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId(/edit-review-button/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(/edit-review-button/i));

    fireEvent.change(screen.getByPlaceholderText(/Share your thoughts here/i), {
      target: { value: "Updated review!" },
    });

    fireEvent.click(screen.getByTestId(/save-review-button/i));

    await waitFor(() => {
      expect(mockEditReview).toHaveBeenCalled();
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "Review does not exist",
    });
  });

  test("handles errors during deleting a review", async () => {
    mockGetMovieById.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          title: "Inception",
          description: "Directed by Christopher Nolan, 'Inception' is a mind-bending heist film set in a world where technology exists to enter the human mind through dreams. Dom Cobb, a skilled thief, is tasked with the seemingly impossible mission of planting an idea into the mind of a CEO. As he delves deeper into the layers of the subconscious, Cobb must confront his own demons and question the nature of reality.",
          releaseYear: 2010,
          durationHours: 2,
          durationMinutes: 28,
          reviewCount: 1,
          posterUrl: "https://picsum.photos/seed/Inception/500/750",
          trailerUrl: "https://www.youtube.com/embed/ycoY201RTRo"
        },
        rank: 1,
        reviews: [
          {
            movieId: "1",
            userId: "1",
            comment: "Great movie!",
            createdAt: "2024-05-20T14:42:15.850Z",
            edited: false,
            rating: 4,
            user: {
              email: "abd@gmail.com",
              firstName: "Abdullah",
              lastName: "Umer",
              id: "1",
            }
          },
        ],
      },
    });

    mockDeleteReview.mockRejectedValue({
      response: {
        data: {
          error: true,
          message: "Review does not exist",
        }
      },
    });

    render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId(/delete-review-button/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(/delete-review-button/i));

    await waitFor(() => {
      expect(mockDeleteReview).toHaveBeenCalledWith("1");
    });

    expect(toast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "An error occured",
      description: "Review does not exist",
    });
  });
});