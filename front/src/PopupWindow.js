import React from 'react';

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
