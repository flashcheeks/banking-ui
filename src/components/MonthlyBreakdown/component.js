// Libraries
import React, { Component } from 'react';

// Components
import Table from '../Table/component';

import { monthlyBudget } from '../../config.js';
import { sortByKey, createSlugFromArray } from '../../helpers.js';
import { formatToCurrency, formatPercentage } from '../../helpers.js';

// Styles
import './style.css';

class MonthlyBreakdown extends Component {
  //
  anyTagCondition(full, include) {
    for (let i in include)
      if (full.includes(include[i])) return true;
  }

  render() {
    const { transactions, title, tags } = this.props;

    // create a list of excluded tags
    const exclude = tags.concat(['expand']);

    // create subset of transactions that only include specfic tags
    const breakdown = [];
    for (let i in transactions) {
      // clone transaction object
      const transaction = JSON.parse(JSON.stringify(transactions[i]));
      if (this.anyTagCondition(transaction.tags, tags)) {
        // create breakdown key for this transaction
        const key = createSlugFromArray(transaction.tags, exclude);
        // add key and initial object to breakdown array
        if (!(key in breakdown)) breakdown[key] = { count: 0, amount: 0 };
        // increment breakdown object
        breakdown[key].count += 1;
        breakdown[key].amount += parseFloat(transaction.amount);
      }
    }

    // calulate subset total amount
    let total = 0;
    for (let i in breakdown)
      total += parseFloat(breakdown[i].amount);

    // calulate subset total percentage
    const percentage = Math.abs(total) / monthlyBudget;

    // format breakdown array for use as table data
    let data = [];
    for (let i in breakdown) {
      const b = breakdown[i];
      data.push({ tag: i, count: b.count, amount: b.amount });
    }

    // sort table data by amount
    data = sortByKey(data, 'amount');

    // format values to printable strings
    for (let i in data) {
      const budget = Math.abs(data[i].amount) / monthlyBudget;
      data[i].budget = formatPercentage(budget, 1);
      const breakdown = data[i].amount / total;
      data[i].breakdown = formatPercentage(breakdown, 1);
      data[i].amount = formatToCurrency(data[i].amount, '£');
    }

    // set table columns config object
    const hidden = 'align-right hidden-xs hidden-sm';
    const config = [
      { id: 'tag', classes: '', label: 'Tag' },
      { id: 'count', classes: 'align-right visible-lg', label: 'Count' },
      { id: 'amount', classes: 'align-right', label: 'Amount' },
      { id: 'breakdown', classes: hidden, label: 'Breakdown%' },
      { id: 'budget', classes: 'align-right', label: 'Budget%' },
    ];

    return (
      <div className="monthly-breakdown">
        <div className="panel panel-default">

          <div className="panel-heading">
            <h4 className="panel-title">{title}</h4>
          </div>

          <div className="panel-body">
            <div className="row">

              <div className="col-sm-6 big-number">
                <h4>{this.props.title} Total</h4>
                <h1 className="text-danger">
                  {formatToCurrency(total, '£')}
                </h1>
                <h4>{this.props.title} Budget%</h4>
                <h1 className="text-primary">
                  {formatPercentage(percentage, 1)}
                </h1>
              </div>

              <div className="col-sm-6">
                <Table config={config} data={data} />
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default MonthlyBreakdown;
