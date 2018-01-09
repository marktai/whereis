import React from 'react'
import { IndexLink, Link } from 'react-router'
import PropTypes from 'prop-types'
import './PageLayout.scss'

export const PageLayout = ({ children }) => (
  <div className='container text-center'>
    <h1>Bad Chess.  It's really bad.</h1>
    {/*<IndexLink to='/' activeClassName='page-layout__nav-item--active'>Home</IndexLink>
    {' · '}*/}
    <IndexLink to='/login' activeClassName='page-layout__nav-item--active'>Login</IndexLink>
    {' · '}
    {/*<Link to='/counter' activeClassName='page-layout__nav-item--active'>Counter</Link>
    {' · '}*/}
    <Link to='/game/15' activeClassName='page-layout__nav-item--active'>Game</Link>
    <div className='page-layout__viewport'>
      {children}
    </div>
  </div>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
