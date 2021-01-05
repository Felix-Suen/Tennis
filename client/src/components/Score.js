import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../App.css';

const Score = ({ match }) => {
    const [score1, setScore1] = useState();
    const [score2, setScore2] = useState();
    const [message, setMessage] = useState('');
    const [gameEnd, setGameEnd] = useState(false);

    // Function that changes Tennis points to scores
    const convert = (point) => {
        if (point === 0) return 0;
        if (point === 1) return 15;
        if (point === 2) return 30;
        if (point === 3) return 40;
    };

    // Game rules logics
    const rules = (player1, player2) => {
        // when scores are both under 40
        if (player1 <= 3 && player2 <= 3) {
            setScore1(convert(player1));
            setScore2(convert(player2));
            if (player1 === 3 && player2 === 3) {
                setMessage('Deuce');
            }

            // when one player wins a game
        } else if (player1 > 3 && player2 < 3) {
            setScore1('Winner');
            setMessage('Player 1 Wins');
            setGameEnd(true);
        } else if (player2 > 3 && player1 < 3) {
            setScore2('Winner');
            setMessage('Player 2 Wins');
            setGameEnd(true);

            // when both players are above 40
        } else {
            if (player1 === player2) {
                setMessage('Deuce');
                setScore1(40);
                setScore2(40);
            } else if (player1 > player2 && player1 - player2 < 2) {
                setScore1('Ad');
                setMessage('Player 1 Advantage');
            } else if (player1 < player2 && player2 - player1 < 2) {
                setScore2('Ad');
                setMessage('Player 2 Advantage');
            } else if (player1 > player2 && player1 - player2 === 2) {
                setScore1('Winner');
                setMessage('Player 1 Wins');
                setGameEnd(true);
            } else {
                setScore2('Winner');
                setMessage('Player 2 Wins');
                setGameEnd(true);
            }
        }
    };

    // Get game data on refresh
    useEffect(() => {
        async function fetchData() {
            const url = `http://localhost:5000/api/game/${match.params.id}`;
            await axios.get(url).then(function (score) {
                rules(score.data.player1Score, score.data.player2Score);
            });
        }
        fetchData();
    }, [match.params.id]);

    // Change individual player scores
    const onClick = async (e, num) => {
        const url = `http://localhost:5000/api/game/player${num}Scored/${match.params.id}`;
        await axios.put(url).then(function (score) {
            rules(score.data.player1Score, score.data.player2Score);
        });
    };

    // delete game instance and redirect
    const history = useHistory();
    const restart = async (e) => {
        const url = `http://localhost:5000/api/game/${match.params.id}`;
        await axios.delete(url);

        let path = `/`;
        history.push(path);
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
                            {gameEnd ? null : (
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
                            {gameEnd ? null : (
                                <button onClick={(e) => onClick(e, 2)}>
                                    Player 2 scored
                                </button>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            <div>{message}</div>
            <br />
            <br />
            <button onClick={(e) => restart(e)}>Restart Game</button>
        </div>
    );
};

export default Score;
