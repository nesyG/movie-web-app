import { getSearchResults } from "@/api/movies";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { Movie } from "@/lib/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MovieCard } from "@/components/core";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [resultsDescription, setResultsDescription] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // when search params are updated, page re renders and this use effect sets the new query again
  useEffect(() => {
    const searchQueryFromParams = searchParams.get("query");
    if (searchQueryFromParams) {
      setSearchQuery(searchQueryFromParams);
    }
  }, [searchParams.get("query")]);

  const fetchSearchResults = async () => {
    try {
      const res = await getSearchResults(searchQuery);
      setSearchResults(res.data.movies);
      const resultsCount = res.data.movies.length;
      setResultsDescription(
        resultsCount === 0 ? "No results found"
          : resultsCount === 1 ? "1 result found"
            : `${resultsCount} results found`
      );
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: "There was a problem fetching results."
      });
    }
  }

  useEffect(() => {
    if (searchQuery !== "") {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className="w-full h-full flex flex-row bg-[#18181a] text-white overflow-x-hidden scrollbar">
      <div className="w-full relative">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="fixed bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col py-9 px-8">
          <h1 className="font-semibold text-lg mb-6">{resultsDescription}</h1>
          <div className="flex flex-row flex-wrap gap-4 z-10">
            {
              searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};