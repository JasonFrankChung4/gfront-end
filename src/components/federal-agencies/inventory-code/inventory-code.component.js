import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import InventoryCodeSectionComponent from './inventory-code-section.component'
import InventoryCodeDetailsComponent from './inventory-code-details.component'

class InventoryCodeComponent extends Component {
  state = {
    optionalFields: false,
    details: false
  }

  toggleOptionalFields = () => {
    this.setState(state => ({ optionalFields: !state.optionalFields }))
  }

  toggleDetails = value => {
    this.setState({ details: value ? { ...value } : false })
  }

  renderIntro = () => (
    <>
      <div style={{ marginBottom: '10px' }}>
        <input
          id="json-schema-hide-optional-fields"
          type="checkbox"
          style={{ cursor: 'pointer', textAlign: 'left' }}
          onClick={this.toggleOptionalFields}
        />
        <label htmlFor="json-schema-hide-optional-fields" style={{ cursor: 'pointer' }}>
          Hide optional fields
        </label>
      </div>
      {/* <form className="usa-form">
        <div className="usa-checkbox">
          <input
            className="usa-checkbox__input"
            id="hide-optional-fields"
            type="checkbox"
            value="hide-optional-fields"
            onClick={this.toggleOptionalFields}
          />
          <label className="usa-checkbox__label" htmlFor="hide-optional-fields">
            Hide Optional Fields
          </label>
        </div>
      </form> */}
    </>
  )

  render() {
    const { schema } = this.props
    const { optionalFields, details } = this.state

    return (
      <div
        id="schema-viewer"
        className={`margin-top-4 ${classNames({
          'hide-optional-fields': !optionalFields,
          'hide-details': !details
        })}`}
      >
        {this.renderIntro()}
        <div className="desktop-and-mobile-views">
          {details && (
            <InventoryCodeDetailsComponent toggleDetails={this.toggleDetails} details={details} />
          )}
          <InventoryCodeTableComponent>
            {schema.properties &&
              Object.entries(schema.properties).map((entry, index) => (
                <InventoryCodeSectionComponent
                  key={index} // eslint-disable-line react/no-array-index-key
                  entry={entry}
                  isRequired={schema.required.includes(entry[0])}
                  toggleDetails={this.toggleDetails}
                  optionalToggle={optionalFields}
                />
              ))}
          </InventoryCodeTableComponent>
        </div>
      </div>
    )
  }
}

const InventoryCodeTableComponent = ({ children }) => (
  <table>
    <thead>
      <tr>
        <th className="field-name-column">Field Name</th>
        <th className="data-type-column">Data Type</th>
        <th className="description-column">Description</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
  // <ul className="usa-card-group margin-top-3">{children}</ul>
)

InventoryCodeComponent.propTypes = {
  schema: PropTypes.PropTypes.shape({
    $schema: PropTypes.string,
    additionalProperties: PropTypes.bool,
    description: PropTypes.string,
    properties: PropTypes.shape({
      version: PropTypes.object,
      measurementType: PropTypes.object,
      agency: PropTypes.object,
      releases: PropTypes.object
    }),
    required: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    type: PropTypes.string
  }).isRequired
}

export default InventoryCodeComponent
