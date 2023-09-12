import { useEffect, useRef, useState } from "react";
import "./Card.css";
import parse from "html-react-parser";

function Card({ card, handleChoice, flipped }) {
  const cardRef = useRef(null);

  const handleClick = () => {
    handleChoice(card);

    setTimeout(() => {
      cardRef.current.focus();
    }, 0);
  };

  return (
    <li className="card">
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        <div className="back">
          <button
            aria-label={`back of card ${card.cardNumber}`}
            className="card-button"
            onClick={handleClick}
          ></button>
        </div>
        <div
          ref={cardRef}
          role="group"
          aria-labelledby={card.id}
          tabIndex="-1"
          className={`front ${card.match ? "correct" : "wrong"}`}
        >
          <div id={card.id}>
            <p className="card-type">{card.type}</p>
            <p className="card-description">{parse(card.description)}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Card;
