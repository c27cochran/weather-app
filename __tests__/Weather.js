import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import Weather from '../src/components/Weather';

test('renders location button', () => {
  const { getByText } = render(<Weather />);
  const linkElement = getByText(/find me/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders text input', () => {
  const { getByText } = render(<Weather />);
  const linkElement = getByText(/city/i);
  expect(linkElement).toBeInTheDocument();
});
