import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import tennis from '../img/tennis.png';
import '../App.css';

const Landing = () => {
    const history = useHistory();

    const onClick = async (e) => {
        try {
            // Create a new game
            const res = await axios.post('/api/game');
            const id = res.data._id;

            // Redirect to the game
            let path = `/game/${id}`;
            history.push(path);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="centre">
            <h1>
                Tennis Score Tracker <img src={tennis} width={30} height={30} />
            </h1>
            <p>By Felix Suen</p>
            <br />
            <br />
            <button onClick={(e) => onClick(e)}>Start a new game</button>
        </div>
    );
};

export default Landing;
