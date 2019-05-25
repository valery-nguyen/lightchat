import React from 'react';

export const HeaderConsole = (props) => {
  
  return (
    <div className="header-wrapper">
      <div className="header-stuff">
        <div className="left-things">
          <div className="upper-left-thing">
            <h3>{props.name}</h3>
          </div>
          <div className="lower-left-things"> 
            <div>
            </div>
          </div>  
        </div>
        <div className="right-things">
        </div>
      </div>
    </div>
  )

};