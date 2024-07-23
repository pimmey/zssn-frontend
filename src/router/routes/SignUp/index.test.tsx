import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Mock, beforeEach, describe, it, vi } from 'vitest'

import {
  InventoryItemsService,
  SurvivorsService
} from '~/data/__generated__'

import SignUp from './index'

// Mock the InventoryItemsService and SurvivorsService
vi.mock('~/data/__generated__', () => ({
  InventoryItemsService: {
    getInventoryItems: vi.fn()
  },
  SurvivorsService: {
    createSurvivor: vi.fn().mockResolvedValue({ id: 1 })
  }
}))

const queryClient = new QueryClient()

describe('SignUp Component', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('renders the SignUp form and submits successfully', async () => {
    ;(
      InventoryItemsService.getInventoryItems as Mock
    ).mockResolvedValueOnce([
      {
        name: 'water',
        points: 1,
        id: 1
      },
      {
        name: 'food',
        points: 3,
        id: 2
      },
      {
        name: 'medication',
        points: 2,
        id: 3
      },
      {
        name: 'ammunition',
        points: 1,
        id: 4
      }
    ])

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Fill out the form fields
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John' }
    })
    fireEvent.change(screen.getByTestId('age-input'), {
      target: { value: 30 }
    })
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: 'male' }
    })
    fireEvent.change(screen.getByTestId('latitude-input'), {
      target: { value: 1.123456 }
    })
    fireEvent.change(screen.getByTestId('longitude-input'), {
      target: { value: 1.123456 }
    })

    // Fill out the inventory items
    await waitFor(() => {
      expect(screen.getByText(/water/i)).toBeInTheDocument()
      expect(screen.getByText(/food/i)).toBeInTheDocument()
      expect(screen.getByText(/medication/i)).toBeInTheDocument()
      expect(screen.getByText(/ammunition/i)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByTestId('quantity-input-0'), {
      target: { value: 5 }
    })
    fireEvent.change(screen.getByTestId('quantity-input-1'), {
      target: { value: 5 }
    })
    fireEvent.change(screen.getByTestId('quantity-input-2'), {
      target: { value: 5 }
    })
    fireEvent.change(screen.getByTestId('quantity-input-3'), {
      target: { value: 5 }
    })

    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(SurvivorsService.createSurvivor).toHaveBeenCalledWith({
        requestBody: {
          name: 'John',
          age: 30,
          gender: 'male',
          latitude: 1.123456,
          longitude: 1.123456,
          inventory: [
            { item_id: 1, quantity: 5 },
            { item_id: 2, quantity: 5 },
            { item_id: 3, quantity: 5 },
            { item_id: 4, quantity: 5 }
          ]
        }
      })
    })
  })
})
