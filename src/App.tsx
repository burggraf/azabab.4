import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route, Switch } from 'react-router-dom'

import Menu from './components/Menu'
import Dashboard from './pages/Dashboard'

/* Theme variables */
import './theme/variables.css'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
import '@ionic/react/css/display.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/float-elements.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/typography.css'
import Groups from './pages/Groups'
import Group from './pages/Group'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'

setupIonicReact()

const App: React.FC = () => {
	return (
		<IonApp>
			<IonReactRouter>
				<IonSplitPane contentId='main'>
					<Menu />
					<IonRouterOutlet id='main'>
						<Switch>
							<Route path='/' exact={true}>
								<Redirect to='/dashboard' />
							</Route>
							<Route path="/profile" component={Profile} />
							<Route path='/dashboard' exact={true} component={Dashboard} />
							<Route path='/groups' exact={true} component={Groups} />
							<Route path='/group' exact={true} component={Group} />
							<Route path='/group/:id' exact={true} component={Group} />
							<Route path='/privacy' exact={true} component={Privacy} />
							<Route path='/terms' exact={true} component={Terms} />
							<Route component={NotFound} />
						</Switch>
					</IonRouterOutlet>
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	)
}

export default App
