import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import Breadcrumbs from 'components/breadcrumbs'
import FilterBoxes from 'components/filter-boxes'
import FilterTags from 'components/filter-tags'
import Pagination from 'components/pagination'
import QualityPopover from 'components/quality-popover'
import QuickSearchBox from 'components/quick-search-box'
import SiteBanner from 'components/site-banner'
import SortSection from 'components/sort-section'
import RepoCard from 'components/repo-card'
import { refreshView, scrollToTopOfResults } from 'utils/other'
import { some } from '@code.gov/cautious'
import { getReposCount } from '../../utils/repos-count'

export default class BrowseProjects extends React.Component {
  componentDidMount() {
    refreshView()
    if (!this.props.filterData) this.props.saveFilterData()
  }

  onFilterBoxChange(category, values) {
    scrollToTopOfResults()
    this.props.onFilterBoxChange(category, values)
  }

  get repoCounter() {
    const { total } = this.props

    const messages = {
      default: 'Loading Repositories',
      '0': 'No Repositories',
      '1': '1 Repository',
      '2': `[VALUE] Repositories`
    }

    return getReposCount(total, messages, 'repos-count grid-col')
  }

  get reposContainer() {
    if (some(this.props.repos)) {
      try {
        return (
          <div>
            <QualityPopover />
            <ul className="usa-card-group padding-top-2">
              {this.props.repos.map(repo => (
                <RepoCard key={repo.repoID} repo={repo} />
              ))}
            </ul>
          </div>
        )
      } catch (error) {
        console.error('reposContainer error with this.props.repos', this.props.repos)
        throw error
      }
    }
  }

  updatePage(newPage) {
    scrollToTopOfResults()
    this.props.updatePage(newPage)
  }

  render() {
    const numPages = Math.ceil(this.props.total / this.props.selectedPageSize)
    return (
      <div className="search-results-content">
        <SiteBanner title="Browse Projects" />
        <Breadcrumbs crumbs={[{ text: 'Home', to: '/' }, { text: 'Browse Projects' }]} />
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <div className="margin-top-2 tablet:grid-col-3">
              <QuickSearchBox />
            </div>
            {ReactHtmlParser(this.repoCounter)}
          </div>
        </div>
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <div id="filter-boxes-section" className="tablet:grid-col-3 margin-top-4">
              <h2>Filter</h2>

              <FilterBoxes
                boxes={this.props.boxes}
                config={[
                  ['Language', 'languages'],
                  ['Federal Agency', 'agencies'],
                  ['Licenses', 'licenses'],
                  ['Usage Types', 'usageTypes']
                ]}
                onFilterBoxChange={::this.onFilterBoxChange}
              />
            </div>
            <div id="filter-results-section" className=" tablet:grid-col-9">
              <SortSection
                options={this.props.sortOptions}
                onSortChange={this.props.onSortChange}
              />
              <FilterTags filters={this.props.filterTags} onClick={::this.props.onFilterTagClick} />
              <div className="card-list">
                {this.reposContainer}
                {numPages > 0 && (
                  <Pagination
                    count={this.props.total}
                    pagesize={this.props.selectedPageSize}
                    page={this.props.selectedPage}
                    updatePage={::this.updatePage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
