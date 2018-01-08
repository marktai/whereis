import React from 'react'
import { IndexLink, Link } from 'react-router'
import PropTypes from 'prop-types'
import './PageLayout.scss'

export const PageLayout = ({ children }) => (
  <div className='container text-center'>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName='page-layout__nav-item--active'>Home</IndexLink>
    {' · '}
    <Link to='/login' activeClassName='page-layout__nav-item--active'>Login</Link>
    {' · '}
    <Link to='/counter' activeClassName='page-layout__nav-item--active'>Counter</Link>
    {' · '}
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
