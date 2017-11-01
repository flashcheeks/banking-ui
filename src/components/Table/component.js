// Libraries
import React, { Component } from 'react';

// Styles
import './style.css';

class Table extends Component {
  render() {
    return (
      <div className="banking-table table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>

              {this.props.config.map((column, index) => {
                return (
                  <th key={index} className={column.classes}>{column.label}</th>
                );
              })}

            </tr>
          </thead>
          <tbody>

            {this.props.data.map((row, index) => {
              return (
                <tr key={index}>

                  {this.props.config.map((column, index) => {
                    return (
                      <td key={index} className={column.classes}>
                        {row[column.id]}
                      </td>
                    );
                  })}

                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
