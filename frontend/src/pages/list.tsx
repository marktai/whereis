import React from 'react';
import ReactDOM from 'react-dom/client';
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
      (game: GameType, i: number) =>
        <ListGroup.Item key={i}>
          <Link to={this.getLink(game)}>Game {game.id} </Link>
        </ListGroup.Item>
    );

    return (
      <div className="list">
        <ListGroup>
          { gameList }
        </ListGroup>
        <Button onClick={() => {this.newGame()}}>New Game</Button>
      </div>
    );
  }
}
