import React, { Component } from 'react'

export default class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.value || '' }
    this.textInput = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('click', event => {
      if (this.textInput.current === event.target) {
        if (this.props.onFocus) {
          this.props.onFocus()
        }
      } else if (this.props.onBlur) {
        this.props.onBlur()
      }
    })
  }

  // need to update value when props value changes
  componentDidUpdate(prevProps) {
    const value = this.props.value
    if (value !== prevProps.value) {
      this.setState({ value })
    }
  }

  handleChange(event) {
    const value = event.target.value
    this.setState({ value })
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state.value)
    event.preventDefault()
  }

  render() {
    return (
      <form className="usa-search usa-search--big" onSubmit={::this.handleSubmit}>
        <div role="search">
        <label class="usa-sr-only" for="search-field-big">Search</label>
            <input
              aria-label="search"
              onChange={::this.handleChange}
              placeholder={this.props.placeholder || 'Search Projects...'}
              ref={this.textInput}
              type={this.props.inputType || 'search'}
              value={this.state.value}
              data-testid="input-search-box"
              class="usa-input"
              id="search-field-big"
              name="search"
            />
            <button className="usa-button" type="submit" data-testid="button-search-box"><span class="usa-search__submit-text">Go</span></button>
          </div>
      </form>
      
    )
  }
}
