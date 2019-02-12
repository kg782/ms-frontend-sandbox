import React from 'react';
import * as Table from 'reactabular-table';
import { getJSON } from 'CommonUtil/CommonUtil';
import HeaderLabel from './HeaderLabel';

export default class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      columns: [],
      sortingColumns: {}
    };
    this.getNextDirection = this.getNextDirection.bind(this);
    this.getNextPriority = this.getNextPriority.bind(this);
    this.getSortedRows = this.getSortedRows.bind(this);
    this.handleSortingColumns = this.handleSortingColumns.bind(this);
  }

  componentDidMount() {
    getJSON('/api/table')
      .then(data => {
        this.setState({
          rows: data.rows,
          columns: data.columns.map(column => {
            return {
              ...column,
              header: {
                ...column.header,
                transforms: [
                  this.sortable.bind(this)
                ]
              }
            };
          })
        })
      });
  }

  sortable(label, props) {
    return {
      onClick: (e) => props.column.sortable ? this.handleSortingColumns(props.column.property, e) : null,
      children: (
        <HeaderLabel
          direction={this.state.sortingColumns[label] ? this.state.sortingColumns[label].direction : null}
          priority={this.state.sortingColumns[label] ? this.state.sortingColumns[label].priority : null}
          sortable={props.column.sortable}
        >
          {label}
        </HeaderLabel>
      )
    };
  }

  getNextDirection(direction) {
    const SORT_ORDER = [undefined, 'asc', 'desc'];
    const currentIndex = SORT_ORDER.findIndex(s => s === direction);
    const newIndex = (currentIndex + 1) % SORT_ORDER.length;
    return SORT_ORDER[newIndex];
  };

  getNextPriority(sortingColumns) {
    const priorityPropertyNames = Object.keys(sortingColumns).filter(propertyName => sortingColumns[propertyName].priority !== null)
    if (!priorityPropertyNames.length) return 0;
    let lowestPriority = 0;

    priorityPropertyNames.forEach(propertyName => {
      const priority = sortingColumns[propertyName].priority;

      if (priority > lowestPriority) lowestPriority = priority;
    })
    return lowestPriority + 1;
  }

  getPrioritisedSortingColumnKeys(sortingColumns = {}) {
    return Object.keys(sortingColumns)
      .sort((a, b) => {
        return sortingColumns[a].priority - sortingColumns[b].priority;
      });
  }

  sortByProperty(rows, property, direction) {
    return rows.sort((a, b) => {
      if (a[property] < b[property]) {
        if (direction === 'asc') return -1;
        else if (direction === 'desc') return 1;
      } else if (a[property] > b[property]) {
        if (direction === 'asc') return 1;
        else if (direction === 'desc') return -1;
      }
      return 0;
    })
  }

  getSortedRows(rows, sortingColumns) {
    const prioritisedKeys = this.getPrioritisedSortingColumnKeys(sortingColumns);
    return prioritisedKeys.reduce((sortedRows, sortingColumnKey) => {
      return this.sortByProperty(sortedRows, sortingColumnKey, sortingColumns[sortingColumnKey].direction);
    }, rows.slice(0));
  }

  handleSortingColumns(propertyName, e) {
    // Adding meta key for OSX
    if (e.ctrlKey || e.metaKey) {
      // Remove all normal sorting columns.
      const sortingColumns = Object.keys(this.state.sortingColumns)
        .filter(key => typeof this.state.sortingColumns[key].priority === 'number')
        .reduce((prev, key) => {
          prev[key] = this.state.sortingColumns[key];
          return prev;
        }, {});

      // If it's already in sortingColumns
      if (sortingColumns[propertyName]) {
        sortingColumns[propertyName].direction = sortingColumns[propertyName].direction === 'asc' ? 'desc' : 'asc';
      } else {
        const nextPriority = this.getNextPriority(sortingColumns);
        sortingColumns[propertyName] = {
          direction: 'asc',
          priority: nextPriority
        };
      }
      this.setState({
        sortingColumns
      });
    } else {
      const sortingProperty = this.state.sortingColumns[propertyName];
      const nextDirection = this.getNextDirection(sortingProperty ? sortingProperty.direction : undefined);
      const sortingColumns = nextDirection ? { [propertyName]: { priority: null, direction: nextDirection } } : {};
      this.setState({ sortingColumns });
    }
  }

  render() {
    return (
      <Table.Provider
        className="table table-striped table-bordered"
        columns={this.state.columns}>
        <Table.Header />
        <Table.Body rows={this.getSortedRows(this.state.rows, this.state.sortingColumns)} rowKey="id" />
      </Table.Provider>
    );
  }
}
