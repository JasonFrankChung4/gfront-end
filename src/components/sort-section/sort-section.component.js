// https://reactjs.org/docs/forms.html

import React, { Component } from 'react'

import { find, map } from '@code.gov/cautious'

export default class SortSection extends Component {
  onSortChange(event) {
    const value = event.target.value
    if (this.props.onSortChange) {
      this.props.onSortChange(value)
    }
  }

  render() {
    console.log('rendering sort-section', this.props.options)
    const selection = find(this.props.options, option => option.selected).value
    return (
      <div className="grid-row">
        <h2>Sort by</h2>
        <form className="usa-form">
          <select
            aria-label="sort"
            onChange={::this.onSortChange}
            value={selection}
            className="usa-select margin-top-2 margin-left-1 radius-md"
          >
            {map(this.props.options, option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </form>
      </div>
    )
  }
}
