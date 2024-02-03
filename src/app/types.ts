export interface Review {
  text: string;
  title: string;
  stars: number;
  time: number;
  seniority: number;
  reputation: number; // At the time of the review
  name: string;
}
export interface LocationData {
  name: string;
  description: string;
  ratings?: {
    [userId: string]: Review;
  };
}
export interface AllLocations {
  [locationId: string]: LocationData;
}
export interface ReviewInfo {
  title: string;
  review: string;
  stars: number;
  seniority: number;
  reputation: number;
  locationId: string;
}
