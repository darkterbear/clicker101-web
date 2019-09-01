import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SplashPage from './index/SplashPage'
import LostPage from './index/LostPage'
import LoginPage from './index/LoginPage'
import RegistrationPage from './index/RegistrationPage'
import TeacherClassesPage from './teacher/TeacherClassesPage'

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={SplashPage} />
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/register" component={RegistrationPage} />

					<Route exact path="/teacher/classes" component={TeacherClassesPage} />

					<Route component={LostPage} />
				</Switch>
			</Router>
		)
	}
}
