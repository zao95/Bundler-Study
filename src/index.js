import React from 'react'
import ReactDOM from "react-dom"

const Component = React.createElement('div', null, `Hello ${this.props.toWhat}`)

ReactDOM.render(
    React.createElement(Component, {toWhat: 'World'}, null),
    document.getElementById('root')
)
