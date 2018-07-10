import React from "react";
import "./App.css";
import Display from "./Display";
import Pads from "./Keys";
import Brand from "./Brand";

class App extends React.Component {

  constructor( props ) {
    super( props );
    this.actions = [
      'clear', '↶', '%', 'info',
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

inputPercent() {
    const { result } = this.state
    const currentValue = parseFloat(result)
    
    if (currentValue === 0)
      return
    
    const fixedDigits = result.replace(/^-?\d*\.?/, '')
    const newValue = parseFloat(result) / 100

    this.setState({
      result: String(newValue.toFixed(fixedDigits.length + 2))
    })
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
    else if ( pad === '%'     ) return this.inputPercent();
    else if ( pad === 'info'  ) return this.toggleMenu( );
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
        else if ( event.key === '%' ) this.updateExpression( '%' );
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
export default App;