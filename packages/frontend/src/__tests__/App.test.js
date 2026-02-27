import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)' ? false : true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: 'Learn React', dueDate: '2025-12-15', completed: 0, createdAt: '2025-11-01T00:00:00Z' },
        { id: 2, title: 'Build TODO app', dueDate: null, completed: 0, createdAt: '2025-11-02T00:00:00Z' }
      ])
    );
  }),

  rest.post('/api/todos', (req, res, ctx) => {
    const { title, dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Todo title is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        dueDate: dueDate || null,
        completed: 0,
        createdAt: new Date().toISOString()
      })
    );
  }),

  rest.put('/api/todos/:id', (req, res, ctx) => {
    const { title, dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Todo title is required' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(req.params.id),
        title,
        dueDate: dueDate || null,
        completed: 0,
        createdAt: '2025-11-01T00:00:00Z'
      })
    );
  }),

  rest.patch('/api/todos/:id/toggle', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(req.params.id),
        title: 'Test Todo',
        dueDate: null,
        completed: 1,
        createdAt: '2025-11-01T00:00:00Z'
      })
    );
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Todo deleted successfully', id: parseInt(req.params.id) })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorageMock.clear();
});
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the app header with title', async () => {
    render(<App />);
    expect(screen.getByText('My Todos')).toBeInTheDocument();
    expect(screen.getByText('🎃')).toBeInTheDocument();
  });

  test('loads and displays todos', async () => {
    render(<App />);

    expect(screen.getByText('Loading your todos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Build TODO app')).toBeInTheDocument();
    });
  });

  test('creates a new todo', async () => {
    render(<App />);

    // Wait for the initial loading to complete and todos to load
    await waitFor(() => {
      expect(screen.queryByText('Loading your todos...')).not.toBeInTheDocument();
    });

    // Wait for the input to be enabled (no longer disabled during initial load)
    const titleInput = await screen.findByPlaceholderText('Add a new todo...');
    
    // Verify the button shows "Add Todo" (not "Adding...")
    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /Add Todo/ });
      expect(addButton).not.toBeDisabled();
    });

    // Now fill in and submit the form
    fireEvent.change(titleInput, { target: { value: 'New Todo' } });

    const addButton = screen.getByRole('button', { name: /Add Todo/ });
    fireEvent.click(addButton);

    // Wait for the new todo to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  test('toggles todo completion status', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  test('handles API error when fetching todos', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load todos/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no todos', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
    });
  });

  test('toggles theme between light and dark', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    });

    const themeToggle = screen.getByRole('button', { name: /Switch to dark mode/ });
    fireEvent.click(themeToggle);

    expect(localStorage.getItem('todoAppTheme')).toBe('dark');

    const themToggleAfter = screen.getByRole('button', { name: /Switch to light mode/ });
    fireEvent.click(themToggleAfter);
    expect(localStorage.getItem('todoAppTheme')).toBe('light');
  });

  // Integration tests for User Story 3: Real-time overdue indicator updates
  describe('Overdue Indicator Real-time Updates', () => {
    beforeEach(() => {
      // Mock current date to Feb 27, 2026
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27T12:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('overdue indicator disappears when todo is completed', async () => {
      // Setup server to return an overdue todo
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              { id: 1, title: 'Overdue Task', dueDate: '2026-02-20', completed: 0, createdAt: '2026-02-01T00:00:00Z' }
            ])
          );
        }),
        rest.patch('/api/todos/:id/toggle', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: parseInt(req.params.id),
              title: 'Overdue Task',
              dueDate: '2026-02-20',
              completed: 1,
              createdAt: '2026-02-01T00:00:00Z'
            })
          );
        })
      );

      render(<App />);

      // Wait for overdue todo to load and verify indicator is present
      await waitFor(() => {
        expect(screen.getByText('Overdue Task')).toBeInTheDocument();
      });

      // Verify overdue indicator (warning icon) is present
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Toggle the todo to complete
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      // Wait for update and verify indicator is removed
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });

      // Overdue indicator should no longer be present
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('overdue indicator appears when completed todo is unmarked and still past due', async () => {
      // Setup server to return a completed overdue todo
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              { id: 1, title: 'Completed Overdue Task', dueDate: '2026-02-20', completed: 1, createdAt: '2026-02-01T00:00:00Z' }
            ])
          );
        }),
        rest.patch('/api/todos/:id/toggle', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: parseInt(req.params.id),
              title: 'Completed Overdue Task',
              dueDate: '2026-02-20',
              completed: 0,
              createdAt: '2026-02-01T00:00:00Z'
            })
          );
        })
      );

      render(<App />);

      // Wait for completed todo to load
      await waitFor(() => {
        expect(screen.getByText('Completed Overdue Task')).toBeInTheDocument();
      });

      // Verify no overdue indicator for completed todo
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      // Toggle the todo to incomplete
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      // Wait for update and verify indicator appears
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
      });

      // Overdue indicator should now be present
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    test('overdue indicator disappears when due date is changed to future', async () => {
      // Setup server to return an overdue todo
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              { id: 1, title: 'Update Date Task', dueDate: '2026-02-20', completed: 0, createdAt: '2026-02-01T00:00:00Z' }
            ])
          );
        }),
        rest.put('/api/todos/:id', (req, res, ctx) => {
          const { title, dueDate } = req.body;
          return res(
            ctx.status(200),
            ctx.json({
              id: parseInt(req.params.id),
              title,
              dueDate,
              completed: 0,
              createdAt: '2026-02-01T00:00:00Z'
            })
          );
        })
      );

      render(<App />);

      // Wait for overdue todo to load
      await waitFor(() => {
        expect(screen.getByText('Update Date Task')).toBeInTheDocument();
      });

      // Verify overdue indicator is present
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Click edit button
      const editButton = screen.getByLabelText(/Edit "Update Date Task"/);
      fireEvent.click(editButton);

      // Change due date to future
      const dueDateInput = screen.getByLabelText(/Edit due date/);
      fireEvent.change(dueDateInput, { target: { value: '2026-03-15' } });

      // Save the changes
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Wait for update and verify indicator is removed
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });

    test('overdue indicator appears when due date is changed to past', async () => {
      // Setup server to return a todo with future due date
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              { id: 1, title: 'Future Task', dueDate: '2026-03-15', completed: 0, createdAt: '2026-02-01T00:00:00Z' }
            ])
          );
        }),
        rest.put('/api/todos/:id', (req, res, ctx) => {
          const { title, dueDate } = req.body;
          return res(
            ctx.status(200),
            ctx.json({
              id: parseInt(req.params.id),
              title,
              dueDate,
              completed: 0,
              createdAt: '2026-02-01T00:00:00Z'
            })
          );
        })
      );

      render(<App />);

      // Wait for future todo to load
      await waitFor(() => {
        expect(screen.getByText('Future Task')).toBeInTheDocument();
      });

      // Verify no overdue indicator for future todo
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      // Click edit button
      const editButton = screen.getByLabelText(/Edit "Future Task"/);
      fireEvent.click(editButton);

      // Change due date to past
      const dueDateInput = screen.getByLabelText(/Edit due date/);
      fireEvent.change(dueDateInput, { target: { value: '2026-02-20' } });

      // Save the changes
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Wait for update and verify indicator appears
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});