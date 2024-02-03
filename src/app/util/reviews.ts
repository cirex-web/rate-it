import { Review } from "../types";

export const findAggregate = (ratings: Review[]) => {
  if (ratings.length === 0) return 0;
  return (
    ratings.reduce(
      (prevVal, currentReview) => prevVal + currentReview.stars,
      0
    ) / ratings.length
  );
};
