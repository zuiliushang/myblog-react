import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom';


const Root  = ({ store }) => (
    <Provider store={store}>
        <div>
            <Route path="/" component={App}/>
            <Route path="/:login/:name"
                component={UserInfo}/>
        </div>
    </Provider>
)