import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import tennis from '../img/tennis.png';
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
    const onClick = async (e, player_id) => {
        const url = `/api/game/${match.params.id}/${player_id}`;
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
        // redirect to home page
        history.push(`/`);
    };

    return (
        <div className="centre">
            <Container>
                <h1>Tennis Score Tracker  <img src={tennis} width={30} height={30} /></h1>
                <br />
                <Row>
                    <Col>
                        <div>
                            <p>Player 1</p>
                            <h1>{score1}</h1>
                            {endGame ? null : (
                                <button onClick={(e) => onClick(e, '1')}>
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
                                <button onClick={(e) => onClick(e, '2')}>
                                    Player 2 scored
                                </button>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            {score1 === 'Winner' && (<b>Player 1 Wins</b>)}
            {score2 === 'Winner' && (<b>Player 2 Wins</b>)}

            <br />
            <br />
            <button className="reset-btn" onClick={(e) => restart(e)}>Restart Game</button>
        </div>
    );
};

export default Score;
