import React from 'react';
import WhereisService from '../api';
import { GameType } from '../api';
import {Container, Row, Col, ListGroup, Button} from 'react-bootstrap';
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

type ListProps = {
  navigate: any,
  wordList: string,
}

type ListState = {
  games: null|Array<GameType>,
  adult: null|boolean,
};

class List extends React.Component<ListProps, ListState> {
  state: ListState = {
    games: null,
    adult: this.props.wordList === 'adult',
  };
  ws: null|WebSocket = null;

  async refresh() {
    const games = await WhereisService.getGames(this.props.wordList, this.props.wordList === 'adult');
    this.setState({
      ...this.state,
      games: games,
    })
  }

  async componentDidMount() {
    await this.refresh();

    if (this.ws === null) {
      const ws_protocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
      this.ws = new WebSocket(`${ws_protocol}//${window.location.host}/ws/listen/list`);
      this.ws.onmessage = async (event) => {
        const message: any = JSON.parse(event.data);
        if (message.type === 'LIST_UPDATE') {
          await this.refresh();
        }
      }
    }
  }

  async componentDidUpdate(prevProps: ListProps) {
    if (prevProps.wordList !== this.props.wordList) {
      this.setState({
        ...this.state,
        adult: this.props.wordList === 'adult',
      });
      await this.refresh();
    }
  }

  async newGame() {
    const newGame = await WhereisService.newGame(this.props.wordList);
    this.props.navigate(`/games/${newGame.id}/clues`);
  }

  clearAllState() {
    localStorage.clear();
  }

  getLink(game: GameType) {
    return "/games/" + game.id + (game.clues === null ? "/clues" : "/guess");
  }

  render() {
    const [gamesWithoutClues, gamesWithClues] = [
      (this.state.games ?? []).filter((g) => g.clues === null),
      (this.state.games ?? []).filter((g) => g.clues !== null),
    ].map((list) => list.map(
      (game: GameType, i: number) => {
        let text = game.clues === null ?
          `Game ${game.id} without clues` :
          `Game ${game.id} by ${game.author} with ${game.suggested_num_cards} cards`;
        if (game.daily_set_time !== null) {
          const date = new Date(new Date(game.daily_set_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
          text += ` (${date.getMonth() + 1}/${date.getDate()}'s daily puzzle)`
        }
        return <ListGroup.Item key={i}>
          <Link to={this.getLink(game)}>{text}</Link>
        </ListGroup.Item>;
    }));

    return (
      <Container className={"list" + (this.props.wordList !== "default" ? ` ${this.props.wordList}` : "")}>
        <Row>
          <Col xs={12} md={6}>
            <Button onClick={() => {this.newGame()}}>New {this.props.wordList !== "default" ? ` ${this.props.wordList}` : ""} Game</Button>
            <div>
              Games with clues, ready to guess
            </div>
            <ListGroup>
              <ListGroup.Item key={"daily"}>
                <Link to={"/daily"}>Daily updated game</Link>
              </ListGroup.Item>
              {
                this.state.games === null ?
                  <img className="loader" src="https://www.marktai.com/download/54689/ZZ5H.gif"/> :
                  gamesWithClues
              }
            </ListGroup>
            {/*Games without clues
            <ListGroup>
              { gamesWithoutClues }
            </ListGroup>*/}
          </Col>
          <Col xs={12} md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                To give clues for a new game, click "New Game"
              </ListGroup.Item>
              <ListGroup.Item>
                To solve the clues for an existing game, click on any listed game
              </ListGroup.Item>
            </ListGroup>
            <div>
              If you are having any issues with loading only some puzzles or some puzzles have the wrong information, click this button.
              <div>
                <Button variant={"danger"} onClick={() => {this.clearAllState()}}>Clear all local state!</Button>
              </div>
            </div>
            <div>
            If you have any questions or feedback, feel free to email me at mark@marktai.com!
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

type ListContainerProps = {
  wordList?: string,
}

const ListContainer: React.FunctionComponent<ListContainerProps> = (props) => {
  const navigate = useNavigate();
  const urlWordList = useParams().wordList as string;
  const wordList = props.wordList || urlWordList || "default";
  return (<List navigate={navigate} wordList={wordList }></List>)
}

export default ListContainer;
