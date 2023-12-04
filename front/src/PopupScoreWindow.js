import React from 'react';
/**
 * Renders a popup window displaying the current score and options to save or cancel.
 * The component takes three props:
 * - score: The current score to be displayed.
 * - onSave: A function that is called when the user clicks the 'Save' button.
 * - onCancel: A function that is called when the user clicks the 'Cancel' button.
 *
 * @param {Object} props The props passed to the PopupScoreWindow component.
 * @returns JSX for the PopupScoreWindow component.
 */
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
