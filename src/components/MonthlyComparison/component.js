/* global document, fetch */

// Libraries
import React, { Component } from 'react';
import 'whatwg-fetch';

// Components
import Table from '../Table/component';

import { monthlyBudget, monthlyStatements } from '../../config.js';
import { getAllTransactions, getMoneyTotals } from '../../config.js';
import { getSubsetTransactions } from '../../helpers.js';
import { formatToCurrency, formatPercentage } from '../../helpers.js';

// Styles
import './style.css';

class MonthlyComparison extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: [],
      bills: [],
    };
  }

  componentDidMount() {
    this.loadAllStatements('current')
      .then(data => {
        this.setState({ current: data });
        return this.loadAllStatements('bills');
      })
      .then(data => {
        this.setState({ bills: data });
      })
      .catch(err => {
        console.error('Failed to load data', err);
      });
  }

  loadAllStatements(account) {
    return Promise.all(
      monthlyStatements.map(statement => {
        // set data url
        const url = 'data/' + account + '/' + statement.id + '.json';
        // fetch monthly statment data
        //if (typeof document !== 'undefined')
        return fetch(url).then(result => result.json());
      })
    );
  }

  getBreakdown(transactions, tags, thershold) {
    // create subset of transactions that only include specfic tags
    const breakdown = getSubsetTransactions(transactions, tags, []);
    // calulate subset total amount
    let total = 0;
    for (let i in breakdown)
      total += parseFloat(breakdown[i].amount);
    // calulate subset total percentage
    const percentage = Math.abs(total) / monthlyBudget;
    let percentClass = percentage > thershold ? 'text-danger' : 'text-primary';
    const formatPercent = formatPercentage(percentage, 1);
    // format colour ranges
    percentClass += Math.abs(percentage) < thershold * 1.1
      ? Math.abs(percentage) < thershold * 1.05 ? ' range1' : ' range2'
      : '';
    // return
    return <h4 className={percentClass}>{formatPercent}</h4>;
  }

  render() {
    const { current, bills } = this.state;

    // set statement dates
    const statementDates = [
      monthlyStatements[0].value,
      monthlyStatements[monthlyStatements.length - 1].value,
    ];

    // set table data for grid comparison
    const gridData = [];
    for (let i in monthlyStatements) {
      // create single source of all transactions
      const allTransactions = getAllTransactions(current[i], bills[i]);
      // set money in and out totals
      const money = getMoneyTotals(allTransactions, monthlyStatements[i].id);
      // set disparity values
      const disparity = monthlyBudget + money.out;
      let disparityClass = disparity < 0 ? 'text-danger' : 'text-primary';
      const disparityFormat = formatToCurrency(disparity, '£');
      // format colour ranges
      disparityClass += Math.abs(disparity) < 800
        ? Math.abs(disparity) < 400 ? ' range1' : ' range2'
        : '';

      // set tags lists
      const householdTags = ['household', 'amazon'];
      const financeTags = ['payment', 'cash', 'cheque', 'fees'];

      // update grid data
      gridData.push({
        month: monthlyStatements[i].value,
        disparity: <h4 className={disparityClass}>{disparityFormat}</h4>,
        bills: this.getBreakdown(allTransactions, ['bill'], 0.55),
        groceries: this.getBreakdown(allTransactions, ['groceries'], 0.22),
        household: this.getBreakdown(allTransactions, householdTags, 0.11),
        kids: this.getBreakdown(allTransactions, ['kids'], 0.07),
        car: this.getBreakdown(allTransactions, ['car'], 0.04),
        provision: this.getBreakdown(allTransactions, ['provision'], 0.04),
        finance: this.getBreakdown(allTransactions, financeTags, 0.04),
      });
    }

    // set table config for grid comparison
    const border = 'border-left align-right';
    const gridConfig = [
      { id: 'month', classes: '', label: 'Month' },
      { id: 'disparity', classes: border, label: 'Disparity' },
      { id: 'bills', classes: border, label: 'Bills%' },
      { id: 'groceries', classes: border, label: 'Groceries%' },
      { id: 'household', classes: border, label: 'Household%' },
      { id: 'kids', classes: border, label: 'Kids%' },
      { id: 'car', classes: border, label: 'Car%' },
      { id: 'provision', classes: border, label: 'Provision%' },
      { id: 'finance', classes: border, label: 'Finance%' },
    ];

    return (
      <div className="monthly-comparison">
        <div className="container">

          {/* Header */}

          <div className="row">
            <div className="page-header">
              <h4>Monthly Comparison</h4>
              <h1>{statementDates.join(' to ')}</h1>
            </div>
          </div>

          {/* Overview */}

          <div className="row">
            <h3>Overview</h3>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">Grid</h4>
              </div>
              <div className="panel-body">
                <Table config={gridConfig} data={gridData} />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default MonthlyComparison;
