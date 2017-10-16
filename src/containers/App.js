import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Explore from '../'

class App extends React.Component {
    static propTypes = {
        errorMessage: PropTypes.string,
        resetErrorMessage: PropTypes.func.isRequired,
        inputValue: PropTypes.string.isRequired,
        children: PropTypes.node
    }
    handleChange = nextValue => {
        this.props.history.push(`/${nextValue}`)
    }
    render() {
        const { children, inputValue } = this.props;
        return (
            <div>
                <Explore value={inputValue}
                    onChange={this.handleChange}/>
            { children }
            </div>
        )
    }
}

export default App;