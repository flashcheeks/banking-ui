// Libraries
import React, { Component } from 'react';

// Styles
import './style.css';

class Dropdown extends Component {
  onSelect(event, id) {
    event.preventDefault();
    this.props.onSelect(id);
  }

  render() {
    return (
      <div className="btn-group">
        <button
          className="btn btn-default dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.props.label} <span className="caret" />
        </button>
        <ul className="dropdown-menu">
          {this.props.items.map((item, index) => {
            return (
              <li key={index}>
                <a
                  href={'#' + item.id}
                  onClick={e => this.onSelect(e, item.id)}
                >
                  {item.value}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Dropdown;
