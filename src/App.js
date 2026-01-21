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

      // Create and shuffle a new deck
      const response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );

      // Store deck ID and remaining count, re-enable button
      this.setState({
        deckId: response.data.deck_id,
        remaining: response.data.remaining,
        buttonDisabled: false
      });
    } catch (err) {
      console.error("Error creating deck:", err);
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

      // Assign card to current player
      this.setState((prevState) => {
        const updatedState = {
          remaining: newRemaining
        };

        if (currentPlayer === 1) {
          updatedState.player1 = [...prevState.player1, card];
          updatedState.currentPlayer = 2;
        } else if (currentPlayer === 2) {
          updatedState.player2 = [...prevState.player2, card];
          updatedState.currentPlayer = 3;
        } else {
          updatedState.player3 = [...prevState.player3, card];
          updatedState.currentPlayer = 1;
        }

        // Re-enable button only if cards remain
        updatedState.buttonDisabled = newRemaining === 0;

        return updatedState;
      });
    } catch (err) {
      console.error("Error dealing card:", err);
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

        <div>
          <h3>Player 1 Cards:</h3>
          <PlayerCards cards={player1} />
        </div>

        <div>
          <h3>Player 2 Cards:</h3>
          <PlayerCards cards={player2} />
        </div>

        <div>
          <h3>Player 3 Cards:</h3>
          <PlayerCards cards={player3} />
        </div>
      </div>
    );
  }
}

export default App;
