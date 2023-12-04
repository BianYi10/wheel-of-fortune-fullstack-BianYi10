import React from 'react';

const PopupScoreWindow = ({ score, onSave, onCancel }) => {
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Score: {score}</h2>
                <button onClick={onSave}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default PopupScoreWindow;
