import React from 'react'
import PropTypes from 'prop-types'

class Login extends React.Component {
  static propTypes = {
    fetchCreds: PropTypes.func.isRequired,
    refreshCreds: PropTypes.func.isRequired,
    creds_state: PropTypes.object.isRequired,
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

  componentDidMount() {
    const stored_creds_text = localStorage.getItem('creds')
    if (stored_creds_text){
      const stored_creds = JSON.parse(stored_creds_text)
      this.props.refreshCreds(stored_creds.refresh_token)
    }
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
