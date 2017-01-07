// local imports
import {
    selectElements,  SELECT_ELEMENTS,
    clearSelection,  CLEAR_SELECTION,
    mergeElements,   MERGE_ELEMENTS,
    setElementAttrs, SET_ELEMENT_ATTRS,
    deleteElements,  DELETE_ELEMENTS,
} from 'actions/elements'

describe('Action Creators', function() {
    describe('Elements', function() {
        describe('Selection', function() {
            it('select single element', function() {
                // the elements to select
                const selection = {
                    type: 'anchor',
                    id: 1,
                }

                // check the structure of the selection anction
                expect(selectElements(selection)).to.deep.equal({
                    type: SELECT_ELEMENTS,
                    payload: [selection]
                })
            })

            it('select mulitple elements', function() {
                // the elements to select
                const selection = [
                    {
                        type: 'anchor',
                        id: 1,
                    },
                    {
                        type: 'anchor',
                        id: 2,
                    }
                ]

                // check the structure of the selection anction
                expect(selectElements(...selection)).to.deep.equal({
                    type: SELECT_ELEMENTS,
                    payload: selection
                })
            })

            it('clears selection', function() {
                // check the structure of the selection anction
                expect(clearSelection()).to.deep.equal({
                    type: CLEAR_SELECTION,
                })
            })
        })

        describe('Other', function() {
            it('merge elements', function() {
                // just check the type of the action
                expect(mergeElements(1)).to.deep.equal({
                    type: MERGE_ELEMENTS,
                    payload: {
                        id: 1,
                        select: false,
                    }
                })
            })

            it('merge elements with selection', function() {
                // just check the type of the action
                expect(mergeElements(1, true)).to.deep.equal({
                    type: MERGE_ELEMENTS,
                    payload: {
                        id: 1,
                        select: true,
                    }
                })
            })

            it('set single element attrs', function() {
                // the elements to select
                const attr = {
                    id: 2,
                    x: 50,
                }

                // check the structure of the set action
                expect(setElementAttrs(attr)).to.deep.equal({
                    type: SET_ELEMENT_ATTRS,
                    payload: [attr]
                })
            })

            it('set multiple elements attrs', function() {
                // the elements to select
                const attrs = [
                    {
                        id: 1,
                        x: 50,
                    },
                    {
                        id: 2,
                        x: 50,
                    }
                ]

                // check the structure of the set action
                expect(setElementAttrs(...attrs)).to.deep.equal({
                    type: SET_ELEMENT_ATTRS,
                    payload: attrs
                })
            })

            it('can delete single element', function() {
                // the delete payload
                const del = {type: 'anchors', id: 1}
                // test the structure of the action
                expect(deleteElements(del)).to.deep.equal({
                    type: DELETE_ELEMENTS,
                    payload: [del]
                })
            })

            it('can delete multiple elements', function() {
                // the delete payload
                const del = [
                    {type: 'anchors', id: 1},
                    {type: 'anchors', id: 2},
                ]
                // test the structure of the action
                expect(deleteElements(...del)).to.deep.equal({
                    type: DELETE_ELEMENTS,
                    payload: del
                })
            })
        })
    })
})
