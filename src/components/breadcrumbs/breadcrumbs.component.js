import React, { Fragment } from 'react'
import CustomLink from 'components/custom-link'

export default function Breadcrumbs({ crumbs }) {
  return (
    <div className="grid-container">
      <ul className="breadcrumbs grid-row margin-top-4">
        {crumbs.map(({ text, to }) => {
          if (to) {
            return (
              <li key={text}>
                <CustomLink to={to}>{text}</CustomLink>
              </li>
            )
          }
          return <li key={text}>{text}</li>
        })}
      </ul>
    </div>
  )
}
