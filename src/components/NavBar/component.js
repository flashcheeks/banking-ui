// Libraries
import React, { Component } from 'react';

// Styles
import './style.css';

class NavBar extends Component {
  /*constructor(props) {
    super(props);
  }*/

  navigate(event, view) {
    event.preventDefault();
    this.props.onNavigate({ view: view });
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar-collapse-1"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <div className="navbar-brand">Banking</div>
          </div>
          <div className="collapse navbar-collapse" id="navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a
                  href="#MonthlyStatements"
                  onClick={event => this.navigate(event, 'MonthlyStatements')}
                >
                  Monthly Statements
                </a>
              </li>
              <li>
                <a
                  href="#YearOverview"
                  onClick={event => this.navigate(event, 'YearOverview')}
                >
                  Year Overview
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
