import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import SplashPage from './index/SplashPage'
import LostPage from './index/LostPage'
import LoginPage from './index/LoginPage'
import RegistrationPage from './index/RegistrationPage'

import TeacherClassesPage from './teacher/TeacherClassesPage'
import TeacherClassPage from './teacher/TeacherClassPage'
import ProblemSetPage from './teacher/ProblemSetPage'

import StudentClassesPage from './student/StudentClassesPage'
import StudentClassPage from './student/StudentClassPage'
import { defaults } from 'react-chartjs-2'

// defaults.global.defaultFontFamily = 'Grantipo Beta 001'
defaults.global.defaultFontSize = 18

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={SplashPage} />
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/register" component={RegistrationPage} />

					<Route exact path="/teacher/classes" component={TeacherClassesPage} />
					<Route exact path="/teacher/class" component={TeacherClassPage} />
					<Route exact path="/teacher/problem-set" component={ProblemSetPage} />

					<Route exact path="/student/classes" component={StudentClassesPage} />
					<Route exact path="/student/class" component={StudentClassPage} />

					<Route component={LostPage} />
				</Switch>
			</Router>
		)
	}
}
