import React from "react";
import { useContext } from "react";
import UpvoteContext from "../Contexts/UpvoteContext";
import SchoolsList from "../Components/SchoolsList";
import "../PagesCSS/Recommended/Recommended.css";
import { Link } from "react-router-dom";

// import pic from "../PagesCSS/Favourites/heart.png";

function Recommended() {
  const upvoteCtx = useContext(UpvoteContext);
  // gives us the current context

  let content;

//   if (favouritesCtx.totalFavourites === 0) {
//     content = (
//       <div className="fav-empty">
//         <img src={pic} alt="Heart" className="fav-img" />
//         <h2 className="fav-empty-heading">No favourites yet!</h2>
//         <p className="fav-empty-text">
//           See a school you like?
//           <br></br>
//           Save them to your favourites page now!
//         </p>
//         <Link to="/schools">
//           <button className="fav-button">Start exploring</button>
//         </Link>
//       </div>
//     );
//   } else {
    content = (
      <div>
        <SchoolsList schools={upvoteCtx.upvotes} />
      </div>
    );
//   }

  return (
    <section>
      <div className="rec-header">
        <h1 className="rec-title">
          Schools Recommended 
        </h1>
      </div>
      {content}
    </section>
  );
}

export default Recommended;
