import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test('renders content and fires onClick events', () => {
    const blog = {
        title: 'Today´s team leaders',
        author: 'Wayne Grezky',
        likes: 854
    }
    const mockHandler = jest.fn() //button event testausta varten

    const component = render(
        <SimpleBlog blog={blog} onClick={mockHandler} />
    )
    //Kaikissa ao testeissä hyödynnetään classNamea kohdistamiseen.
    const divTitle = component.container.querySelector('.title')
    expect(divTitle).toHaveTextContent(
        'Today´s team leaders'
    )
    const divAuthor = component.container.querySelector('.author')
    expect(divAuthor).toHaveTextContent(
        'Wayne Grezky'
    )
    const divLikes = component.container.querySelector('.likes')
    expect(divLikes).toHaveTextContent(
        854
    )

    const button = component.container.querySelector('.likeButton')
    //tehdään 2 klikkiä
    fireEvent.click(button)
    fireEvent.click(button)
    //odotetaan niin ollen 2x eventtejä
    expect(mockHandler.mock.calls.length).toBe(2)
})
