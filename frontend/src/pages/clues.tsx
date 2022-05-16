import React from 'react';
import ReactDOM from 'react-dom/client';
import CloverService from '../api';
import { GameType } from '../api';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';

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
  },
};

class Clues extends React.Component<CluesProps, CluesState> {
  state: CluesState = {
    game: null,
    formData: {
      clues: ['', '', '', ''],
      suggestedNumClues: '5',
    },
  };

  async refresh() {
    const game = await CloverService.getGame(this.props.id);
    this.setState({
      game: game,
      formData: {
        clues: game.clues || ['', '', '', ''],
        suggestedNumClues: game.suggested_num_cards?.toString() || '5',
      },
    })
  }

  async submitClues() {
    const game = await CloverService.submitClues(
      this.props.id,
      this.state.formData.clues,
      parseInt(this.state.formData.suggestedNumClues)
    );
    this.setState({
      game: game,
      formData: {
        clues: game.clues || ['', '', '', ''],
        suggestedNumClues: game.suggested_num_cards?.toString() || '5',
      },
    })
  }

  async componentDidMount() {
    await this.refresh();
  }

  renderCard(i: number) {
    const card = this.state.game?.answer_cards?.[i]
    return (
      <Container>
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
        placeholder={"Clue " + i.toString()}
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
        <Container fluid>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(3)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(0)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(0)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(1)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(1)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(2)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(2)}</Col>
          </Row>
          <Row>
            <Col xs={4}>
              {this.renderClueInput(3)}
            </Col>
            <Col xs={8}></Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={8}>{this.renderCard(3)}</Col>
          </Row>
          <Row>
            <Col>{this.renderNumCardsSelect()}</Col>
            <Col>
              <Button onClick={() => {this.submitClues()}}>Submit Clues </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default () => {
  const urlId = useParams().id as string;
  return <Clues id={urlId} />
}

