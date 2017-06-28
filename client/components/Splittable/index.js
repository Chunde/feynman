// external imports
import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
// local imports
import { relativePosition, fixPositionToGrid, generateElementId } from 'utils'
import { mergeElements, moveSelectedElements, setElementAttrs, splitElement as split, selectElements as select } from 'actions/elements'
import { commit } from 'actions/history'
import { throttle, fixDeltaToGrid, round } from 'utils'
import { EventListener } from 'components'
import { snapElement, snapPropagator } from './snap'

class Splittable extends React.Component {

    static propsTypes = {
        element: PropTypes.string.isRequired,
        split: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired
    }

    static defaultProps = {
        split: id => id, // default, don't split anything
        snap: () => {}
    }

    state = {
        origin: null,
        moveTarget: null,
        moveType: null
    }

    @autobind
    _mouseDown(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // grab the used props
        let {
            elements,
            element,
            type,
            selectElements,
            splitElement,
            id,
            info,
        } = this.props

        // save a reference to the selected elements
        const selected = elements.selection[type]
        // we need to track if we created a new element
        let action = null

        const origin = {
            x: event.clientX,
            y: event.clientY,
        }

        // if the element is not already part of the selector
        if (!(selected && selected.indexOf(element.id) > -1 )) {
            // if the altkey was held when the drag started
            if (event.altKey) {
                // let the user do what they want (they will return the id to follow)
                splitElement({element, type, location: relativePosition(origin, info)})
                // we created a new element
                action = 'create'
            } else {
                selectElements({id: element.id, type})
            }
        }

        // regardless of what action we are taking on this drag, we have to
        this.setState({
            // track the current location of the mouse
            origin,
            // and the id of the element we are moving
            moveTarget: id,
            moveType: type,
            // track our action
            action,
        })
    }

    @autobind
    _mouseMove(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // get the used props
        const { type, info, elements, element, setElementAttrs, moveSelectedElements } = this.props
        const { origin, moveTarget, moveType } = this.state
        // if the mouse is down
        if (origin) {

            // the mapping of type to snap utils
            const snap = {
                'propagators': snapPropagator,
            }[moveType] || snapElement

            // make sure the element starts from the grid
            snap({id: element.id, elements,  info, setElementAttrs, type: moveType})

            // the location of the mouse in the diagram's coordinate space
            const mouse = {
                x: event.clientX,
                y: event.clientY,
            }

            // the location to move to
            const fixed = fixDeltaToGrid({origin, next: mouse, info})
            const delta = {
                x: (fixed.x - origin.x) / info.zoomLevel,
                y: (fixed.y - origin.y ) / info.zoomLevel,
            }

            // move the selected anchors
            moveSelectedElements(delta)
            // save the current location for the next time we move the element
            this.setState({
                origin: fixed,
                action: this.state.action !== 'create' ? 'move' : 'create'
            })
        }
    }

    @autobind
    _mouseUp(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // used state
        const { action, moveTarget, moveType, origin } = this.state
        // if this component was being dragged
        if (origin && ['move', 'create'].includes(action)) {
            // clean up any overlaps we left
            this.props.mergeElements()
            // log the appropriate commit message
            if (action === 'move') {
                this.props.commitWithMessage(`moved ${moveType}`)
            } else if (action === 'create') {
                this.props.commitWithMessage(`added a branch to ${moveType}`)
            }
        }

        // track the state of the mouse
        this.setState({
            // we are no longer holding the mouse down
            origin: false,
        })
    }

    render() {
        const { children:child, ...unusedProps } = this.props

        return (
            <g onMouseDown={this._mouseDown}>
                <EventListener event="mousemove">
                    {this._mouseMove}
                </EventListener>
                <EventListener event="mouseup">
                    {this._mouseUp}
                </EventListener>
                {React.Children.only(child)}
            </g>
        )
    }
}

const selector = ({diagram: {elements, info}}) => ({elements, info})
const mapDispatchToProps = (dispatch, props) => ({
    moveSelectedElements: move => dispatch(moveSelectedElements(move)),
    // tell the store to merge overlapping elements
    mergeElements: (...args) => dispatch(mergeElements(...args)),
    // split the element if alt is held while dragging
    splitElement: (...args) => dispatch(split(...args)),
    // update particular attributes of elements
    setElementAttrs: (...attrs) => dispatch(setElementAttrs(...attrs)),
    // select elements on a single click (no alt)
    selectElements: (...args) => dispatch(select(...args)),
    // dispatch actions with a commit message
    commitWithMessage: msg => dispatch(commit(msg)),

})
export default connect(selector, mapDispatchToProps)(Splittable)
