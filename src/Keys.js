import React from "react";
import "./Keys.css";
import Menu from "./Menu";

const Pads = props => {
  const { showMenu, actions, updateExpr } = props;
  const IDs = [
      'clear',   'back',  'percent',  'menu',
      'seven',   'eight', 'nine',   'divide',
      'four',    'five',  'six',    'multiply',
      'one',     'two',   'three',  'subtract',
      'decimal', 'zero',  'equals', 'add'
    ];
  return (
    <section id="Pads">
      <div className={showMenu ? 'container hide' : 'container'}>
        {actions.map((pad, i) => (
          <div  id={IDs[i]}
                className={
                  pad === '♥'
                    ? 'pad menuToggler'
                    : isNaN(pad) ? 'pad sym' : 'pad num' }
                onClick={() => updateExpr(pad)}
                key={i} >{pad}
          </div>
        ))}
      </div>
      <Menu {...props} />
    </section>
  );
};

export default Pads;