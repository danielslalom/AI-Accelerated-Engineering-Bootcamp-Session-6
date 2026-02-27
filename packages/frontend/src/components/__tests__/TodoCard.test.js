import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

// Mock isOverdue utility
jest.mock('../../services/todoService', () => ({
  ...jest.requireActual('../../services/todoService'),
  isOverdue: jest.fn(),
}));

import { isOverdue } from '../../services/todoService';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  // Overdue indicator tests (User Story 1)
  describe('Overdue Indicator', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should display warning icon when todo is overdue', () => {
      isOverdue.mockReturnValue(true);
      const overdueTodo = { ...mockTodo, completed: 0, dueDate: '2026-02-20' };
      
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('⚠️');
    });

    it('should apply todo-overdue CSS class when overdue', () => {
      isOverdue.mockReturnValue(true);
      const overdueTodo = { ...mockTodo, completed: 0, dueDate: '2026-02-20' };
      
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const title = container.querySelector('.todo-title');
      expect(title).toHaveClass('todo-overdue');
    });

    it('should not display warning icon when todo is not overdue', () => {
      isOverdue.mockReturnValue(false);
      const notOverdueTodo = { ...mockTodo, completed: 0, dueDate: '2026-03-10' };
      
      render(<TodoCard todo={notOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should have proper ARIA attributes on overdue icon', () => {
      isOverdue.mockReturnValue(true);
      const overdueTodo = { ...mockTodo, completed: 0, dueDate: '2026-02-20' };
      
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-label', 'Overdue');
    });

    it('should display both overdue indicator and due date', () => {
      isOverdue.mockReturnValue(true);
      const overdueTodo = { ...mockTodo, completed: 0, dueDate: '2026-02-20' };
      
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      // Both indicator and due date should be visible
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/February.*20.*2026/i)).toBeInTheDocument();
    });
  });
});
