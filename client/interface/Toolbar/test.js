// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import { addAnchors, selectElements } from 'actions/elements'
import { Button } from 'components'
import Toolbar from '.'
import SelectionSummary from './SelectionSummary'
import ItemPalette from './ItemPalette'

describe('Interface Components', () => {
    describe('Toolbar', () => {
        test('shows a SelectionSummary when there is an anchor selected', () => {
            // a store to test with
            const store = createStore()
            // add an anchor
            store.dispatch(
                addAnchors({
                    id: 1,
                    x: 50,
                    y: 50,
                })
            )

            // render the toolbar
            const wrapper = mount(
                <Provider store={store}>
                    <Toolbar />
                </Provider>
            )

            // expect there to be no anchor summaries
            expect(wrapper.find(SelectionSummary)).toHaveLength(0)

            // select the anchors
            store.dispatch(
                selectElements({
                    type: 'anchors',
                    id: 1,
                })
            )

            // rerender the component since we updated redux
            wrapper.update()

            // expect there to be an anchor summary
            expect(wrapper.find(SelectionSummary)).toHaveLength(1)
        })

        test('shows the item palette when there is no selection', () => {
            // a store to test with
            const store = createStore()
            // render the toolbar
            const wrapper = mount(
                <Provider store={store}>
                    <Toolbar />
                </Provider>
            )

            // there should be an item palette showing
            expect(wrapper.find(ItemPalette)).toHaveLength(1)
        })

        test('has a button to toggle the pattern model', () => {
            // a store to test with
            const store = createStore()
            // save a reference to the default pattern modal state
            const { info: { showPatternModal: defaultState } } = store.getState().diagram
            // render the toolbar
            const wrapper = mount(
                <Provider store={store}>
                    <Toolbar />
                </Provider>
            )

            // find the button that toggles the modal
            const button = wrapper.find(Button)

            // make sure there is only one so we know we're clicking on the right thing
            expect(button).toHaveLength(1)

            // simulate the click
            button.simulate('click')

            // make sure the modal's visibilty has been inverted
            expect(store.getState().diagram.info.showPatternModal).toEqual(!defaultState)
        })
    })
})
