import { render, screen } from '@testing-library/react';
import React from 'react';
import ListFriend from './ListFriends';

// Mocking the API
jest.mock('../../api/register.api', () => ({
  getFriends: jest.fn().mockResolvedValue({
    data: [
      {
        id_user: 6,
        first_name: 'Joel',
        last_name: 'Estrada Gonzales',
        birth_date: '2000-02-21',
        personal_description: 'Hola mundo como estan si esta bueno el formulario',
        price: '50.00',
      },
    ]
  })
}));

describe('ListFriend', () => {
  beforeEach(() => {
    render(<ListFriend />);
  });

  // Positive Test
  it('checks if the first name exists in the list', async () => {
    const firstName = 'Joel';
    const isNamePresent = await screen.findByText(firstName);
  
    // Assert
    expect(isNamePresent).toBeInTheDocument();
  });

  // Negative Test
  it('checks if a non-existent name does not appear in the list', async () => {
    const nonExistentName = 'J031#"';
    const isNamePresent = await screen.queryByText(nonExistentName);
  
    // Assert
    expect(isNamePresent).not.toBeInTheDocument();
  });
});
