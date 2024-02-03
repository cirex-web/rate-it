import { useState } from "react";
import StarRatings from "react-star-ratings";

// <ReactStars
//         count={5}
//         size={24}
//         activeColor="#2c2936"
//         color="#d1d5db"
//         value={2.5}
//         isHalf
//         edit={false}
//       />
// export const Stars = ({
//   originalStars,
//   size,
//   onChange,
// }: {
//   originalStars: number;
//   size: number;
//   onChange?: (stars: number) => void;
// }) => {
//   const [stars, setStars] = useState(originalStars);
//   return (
//     <StarRatings
//       rating={stars}
//       starRatedColor="blue"
//       changeRating={(stars: number) => {
//         if (onChange) {
//           setStars(stars);
//           onChange(stars);
//         }
//       }}
//       numberOfStars={5}
//       name="rating"
//       starDimension={size}
//       isSelectable={false}
//     />
//   );
// };
