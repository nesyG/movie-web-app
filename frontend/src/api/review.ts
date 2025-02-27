import { ReviewPayload } from "@/lib/types";
import { apiClient } from "./client";

export const addReview = async (data: ReviewPayload) => {
	const res = await apiClient.post("/api/review", data);
	return res.data;
};

export const editReview = async (data: ReviewPayload) => {
	const res = await apiClient.put("/api/review", data);
	return res.data;
};

export const deleteReview = async (movieId: string) => {
	const res = await apiClient.delete(`/api/review/${movieId}`);
	return res.data;
};
