// Libraries
import React, { Component } from 'react';

// Components
import NavBar from '../NavBar/component';
import MonthlyStatements from '../MonthlyStatements/component';
import YearOverview from '../YearOverview/component';

// Styles
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'MonthlyStatements',
    };
  }

  componentDidMount() {
    //openDB();
  }

  onNavigate(state) {
    this.setState(state);
  }

  render() {
    const { view } = this.state;

    return (
      <div className="app">

        <NavBar onNavigate={state => this.onNavigate(state)} />

        {view === 'MonthlyStatements'
          ? <MonthlyStatements onNavigate={state => this.onNavigate(state)} />
          : null}

        {view === 'YearOverview'
          ? <YearOverview onNavigate={state => this.onNavigate(state)} />
          : null}

      </div>
    );
  }
}

export default App;
