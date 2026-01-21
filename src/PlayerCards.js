import React from "react";

class PlayerCards extends React.Component {
  render() {
    const { cards } = this.props;

    return (
      <div style={{ display: "flex", position: "relative", height: "140px" }}>
        {cards.map((card, index) => (
          <img
            key={card.code}
            src={card.image} // use the card image from API
            alt={`${card.value} of ${card.suit}`}
            style={{
              position: "relative",
              left: index * -40, // overlap the cards
              width: "80px",
              height: "120px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxShadow: "1px 1px 3px rgba(0,0,0,0.3)",
              userSelect: "none",
            }}
          />
        ))}
      </div>
    );
  }
}

export default PlayerCards;
