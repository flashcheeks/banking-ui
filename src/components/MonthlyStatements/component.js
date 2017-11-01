/* global document, fetch */

// Libraries
import React, { Component } from 'react';
import 'whatwg-fetch';

// Components
import Table from '../Table/component';
import Dropdown from '../Dropdown/component';
import MonthlyBreakdown from '../MonthlyBreakdown/component';

import { monthlyBudget, monthlyStatements } from '../../config.js';
import { excludeTagCondition, excludeTransferCondition } from '../../config.js';
import { excludeRefundCondition, excludeDupCondition } from '../../config.js';
import { formatToCurrency } from '../../helpers.js';

// Styles
import './style.css';

class MonthlyStatements extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statement: '201710',
      current: [],
      bills: [],
    };
  }

  componentDidMount() {
    this.loadStatement(this.state.statement);
  }

  loadStatement(statement) {
    // reset state
    this.setState({
      statement: statement,
      current: [],
      bills: [],
    });

    // set data urls
    const currentUrl = 'data/current/' + statement + '.json';
    const billsUrl = 'data/bills/' + statement + '.json';

    // fetch monthly statment data
    if (typeof document !== 'undefined') {
      fetch(currentUrl)
        .then(result => result.json())
        .then(json => {
          this.setState({ current: json });
          return fetch(billsUrl);
        })
        .then(result => result.json())
        .then(json => {
          this.setState({ bills: json });
        })
        .catch(err => {
          console.error('Failed to load data', err);
        });
    }
  }

  render() {
    const { statement, current, bills } = this.state;

    // set statement date
    let statementDate = '';
    for (let i in monthlyStatements) {
      if (monthlyStatements[i].id === statement)
        statementDate = monthlyStatements[i].value;
    }

    // set account balances
    const currentBal = current.length ? current[0].balance : 0;
    const billsBal = bills.length ? bills[0].balance : 0;
    const currentBalClass = currentBal < 0 ? 'text-danger' : 'text-primary';
    const billsBalClass = billsBal < 0 ? 'text-danger' : 'text-primary';

    // create single source of all transactions
    const allTransactions = [];
    let transfer = null;
    for (let i in bills) {
      if (excludeTagCondition(bills[i].tags)) {
        bills[i].tags.includes('transfer')
          ? (transfer = Math.abs(bills[i].amount))
          : allTransactions.push(JSON.parse(JSON.stringify(bills[i])));
      }
    }
    for (let i in current) {
      if (excludeRefundCondition(current[i].desc, current[i].amount)) {
        if (excludeTransferCondition(current[i], transfer)) {
          allTransactions.push(JSON.parse(JSON.stringify(current[i])));
        }
      }
    }

    // set money in and out totals
    let moneyIn = 0;
    let moneyOut = 0;
    for (let i in allTransactions) {
      if (excludeDupCondition(statement, allTransactions[i].amount)) {
        const amount = parseFloat(allTransactions[i].amount);
        amount > 0 ? (moneyIn += amount) : (moneyOut += amount);
      }
    }

    // set extra and disparity values
    const extraBudget = moneyIn - monthlyBudget;
    const disparity = monthlyBudget + moneyOut;
    const disparityClass = disparity < 0 ? 'text-danger' : 'text-primary';

    // set table config for account transactions
    const hidden = 'align-right hidden-xs hidden-sm';
    const accountConfig = [
      { id: 'date', classes: 'hidden-xs', label: 'Date' },
      { id: 'type', classes: 'hidden-xs hidden-sm', label: 'Type' },
      { id: 'desc', classes: '', label: 'Description' },
      { id: 'amount', classes: 'align-right', label: 'Amount' },
      { id: 'balance', classes: 'align-right', label: 'Balance' },
      { id: 'tags', classes: hidden, label: 'Tags' },
    ];

    // set table data for account transactions
    const currentData = JSON.parse(JSON.stringify(current));
    const billsData = JSON.parse(JSON.stringify(bills));
    for (let i in currentData) {
      currentData[i].amount = formatToCurrency(currentData[i].amount, '£');
      currentData[i].balance = formatToCurrency(currentData[i].balance, '£');
      currentData[i].tags = currentData[i].tags.join(' | ');
    }
    for (let i in billsData) {
      billsData[i].amount = formatToCurrency(billsData[i].amount, '£');
      billsData[i].balance = formatToCurrency(billsData[i].balance, '£');
      billsData[i].tags = billsData[i].tags.join(' | ');
    }

    return (
      <div className="monthly-statements">
        <div className="container">

          {/* Header */}

          <div className="row">
            <div className="page-header">
              <h4>Monthly Statement</h4>
              <h1>
                {statementDate}
                <div className="pull-right">
                  <Dropdown
                    label="Select a statement"
                    items={monthlyStatements}
                    onSelect={statement => this.loadStatement(statement)}
                  />
                </div>
              </h1>
            </div>
          </div>

          {/* Overview */}

          <div className="row">
            <h3>Overview</h3>
            {statement === monthlyStatements[0].id
              ? <div className="well">
                  <div className="row">
                    <div className="col-sm-6 big-number">
                      <h4>Current Account Balance</h4>
                      <h1 className={currentBalClass}>
                        {formatToCurrency(currentBal, '£')}
                      </h1>
                    </div>
                    <div className="col-sm-6 big-number">
                      <h4>Bills Account Balance</h4>
                      <h1 className={billsBalClass}>
                        {formatToCurrency(billsBal, '£')}
                      </h1>
                    </div>
                  </div>
                </div>
              : null}
            <div className="well">
              <div className="row">
                <div className="col-sm-4 big-number">
                  <h4>Money In</h4>
                  <h1 className="text-primary no-margin">
                    {formatToCurrency(monthlyBudget, '£')}
                  </h1>
                  {extraBudget > 0
                    ? <h3 className="text-danger">
                        +{formatToCurrency(extraBudget, '£')}
                      </h3>
                    : null}
                </div>
                <div className="col-sm-4 big-number">
                  <h4>Budget Disparity</h4>
                  <h1 className={disparityClass}>
                    {formatToCurrency(disparity, '£')}
                  </h1>
                </div>
                <div className="col-sm-4 big-number">
                  <h4>Money Out</h4>
                  <h1 className="text-danger">
                    {formatToCurrency(moneyOut, '£')}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Money Out Analysis */}

          <div className="row"><hr /></div>
          <div className="row">
            <h3>Money Out Analysis</h3>
            <MonthlyBreakdown
              transactions={allTransactions}
              title="Bills"
              tags={['bill']}
            />
            <MonthlyBreakdown
              transactions={allTransactions}
              title="Groceries"
              tags={['groceries']}
            />
            <MonthlyBreakdown
              transactions={allTransactions}
              title="Household"
              tags={['household', 'amazon']}
            />
            <MonthlyBreakdown
              transactions={allTransactions}
              title="Kids"
              tags={['kids']}
            />
            <MonthlyBreakdown
              transactions={allTransactions}
              title="Car"
              tags={['car']}
            />
            <MonthlyBreakdown
              transactions={allTransactions}
              title="Provisions"
              tags={['provision']}
            />
            <MonthlyBreakdown
              transactions={allTransactions}
              title="Finance"
              tags={['payment', 'cash', 'cheque', 'fees']}
            />
          </div>

          {/* All Transactions */}

          <div className="row"><hr /></div>
          <div className="row">
            <h3>All Transactions</h3>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">Current Account</h4>
              </div>
              <div className="panel-body">
                <Table config={accountConfig} data={currentData} />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">Bills Account</h4>
              </div>
              <div className="panel-body">
                <Table config={accountConfig} data={billsData} />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default MonthlyStatements;
