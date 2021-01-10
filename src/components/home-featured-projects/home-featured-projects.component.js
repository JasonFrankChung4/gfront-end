import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HomeFeaturedProject from '../home-featured-project'


export default class SearchBox extends Component {
  static propTypes = {
    /*    onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        placeholder: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired*/
  }

  render() {
    console.log("this.props for home-feature-projecs:", this.props.featuredProjects)
    return (
      <section className="featured-projects block block--white">
        <div id="featured-projects-title">
          <div className="indented">
            <h2>Featured Projects</h2>
          </div>
        </div>
        <div>
          {this.props.featuredProjects && this.props.featuredProjects.map(project => {
            return <HomeFeaturedProject key={project.short_name} project={project}/>
          })}
        </div>

      </section>
    )
  }
}
