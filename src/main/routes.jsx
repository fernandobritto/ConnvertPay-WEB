import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/home'
import UserApi from '../components/user'
import DebtApi from '../components/debt'

/*Mapeamento dos links aos componentes*/
export default props =>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={UserApi} />
        <Route exact path="/debts" component={DebtApi} />
        <Redirect from="*" to="/" />
    </Switch>


