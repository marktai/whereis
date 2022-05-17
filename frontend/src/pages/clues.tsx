import React from 'react';
import CloverService from '../api';
import { GameType } from '../api';

import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

import {
  useParams
} from "react-router-dom";

type CluesProps = {
  id: string,
};

type CluesState = {
  game: null|GameType,
  formData: {
    clues: Array<string>,
    suggestedNumClues: string,
    author: string,
  },
};

class Clues extends React.Component<CluesProps, CluesState> {
  state: CluesState = {
    game: null,
    formData: {
      clues: ['', '', '', ''],
      suggestedNumClues: '5',
      author: '',
    },
  };

  async refresh() {
    const game = await CloverService.getGame(this.props.id);
    this.setState({
      game: game,
      formData: {
        clues: game.clues || ['', '', '', ''],
        suggestedNumClues: game.suggested_num_cards?.toString() || '5',
        author: game.author,
      },
    })
  }

  async submitClues() {
    const game = await CloverService.submitClues(
      this.props.id,
      this.state.formData.clues,
      parseInt(this.state.formData.suggestedNumClues),
      this.state.formData.author,
    );
    this.setState({
      game: game,
      formData: {
        clues: game.clues || ['', '', '', ''],
        suggestedNumClues: game.suggested_num_cards?.toString() || '5',
        author: game.author,
      },
    })
  }

  async componentDidMount() {
    await this.refresh();
  }

  renderCard(i: number) {
    const card = this.state.game?.answer_cards?.[i]
    return (
      <Container className="clover-card">
        <Row>
          <Col><strong>{card?.[0]}</strong></Col> <Col>{card?.[3]}</Col>
        </Row>
        <Row>
          <Col><strong>{card?.[1]}</strong></Col> <Col>{card?.[2]}</Col>
        </Row>
      </Container>
    );
  }

  renderClueInput(i: number) {
    return (
      <Form.Control
        type="text"
        value={this.state.formData.clues[i]}
        onChange={(e) => {
          const newClues = this.state.formData.clues.slice();
          newClues[i] = e.target.value;
          this.setState({
            ...this.state,
            formData: {
              ...this.state.formData,
              clues: newClues,
            },
          });
        }}
        placeholder={"Clue " + (i+1).toString()}
      />
    );
  }

  renderAuthorInput() {
    return (
      <Form.Control
        type="text"
        value={this.state.formData.author}
        onChange={(e) => {
          this.setState({
            ...this.state,
            formData: {
              ...this.state.formData,
              author: e.target.value,
            },
          });
        }}
        placeholder="Your name"
      />
    );
  }

  renderNumCardsSelect() {
    return (
      <Form.Select
        value={this.state.formData.suggestedNumClues}
        aria-label="Default select example"
        onChange={(e) => {
          const newSuggestedNumClues = e.target.value;
          this.setState({
            ...this.state,
            formData: {
              ...this.state.formData,
              suggestedNumClues: newSuggestedNumClues,
            },
          });
        }}
      >
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>

      </Form.Select>
    )
  }

  render() {
    return (
      <div className="game">
        <Container>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(0)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(0)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(1)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(1)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(2)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(2)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(3)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(3)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(0)}</Col>
          </Row>
          <Row>
            <Col>{this.renderNumCardsSelect()}</Col>
            <Col>{this.renderAuthorInput()}</Col>
            <Col>
              <Button onClick={() => {this.submitClues()}}>{this.state.game?.clues == null ? "Submit Clues" : "Update Clues" }</Button>
            </Col>
          </Row>
          {
            this.state.game?.clues != null ?
              <Row>
                <Col>Clues submitted at {this.state.game?.last_updated_time}! To guess, go to <a href={`http://clover.marktai.com/games/${this.props.id}/guess`}>http://clover.marktai.com/games/{this.props.id}/guess</a>
                </Col>
              </Row>
            : null
          }

          <div>
            <h2>Tutorial</h2>
            Create clues so that future people playing your puzzle will be able to figure out your original cards after they are all shuffled!
            <ListGroup as="ol" numbered>
              <ListGroup.Item as="li">
                Each clue relates to the bolded work directly above and below the card. For example, "{this.state.formData.clues[0] || "Clue 1"}" relates to "{this.state.game?.answer_cards?.[0]?.[1]}" and "{this.state.game?.answer_cards?.[1]?.[0]}", "{this.state.formData.clues[1] || "Clue 2"}" relates to "{this.state.game?.answer_cards?.[1]?.[1]}" and "{this.state.game?.answer_cards?.[2]?.[0]}", etc.
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    The first card is duplicated as the first and fifth card shown. This is for your convenience. For example, "{this.state.formData.clues[3] || "Clue 4"}" relates to "{this.state.game?.answer_cards?.[3]?.[1]}" and "{this.state.game?.answer_cards?.[0]?.[0]}".
                  </ListGroup.Item>
                </ListGroup>
              </ListGroup.Item>
              <ListGroup.Item as="li">
                When you are ready with all of your clues, select how many cards you will use in puzzle. For example, 5 means that one random card will be added, and 8 means that four random cards will be added.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Add your name, and press "Submit Clues" when you are done!
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Container>
      </div>
    );
  }
}

export default () => {
  const urlId = useParams().id as string;
  return <Clues id={urlId} />
}

