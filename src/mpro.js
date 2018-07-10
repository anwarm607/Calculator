class Calculator extends React.Component {

  constructor( props ) {
    super( props );
    this.actions = [
      'clear', '↶', '❀', 'menu',
      '7', '8', '9', '÷',
      '4', '5', '6', '×',
      '1', '2', '3', '-',
      '.', '0', '=', '+'
    ];
    this.state = {
      expression   : 'do your math',
      result       : '0',
      showMenu     : false,
      manyDecimals : false 
    };
    this.PLACEHOLDER  = 'do your math';
    this.ERROR        = 'Bad Expression!';
    this.manyDecimals = false;
  }

  clearDisplay = ( ) => {
    this.setState({
      expression: '0',
      result: '0',
      manyDecimals: false
    });
  }

  unDo = ( currExpr ) => {
    if ( currExpr === String(this.state.result) ) return currExpr;
    return currExpr.length > 1 && currExpr !== this.PLACEHOLDER
          ? currExpr.substr(0, currExpr.length - 1)
          : this.PLACEHOLDER;
  }

  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu
    });
  };

  addDigit = ( currExpr, pad ) => {
    return currExpr === '0' || currExpr === this.PLACEHOLDER || currExpr === this.ERROR
          ? pad
          : currExpr + pad;
  }

  addDecimal = ( currExpr, pad ) => {
    if ( (currExpr+pad).match( /(\D\s)?\d+\.\d*\./g ) )
      return currExpr;
    else
      return currExpr + pad;
  }

  addOperator = ( currExpr, pad ) => {
    const endsWithNaN = isNaN( currExpr.substr( currExpr.length - 1 ) );
    const andsWithaSpace  = currExpr.substr( currExpr.length - 1 ) === ' ';
    if ( andsWithaSpace )
      return currExpr.substr( 0, currExpr.length - 2 ) + ' ' + pad + ' ';
    else if (  endsWithNaN )
      return currExpr;
    else
      return currExpr + ' ' + pad + ' ';
  }

  doMath = ( currExpr ) => {
    // TODO: Convert resulting large decimal numbers into exponents.
    let result       = this.state.result;
    let updateExpr   = this.state.expression;
    currExpr = this.formatExpression( currExpr );
    if ( isNaN( currExpr[currExpr.length-1] ) ) {
      this.setState({
        result: 'ERROR', expression: this.ERROR
      }, () => setTimeout( () => {
        this.setState({
          result: result,
          expression: updateExpr
        })
      }, 800 ));
      return;
    } else {
      result = updateExpr = currExpr !== '' ? new Function(`return ${currExpr}`)() : '';
      if ( String(result).indexOf('.') !== -1 )
        if ( String(result).split('.')[1].length > 5 ) this.manyDecimals = true;
        else this.manyDecimals = false;
    }
    this.setState({
      result       : result,
      expression   : updateExpr,
      manyDecimals : this.manyDecimals
    });
  };

  formatExpression = ( currExpr ) => {
    return currExpr.replace(/ /g,'').replace( /×/g, '*' ).replace( /÷/g, '/' );
  }

  updateExpression = pad => {
    const currExpr = String( this.state.expression );
    let updateExpr = '';
    let updateRslt = this.state.result;
    if      ( pad === 'clear' ) return this.clearDisplay( );
    else if ( pad === '↶'     ) updateExpr = this.unDo( currExpr );
    else if ( pad === '❀'     );
    else if ( pad === 'menu'  ) return this.toggleMenu( );
    else if ( !isNaN( pad )   ) updateExpr = this.addDigit( currExpr, pad );
    else if ( pad === '.'     ) updateExpr = this.addDecimal( currExpr, pad );
    else if ( pad === '+'
           || pad === '-'
           || pad === '×'
           || pad === '÷'     ) updateExpr = this.addOperator( currExpr, pad );
    else if ( pad === '='     ) return this.doMath( currExpr );
    this.setState({
      expression: updateExpr,
      result: updateRslt
    });
  };



  componentWillMount ( ) {
    document.addEventListener(
      "keypress",
      event => {
        if ( !isNaN( event.key ) || event.key === '+' || event.key === '-' || event.key === '.' )
          this.updateExpression( event.key );
        else if ( event.key === '/' ) this.updateExpression( '÷' );
        else if ( event.key === '*' ) this.updateExpression( '×' );
        else if ( event.key === 'Enter' ) this.updateExpression( '=' );
        else if ( event.key === 'Escape'  ) this.updateExpression( 'clear' );
        else if ( event.key === 'Backspace'  ) this.updateExpression( '↶' );
        else return
      } );
  }

  componentWillUnmount ( ) {
    document.removeEventListener('keypress');
  }

  render() {
    return (
      <React.Fragment>
        <Display expr={this.state.expression} result={this.state.result} manyDecimals={this.state.manyDecimals} />
        <Brand />
        <Pads
          actions={this.actions}
          updateExpr={this.updateExpression}
          toggleMenu={this.toggleMenu}
          showMenu={this.state.showMenu}
        />
      </React.Fragment>
    );
  }
}

const Pads = props => {
  const { showMenu, actions, updateExpr } = props;
  const IDs = [
      'clear',   'back',  'theme',  'menu',
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

const tweet    = 'I just found a beautiful web-based calculator made with '
               + 'React! You should try it! '
               + 'https://codepen.io/spaniarddev/full/ERVONM/ \n\n';
const tweetURL = 'https://twitter.com/intent/tweet?'
                  + 'hashtags=calculator,calcoolator,webdesign,FreeCodeCamp,'
                    + 'Coders,Dev,React,Javascript'
                  + '&via=spaniarddev'
                  + '&related=freecodecamp&text=' +
                  encodeURIComponent( tweet );

const Menu = props => {
  return (
    <div className={props.showMenu ? 'menu hide' : 'menu'}>
      <small className="goBack" onClick={() => props.toggleMenu()}>
        {'◄ back to business'}
      </small>
      <section>
        <h6>Let your friends know</h6>
        <p>Hi,</p>
        <p>
          If you think this <strong>calcoolator</strong> thing is worth it,
          please{' '}
          <a
            className="item"
            href={tweetURL}
            rel="noopener noreferrer"
            target="_blank"
            alt="Tweet to your friends"
            title="Tweet to your friends"
            tabIndex="-1"
          >
            spread the word on Twitter
          </a>{' '}
          and let your friends know!
        </p>
        <p>Of course, any feedback is more than welcome.</p>
        <p>Thanks for your time,</p>
        <p>
          <a
            href="https://twitter.com/SpaniardDev/"
            target="_blank"
            rel="noopener noreferrer"
            alt="about spaniardDev"
            title="about spaniardDev"
            tabIndex="-1"
          >
            spaniardDev
          </a>
        </p>
      </section>
    </div>
  );
};

const Display = props => {
  return (
    <section id="Display">
      <h1 className={props.manyDecimals && 'hasManyDecimals'}>{props.result}</h1>
      <small id="display">{props.expr}</small>
    </section>
  );
};

const Brand = props => {
  return (
    <section className="brand">
      cal<span className="highlighted">cool</span>ator
    </section>
  );
};

ReactDOM.render(<Calculator />, document.getElementById('Calculator'));
