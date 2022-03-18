import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.getByText(/contact form/i);
    expect(header).toBeTruthy();
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)
    const field = screen.getByLabelText(/First Name*/i);

    userEvent.type(field, "123");
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const button = screen.getByText(/submit/i);
    userEvent.click(button);
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
    
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const first = screen.getByPlaceholderText(/Edd/i);
    const last = screen.getByPlaceholderText(/Burke/i);
    const button = screen.getByText(/submit/i);
    userEvent.type(first, 'Billy');
    userEvent.type(last, 'Goehring');
    userEvent.click(button);
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const email = screen.getByLabelText(/Email*/i);
    userEvent.type(email, 'jimmy');
    const errorMessage = await screen.getByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const first = screen.getByPlaceholderText(/Edd/i);
    const email = screen.getByLabelText(/Email*/i);
    const button = screen.getByText(/submit/i);
    userEvent.type(first, 'Billy');
    userEvent.type(email, 'billy.goehring@gmail.com');
    userEvent.click(button);
    const errorMessage = await screen.getByText(/is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    const first = screen.getByPlaceholderText(/Edd/i);
    const last = screen.getByPlaceholderText(/Burke/i);
    const email = screen.getByLabelText(/Email*/i);
    const button = screen.getByText(/submit/i);
    userEvent.type(first, 'Billy');
    userEvent.type(last, 'Goehring');
    userEvent.type(email, 'billy.goehring@gmail.com');
    userEvent.click(button);
    const messageDisplay = await screen.queryByText(/message:/i);
    expect(messageDisplay).not.toBeTruthy();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)
    const first = screen.getByPlaceholderText(/Edd/i);
    const last = screen.getByPlaceholderText(/Burke/i);
    const email = screen.getByLabelText(/Email*/i);
    const button = screen.getByText(/submit/i);
    const message = screen.getByLabelText(/message/i);
    userEvent.type(first, 'Billy');
    userEvent.type(last, 'Goehring');
    userEvent.type(email, 'billy.goehring@gmail.com');
    userEvent.type(message, 'hello there my friends');
    userEvent.click(button);
    const firstDisplay = await screen.getByTestId(/firstnamedisplay/i);
    const lastDisplay = await screen.getByTestId(/lastnamedisplay/i);
    const emailDisplay = await screen.getByTestId(/emaildisplay/i);
    const messageDisplay = await screen.getByTestId(/messagedisplay/i);
    expect(firstDisplay).toBeInTheDocument();
    expect(lastDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(messageDisplay).toBeInTheDocument();
});
