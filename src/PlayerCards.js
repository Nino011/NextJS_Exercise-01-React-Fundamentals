import React from "react";

class PlayerCards extends React.Component {
  render() {
    const { cards } = this.props;

    return (
      <ul>
        {cards.map((card) => (
          <li key={card.code}>
            <img src={card.image} alt={`${card.value} of ${card.suit}`} />
          </li>
        ))}
      </ul>
    );
  }
}

export default PlayerCards;
