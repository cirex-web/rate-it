import { useRef, useState } from "react";
import { Modal } from "../Modal";
import css from "./AllReviewsModal.module.css";
import { LocationData, Review } from "../types";
import ReactStars from "react-rating-stars-component";
import { findAggregate } from "../util/reviews";

const ReviewTile = ({ review }: { review: Review }) => {
  return (
    <div className={css.tile}>
      <div>
        <h2>
          {review.title}
          <span style={{ fontSize: "16px", fontWeight: "600" }}>
            {" "}
            - {review.name}
          </span>
        </h2>
      </div>
      <div style={{ height: "14px" }}>
        <ReactStars
          count={5}
          size={16}
          activeColor="#2c2936"
          color="#b6b6b6"
          value={review.stars}
          isHalf
          edit={false}
        />
      </div>

      <p className={css.reviewText}>{review.text}</p>
    </div>
  );
};
export const AllReviewModal = ({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => unknown;
  data: LocationData;
}) => {
  const stars = findAggregate(Object.values(data.ratings ?? {}));
  return (
    <Modal open={open} onClose={onClose}>
      <div className={css.container}>
        <h1>{data.name}</h1>
        <h2 className={css.stars}>
          {stars.toFixed(1)}{" "}
          <div style={{ height: "34px" }}>
            <ReactStars
              count={5}
              size={24}
              activeColor="#2c2936"
              color="#d1d5db"
              value={stars}
              isHalf
              edit={false}
            />
          </div>
        </h2>
        <div className={css.ratings}>
          {data.ratings ? (
            Object.entries(data.ratings).map(([id, review]) => (
              <ReviewTile review={review} key={id} />
            ))
          ) : (
            <h3>No reviews yet!</h3>
          )}
        </div>
      </div>
    </Modal>
  );
};
