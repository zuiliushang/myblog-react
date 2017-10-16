import React from 'react';
import PropTypes from 'prop-types';

export default class Explore extends React.Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value !== this.props.value){
            this.setInputValue(nextProps.value);
        }
    }
    getInputValue = () => {
        return this.input.value;
    }
    setInputValue = (value) => {
        this.input.value = value;
    }
    handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            this.handleGoClick();
        }
    }
    handleGoClick = () => {
        this.props.onChange(this.getInputValue())
    }

    render() {
        return (
            <div>
                <p>Type a username or repo full name and hit 'Go':</p>
                <input size="45"
                       ref={(input) => this.input = input}
                       defaultValue={this.props.value}
                       onKeyUp={this.handleKeyUp}
                />
                <button onClick={this.handleGoClick}>
                    Go
                </button>
            </div>
        );
    }
}