// components/dashboard/TodoCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';
import { useState } from 'react';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number, isCompleted: boolean) => void;
  onDelete: (id: number) => void;
  onEdit?: (todo: Todo) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const handleToggle = () => {
    onToggle(todo.id, !todo.is_completed);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -100 }}
      className={`
        group relative p-5 rounded-xl border-2 transition-all duration-300
        ${todo.is_completed
          ? 'bg-green-50/50 border-green-200'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          className={`
            mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center
            transition-all duration-300
            ${todo.is_completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {todo.is_completed && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-lg font-semibold transition-all
              ${todo.is_completed
                ? 'text-gray-400 line-through'
                : 'text-gray-900'
              }
            `}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p
              className={`
                mt-1 text-sm transition-all
                ${todo.is_completed
                  ? 'text-gray-400 line-through'
                  : 'text-gray-600'
                }
              `}
            >
              {todo.description}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(todo.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && !todo.is_completed && (
            <motion.button
              onClick={() => onEdit(todo)}
              className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit todo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>
          )}

          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Delete todo"
          >
            {isDeleting ? (
              <motion.div
                className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Completion badge */}
      {todo.is_completed && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
          ✓ Completed
        </div>
      )}
    </motion.div>
  );
};
