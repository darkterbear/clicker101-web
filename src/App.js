import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SplashPage from './SplashPage'

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={SplashPage} />
					{/* <Route component={LostPage} /> */}
				</Switch>
			</Router>
		)
	}
}
