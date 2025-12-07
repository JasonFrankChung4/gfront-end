import React, { Component, Fragment } from 'react'
import { loadScript } from 'utils/other'
import LazyHTML from 'components/lazy-html'
import client from 'api-client'

const onDashboard = [
  'DHS',
  'DOC',
  'DOD',
  'DOE',
  'DOI',
  'DOJ',
  'DOL',
  'DOS',
  'DOT',
  'ED',
  'EPA',
  'GSA',
  'HHS',
  'HUD',
  'NASA',
  'NRC',
  'NSF',
  'OPM',
  'SBA',
  'SSA',
  'TREASURY',
  'USAID',
  'USDA',
  'VA'
]

const dataurl = `${PUBLIC_PATH}src/components/about-page/html/`

const configJSON = {
  scores: {
    compliant: [1, null],
    partial: [0.25, 0.9999999],
    noncompliant: [null, 0.244444444]
  },
  text: [
    {
      req: 'agencyWidePolicy',
      variants: {
        compliant: 'Agency policy is consistent with the Federal Source Code Policy.',
        noncompliant:
          'Agency policy has not been reviewed for consistency with the Federal Source Code Policy.',
        partial:
          'Agency policy is being updated for consistency with the Federal Source Code Policy.'
      }
    },
    {
      req: 'openSourceRequirement',
      variants: {
        compliant: 'Agency has open sourced greater than 20% of their custom developed code.',
        noncompliant: 'Agency has open sourced less than 10% of their custom developed code.',
        partial: 'Agency has open sourced greater than 10% of their custom developed code.'
      }
    },
    {
      req: 'inventoryRequirement',
      variants: {
        compliant: 'Agency has inventoried 100% of new custom code.',
        noncompliant: 'Agency has inventoried less than 50% of new custom code.',
        partial: 'Agency has inventoried more than 50% of new custom code.'
      }
    }
  ]
}

class ComplianceDashboard extends Component {
  constructor(props) {
    super(props)
    this.loading = false
    this.state = {}
  }

  componentDidMount() {
    if (!this.loading) {
      const webcomponent = customElements.get('compliance-dashboard')
      if (!webcomponent) {
        loadScript(`${PUBLIC_PATH}webcomponents/compliance-dashboard.js`, true)
      }
      client.getCompliance().then(compliance => {
        compliance = compliance.filter(agency => onDashboard.includes(agency.acronym))
        compliance.forEach(agency => {
          agency.img = `${PUBLIC_PATH}assets/img/logos/agencies/${agency.acronym}-50x50.png`
        })
        this.setState({ compliance })
      })
    }
  }

  render() {
    return (
      <Fragment>
        <LazyHTML url={`${dataurl}compliance/agency-compliance.html`} />
        <compliance-dashboard
          id="compliance-dashboard"
          config={JSON.stringify(configJSON)}
          data={JSON.stringify(this.state.compliance)}
        />
      </Fragment>
    )
  }
}

export default ComplianceDashboard
