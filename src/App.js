import React from "react";
import axios from "axios";
import PlayerCards from "./PlayerCards";


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deckId: null,
      buttonDisabled: false,
      currentPlayer: 1,
      player1: [],
      player2: [],
      player3: [],
      remaining: 52
    };
  }

  async componentDidMount() {
    try {
      // Disable deal button before fetching
      this.setState({ buttonDisabled: true });

      // Create and shuffle new deck
      const response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );

      // Store deck id and re-enable button
      this.setState({
        deckId: response.data.deck_id,
        remaining: response.data.remaining,
        buttonDisabled: false
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleDealClick = async () => {
    const { deckId, currentPlayer, remaining } = this.state;

    if (remaining === 0) return;

    try {
      // Disable button during API call
      this.setState({ buttonDisabled: true });

      // Draw one card
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );

      const card = response.data.cards[0];
      const newRemaining = response.data.remaining;

      this.setState((prevState) => {
        let nextPlayer = prevState.currentPlayer + 1;
        if (nextPlayer > 3) nextPlayer = 1;

        const newState = {
          currentPlayer: nextPlayer,
          remaining: newRemaining,
          buttonDisabled: newRemaining === 0
        };

        if (prevState.currentPlayer === 1) {
          newState.player1 = [...prevState.player1, card];
        } else if (prevState.currentPlayer === 2) {
          newState.player2 = [...prevState.player2, card];
        } else {
          newState.player3 = [...prevState.player3, card];
        }

        return newState;
      });
    } catch (error) {
      console.error(error);
      this.setState({ buttonDisabled: false });
    }
  };

  render() {
    const { player1, player2, player3, buttonDisabled } = this.state;

    return (
      <div>
        <button onClick={this.handleDealClick} disabled={buttonDisabled}>
          Deal!
        </button>

        <h3>Player 1 Cards</h3>
        <PlayerCards cards={player1} />

        <h3>Player 2 Cards</h3>
        <PlayerCards cards={player2} />

        <h3>Player 3 Cards</h3>
        <PlayerCards cards={player3} />
      </div>
    );
  }
}

export default App;
