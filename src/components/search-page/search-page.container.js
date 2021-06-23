/* global URLSearchParams */

import { connect } from 'react-redux';
import { getConfigValue, getFilterData, getSearchParams, hasLicense, normalize } from 'utils'
import saveFilterOptions from 'actions/save-filter-options'
import updateSearchFilters from 'actions/update-search-filters'
import updatePage from 'actions/update-page'
import SearchPageComponent from './search-page.component'
import get from 'lodash.get'
import { push } from 'connected-react-router'
import { includes, len, overlaps, some } from '@code.gov/cautious'

const mapStateToProps = ({ filters, siteConfig, searchFilters, searchHistory }) => {

  try {

    const currentSearchResults = searchHistory && searchHistory.length ? searchHistory[0] : null

    const query = get(currentSearchResults, 'filters.query')

    const selectedAgencies = normalize(searchFilters ? searchFilters.agencies : [])
    const selectedLicenses = normalize(searchFilters ? searchFilters.licenses : [])
    const selectedLanguages = normalize(searchFilters ? searchFilters.languages : [])
    const selectedUsageTypes = normalize(searchFilters ? searchFilters.usageTypes : [])
    const selectedPage = get(searchFilters, 'page') || 1
    const selectedPageSize = get(searchFilters, 'pageSize') || 10

    let agencies = getFilterData('agencies', 'agency.acronym', currentSearchResults, filters)
    if (agencies) {
      agencies = agencies.map(({name, value}) => {
        return { name, value, checked: includes(selectedAgencies, normalize(value)) }
      })
    }
    let languages = getFilterData('languages', 'languages', currentSearchResults, filters)
    if (languages) {
      languages = languages.map(({name, value}) => {
        return { name, value, checked: includes(selectedLanguages, normalize(value)) }
      })
    }

    let licenses = getFilterData('licenses', 'permissions.licenses[0].name', currentSearchResults, filters)
    if (licenses) {
      licenses = licenses.map(({name, value}) => {
        return { name, value, checked: includes(selectedLicenses, normalize(value)) }
      })
    }

    let usageTypes = getFilterData('licenses', 'permissions.usageType', currentSearchResults, filters)
    if (usageTypes) {
      usageTypes = usageTypes.map(({name, value}) => {
        return { name, value, checked: includes(selectedLicenses, normalize(value)) }
      })
    }

    let total = 0

    let filteredResults
    if (currentSearchResults) {
      filteredResults = currentSearchResults.repos
      .filter(repo => {
        if (filters) {

          if (some(selectedAgencies) && selectedAgencies.includes(normalize(repo.agency.acronym)) === false) {
            return false
          }

          if (some(selectedLanguages) && overlaps(normalize(repo.languages), selectedLanguages)) {
            return false
          }

          if (some(selectedLicenses)) {

            // no licenses assigned on the repo
            if (hasLicense(repo) === false) {
              return false
            }

            const repoLicenses = repo.permissions.licenses.map(license => normalize(license.name))
            if (overlaps(repoLicenses, selectedLicenses)) {
              return false
            }
          }

          const normalizedRepoUsageType = normalize(repo.permissions.usageType)
          if (some(selectedUsageTypes) && selectedUsageTypes.includes(normalizedRepoUsageType) === false) {
            return false
          }

          // don't want to visualize exempt repos
          if (normalizedRepoUsageType.includes('exempt')) {
            return false
          }

          return true
        }

        return false
      })

      total = len(filteredResults)

      filteredResults = filteredResults.slice((selectedPage-1) * selectedPageSize, selectedPage * selectedPageSize)
    }

    return {
      agencies,
      currentSearchResults,
      filteredResults,
      filters,
      languages,
      licenses,
      searchFilters,
      selectedPage,
      selectedPageSize,
      query,
      total,
      usageTypes
    }
  } catch (error) {
    console.error(error)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFilterBoxChange: (category, event) => {
      // we want to make sure we get the event for the filter-box and not its subcomponents
      if (event.target.tagName.toLowerCase() === 'filter-box') {
        const values = event.target.values
        dispatch(updateSearchFilters(category, values))

        const urlSearchParams = new URLSearchParams(window.location.search)
        if (values.length === 0) {
          urlSearchParams.delete(category)
        } else {
          urlSearchParams.set(category, values.join(','))
        }

        const newUrl = window.location.pathname + "?" + urlSearchParams.toString()

        dispatch(push(newUrl))
      }
    },
    saveFilterData: () => dispatch(saveFilterOptions()),
    updatePage: newPage => {
      dispatch(updatePage(newPage))
      dispatch(updateSearchFilters('page', newPage))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPageComponent)
