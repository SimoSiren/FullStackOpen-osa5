import React from 'react'
import PropTypes from 'prop-types'
import '../index.css';

const Notification = ({ message, isPositive }) => {
    if (message === null) {
        return null
    }
    else if (isPositive === true) {
        return (
            <div className="success">
                {message}
            </div>
        )
    }
    else {
        return (
            <div className="error">
                {message}
            </div>
        )
    }
}

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    isPositive: PropTypes.bool.isRequired
}

export default Notification