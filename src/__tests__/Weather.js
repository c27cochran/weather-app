import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import Weather from '../components/Weather';

it('renders without crashing', () => {
  render(<Weather />);
});

it('renders location button', () => {
  const { getByText } = render(<Weather />);
  const locationBtn = getByText(/find me/i);
  expect(locationBtn).toBeInTheDocument();
});

it('renders text input', () => {
  const { getByText } = render(<Weather />);
  const inputElement = getByText(/city/i);
  expect(inputElement).toBeInTheDocument();
});

test('city is set correctly - weather populates', async () => {
    const { container, getByText } = render(<Weather />);
    const cityInput = container.querySelector("#user-city");
    const inputTxt = 'snow';

    fireEvent.change(cityInput, {target: {value: inputTxt}});

    const searchBtn = container.querySelector("#search-weather");
    UserEvent.click(searchBtn);

    await waitFor(() => {
      expect(getByText(/snowing/i)).toBeInTheDocument()
    })
});

test('geolocation works properly', async () => {
  const { container, queryByTestId } = render(<Weather />);
  const locationBtn = container.querySelector("#geolocation-btn");
  UserEvent.click(locationBtn);

  await waitFor(() => {
    expect(queryByTestId(/weather-check/i)).toBeInTheDocument()
  })
});
