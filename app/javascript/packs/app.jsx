// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import App from './chat'
import { BrowserRouter as Router } from 'react-router-dom'
import 'fontsource-roboto'

const AppRouter = (props) => {
  return (
    <Router>
      <App />
    </Router>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";

  const app = document.createElement('div');
  app.style.height = "100%";

  ReactDOM.render(
    <AppRouter />,
    document.body.appendChild(app),
  )
})
