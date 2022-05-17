import React from 'react';
import CloverService from '../api';
import { GameType } from '../api';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import {
  Link
} from "react-router-dom";

type ListState = {
  games: Array<GameType>;
};

export default class List extends React.Component<{}, ListState> {
  state: ListState = {
    games: [],
  };

  async refresh() {
    const games = await CloverService.getGames();
    this.setState({
      games: games,
    })
  }

  async componentDidMount() {
    await this.refresh();
  }

  async newGame() {
    await CloverService.newGame();
    await this.refresh();
  }

  getLink(game: GameType) {
    return "/games/" + game.id + (game.clues === null ? "/clues" : "/guess");
  }

  render() {
    const gameList = this.state.games.map(
      (game: GameType, i: number) => {
        const text = game.clues === null ?
          `Game ${game.id} without clues` :
          `Game ${game.id} by ${game.author} with ${game.suggested_num_cards} cards`;
        return <ListGroup.Item key={i}>
          <Link to={this.getLink(game)}>{text}</Link>
        </ListGroup.Item>;
    });

    return (
      <div className="list">
        <ListGroup>
          { gameList }
        </ListGroup>
        <Button onClick={() => {this.newGame()}}>New Game</Button>
        <div>
          <ListGroup variant="flush">
            <ListGroup.Item>
              To give clues for a new game, click "New Game", then click on the newly generated "Game # without clues" on the top
            </ListGroup.Item>
            <ListGroup.Item>
              To solve the clues for an existing game, click on a game that says "Game # by author with 5-8 cards"
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    );
  }
}
