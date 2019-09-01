import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SplashPage from './SplashPage'
import LostPage from './LostPage'
import LoginPage from './LoginPage'
import RegistrationPage from './RegistrationPage'

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={SplashPage} />
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/register" component={RegistrationPage} />
					<Route component={LostPage} />
				</Switch>
			</Router>
		)
	}
}
