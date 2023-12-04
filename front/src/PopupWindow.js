import React from 'react';
/**
 * Renders a popup window with a form.
 * It takes four props: labelName, onSubmit, inputValue, and onInputChange.
 * - labelName: A string that represents the label text for the input field.
 * - onSubmit: A function to handle the submission of the form.
 * - inputValue: The current value of the input field.
 * - onInputChange: A function to handle changes in the input field.
 * 
 * @param {Object} props The props passed to the PopupWindow component.
 * @returns JSX for the PopupWindow component.
 */
function PopupWindow({ labelName, onSubmit, inputValue, onInputChange }) {
  return (
    <div className="popup-window">
      <form onSubmit={onSubmit}>
       <label>
        {labelName}
        <input type="text" value={inputValue} onChange={onInputChange} />
       </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PopupWindow;
