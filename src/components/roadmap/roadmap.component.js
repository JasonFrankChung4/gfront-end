import React from 'react'
import Breadcrumbs from 'components/breadcrumbs'
import SiteBanner from 'components/site-banner'
import { normalize, refreshView } from 'utils/other'
import { map } from '@code.gov/cautious'

export const Row = ({ todo }) => {
  let iconClass = 'icon'
  const status = normalize(todo.status)
  if (status === 'released') {
    iconClass += ' icon-ok text-green'
  } else if (status === 'in progress') {
    iconClass += ' icon-circle text-accent-warm-light'
  }

  return (
    <section>
      <div className="grid-row">
        <div className="grid-col-1 padding-top-1 tablet:padding-top-2 padding-left-1">
          <i className={iconClass} aria-label={status} />
        </div>
        <div className="grid-col-11 padding-y-1 padding-x-1 font-body-3xs text-base-dark padding-left-3">
          {todo.name}
        </div>
      </div>
    </section>
  )
}

export const Column = ({ phase, todos }) => (
  <div className="tablet:grid-col">
    <div>
      <h3 className="bg-base-lighter padding-y-2 text-center text-bold text-base-darker border-base-lighter font-body-md radius-top-lg border-1px border-bottom-0">
        {phase}
      </h3>
      <div className="radius-bottom-lg margin-top-0 padding-y-1 padding-x-05 border-1px border-top-0 border-base-lighter">
        <span>
          {map(todos, todo => (
            <Row key={todo.name} todo={todo} />
          ))}
        </span>
      </div>
    </div>
  </div>
)

export default class Roadmap extends React.Component {
  componentDidMount() {
    refreshView()
  }

  get overview() {
    return (
      <div className="margin-top-3">
        <h3 className="font-heading-lg text-bold">Overview</h3>
        {map(this.props.overview, paragraph => (
          <p
            className="maxw-none"
            key={paragraph}
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
      </div>
    )
  }

  render() {
    return (
      <div id="main-content">
        <SiteBanner title="Roadmap" />
        <Breadcrumbs crumbs={[{ text: 'Home', to: '/' }, { text: 'Roadmap' }]} />

        <div className="grid-container">
          {this.overview}

          <div>
            <h3 className="margin-top-4 font-heading-lg text-bold">Roadmap</h3>
          </div>

          <section className="grid-container padding-0">
            <div className="grid-row grid-gap padding-top-3">
              <Column phase="Near-term" todos={this.props.near} />
              <Column phase="Mid-term" todos={this.props.mid} />
              <Column phase="Long-term" todos={this.props.long} />
            </div>
          </section>

          <section
            className="grid-container margin-top-205 margin-bottom-5 padding-0"
            aria-hidden="true"
          >
            <div className="grid-row border-0 padding-bottom-0" aria-label="green check mark icon">
              <i className="icon icon-ok text-green" aria-hidden="true" />
              <span className="border-0 font-body-3xs padding-left-1 padding-bottom-0 text-base-dark">
                Released
              </span>
            </div>
            <div className="grid-row border-0 padding-top-05" aria-label="yellow circle icon">
              <i
                className="icon icon-circle text-accent-warm-light padding-top-05"
                aria-hidden="true"
              />
              <span className="border-0 font-body-3xs padding-left-1 padding-top-05 text-base-dark">
                In Progress
              </span>
            </div>
          </section>

          <div className="margin-y-3">
            <h3 className="font-heading-lg text-bold">Disclaimer</h3>
            <p className="maxw-none">{this.props.disclaimer}</p>
          </div>
        </div>
      </div>
    )
  }
}
