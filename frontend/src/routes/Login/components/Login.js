import React from 'react'
import PropTypes from 'prop-types'

class Login extends React.Component {
  static propTypes = {
    fetchCreds: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }

  render () {
    return (
      <div style={{ margin: '0 auto' }} >
        <h2>Login: </h2>
        <input 
          name='username'
          type='text' 
          value={this.state.username}
          placeholder='Username' 
          onChange={this.handleInputChange}
        />
        <input 
          name='password'
          type='password' 
          value={this.state.password} 
          placeholder='Password' 
          onChange={this.handleInputChange}
        />
        <button className='btn btn-primary' onClick={() => {this.props.fetchCreds(this.state.username, this.state.password)}} style={{margin: '12px'}}>
          Login 
        </button>
      </div>
    )
  }
}

export default Login
