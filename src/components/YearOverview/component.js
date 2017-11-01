// Libraries
import React, { Component } from 'react';

// Styles
import './style.css';

class YearOverview extends Component {
  /*constructor(props) {
    super(props);
  }*/

  import(event) {
    event.preventDefault();
    //this.textarea.value;
  }

  render() {
    return (
      <div className="import-statement">
        <div className="container">
          <div className="row">
            <h1>Year Overview</h1>
            <p className="lead">
              Upload transactions by importing a .CSV statement.
            </p>
          </div>
          <div className="row">
            <div className="well bs-component">
              <form className="form-horizontal">
                <fieldset>
                  <legend>Import</legend>
                  <textarea
                    ref={element => (this.textarea = element)}
                    className="form-control"
                    rows="10"
                  />
                  <span className="help-block">
                    Copy and paste a .CSV statement into the box above, then press the Import button below.
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={event => this.import(event)}
                  >
                    Import
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default YearOverview;
