import { useRef, useState } from "react";
import { Modal } from "../Modal";
import css from "./ReviewModal.module.css";
import ReactStars from "react-rating-stars-component";
import { Review, ReviewInfo } from "../types";

export const ReviewModal = ({
  open,
  onClose,
  writeReview,
  locationId,
  locationName,
  originalReview,
  deleteReview,
}: {
  open: boolean;
  onClose: () => unknown;
  writeReview: (review: ReviewInfo) => Promise<void>;
  deleteReview: (locationId: string) => Promise<void>;
  locationId: string;
  locationName: string;
  originalReview: Review | undefined;
}) => {
  const [title, setTitle] = useState<string>(originalReview?.title ?? "");
  const [review, setReview] = useState<string>(originalReview?.text ?? "");
  const [starValue, setStarValue] = useState(originalReview?.stars ?? 0);
  const reviewRef = useRef<HTMLTextAreaElement>(null);
  const previousReview = !!originalReview;
  const addReview = () => {
    if (title.trim().length === 0) alert("Please enter a title");
    else if (review.trim().length === 0) alert("Please enter a review");
    else if (starValue === 0) alert("0 Stars? Really? lol");
    else {
      writeReview({
        stars: starValue,
        seniority: 1,
        reputation: 1,
        review: review.trim(),
        title: title.trim(),
        locationId,
      })
        .then(onClose)
        .catch(alert);
    }
  };
  return (
    <Modal open={open} onClose={onClose} width="600px">
      <h1>Add a review for {locationName}</h1>
      <div
        className={css.container}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target !== reviewRef.current) addReview();
        }}
      >
        <h3>Title</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)}></input>
        <h3>Rating</h3>
        <div style={{ height: "40px" }}>
          <ReactStars
            count={5}
            size={24}
            activeColor="#2c2936"
            color="#d1d5db"
            value={starValue}
            isHalf
            onChange={setStarValue}
          />
        </div>

        <h3>Review</h3>
        <textarea
          style={{ height: "100px" }}
          onChange={(e) => setReview(e.target.value)}
          ref={reviewRef}
          value={review}
        />
      </div>

      <div className={css.buttonRow}>
        {previousReview && (
          <button
            onClick={() => deleteReview(locationId).catch(alert).then(onClose)}
          >
            Delete Review
          </button>
        )}
        <button onClick={addReview}>
          {previousReview ? "Update" : "Add"} review
        </button>
      </div>
    </Modal>
  );
};
