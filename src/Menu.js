import React from "react";

const Menu = props => {
  return (
    <div className={props.showMenu ? 'menu hide' : 'menu'}>
      <small className="goBack" onClick={() => props.toggleMenu()}>
        {'◄ back to business'}
      </small>
      <section>
        <h6>This is my tiny Calculator</h6>
        <p>Hi,</p>
        <p>
          I have made this <strong>calculator</strong> with React,
          feel
            free to examine the source code.
        </p>
        <p>Offcourse, any feedback is more than welcome.</p>
        <p>Thanks for your time,</p>
        <p>
          <a
            href="https://www.linkedin.com/in/mohamed-anwar-72657b122/"
            target="_blank"
            rel="noopener noreferrer"
            alt="about Anwar"
            title="about Anwar"
            tabIndex="-1"
          >
            MohamedAnwar
          </a>
        </p>
      </section>
    </div>
  );
};

export default Menu;