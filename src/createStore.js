/* @flow */
import React, { createContext, Component } from 'react'

import validateStore from './validateStore'

type InterfaceShape = {
  Consumer: any,
  Provider: any,
}

type OptionsType = {
  model?: any,
  actions?: Object,
}

export default function createStore(
  options: OptionsShape = {}
): InterfaceShape {
  const Store = createContext()

  const actions = options.actions || {}

  return {
    Provider: class Provider extends Component {
      state: {
        state: any,
        actions: Object,
      }

      constructor(props, context) {
        super(props, context)

        const initialState = props.initialState || options.model
        const resolvedActions = Object.keys(actions).reduce((map, name) => {
          map[name] = payload =>
            this.setState(oldState => ({
              state: actions[name](oldState.state, payload),
            }))

          return map
        }, {})

        this.state = {
          state: initialState,
          actions: resolvedActions,
        }
      }

      render() {
        return (
          <Store.Provider value={this.state}>
            {this.props.children}
          </Store.Provider>
        )
      }
    },

    Consumer: ({ children }) => (
      <Store.Consumer>
        {store => validateStore(store) && children(store.state, store.actions)}
      </Store.Consumer>
    ),
  }
}
