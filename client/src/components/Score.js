import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../App.css';

const Score = ({ match }) => {
    const [score1, setScore1] = useState('');
    const [score2, setScore2] = useState('');
    const [endGame, setEndGame] = useState(false);

    // Get game data on refresh
    useEffect(() => {
        async function fetchData() {
            const url = `/api/game/${match.params.id}`;
            await axios.get(url).then(function (score) {
                setScore1(score.data.player1TennisScore);
                setScore2(score.data.player2TennisScore);
                setEndGame(score.data.endGame);
            });
        }
        fetchData();
    }, [match.params.id]);

    // Change individual player scores
    const onClick = async (e, num) => {
        const url = `/api/game/player${num}Scored/${match.params.id}`;
        await axios.put(url).then(function (score) {
            setScore1(score.data.player1TennisScore);
            setScore2(score.data.player2TennisScore);
            setEndGame(score.data.endGame);
        });
    };

    // delete game instance and redirect
    const history = useHistory();
    const restart = async (e) => {
        const url = `/api/game/${match.params.id}`;
        await axios.delete(url);

        history.push(`/`);
    };

    return (
        <div className="centre">
            <Container>
                <h1>Tennis Score Tracker</h1>
                <Row>
                    <Col>
                        <div>
                            <p>Player 1</p>
                            <h1>{score1}</h1>
                            {endGame ? null : (
                                <button onClick={(e) => onClick(e, 1)}>
                                    Player 1 scored
                                </button>
                            )}
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <p>Player 2</p>
                            <h1>{score2}</h1>
                            {endGame ? null : (
                                <button onClick={(e) => onClick(e, 2)}>
                                    Player 2 scored
                                </button>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            <br />
            <br />
            <button onClick={(e) => restart(e)}>Restart Game</button>
        </div>
    );
};

export default Score;
