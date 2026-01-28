// components/dashboard/AddTodoModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AnimatedButton } from '../ui/AnimatedButton';
import { CreateTodoDTO } from '@/types/todo';

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTodoDTO) => Promise<any>;
}

export const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined
      });
      // Reset form
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      // Error is handled by useTodos hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Todo</h2>
                  <p className="text-sm text-gray-600 mt-1">Add a task to your list</p>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isSubmitting}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Buy groceries"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none disabled:bg-gray-100"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <AnimatedButton
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    type="submit"
                    variant="gradient"
                    disabled={!title.trim() || isSubmitting}
                    loading={isSubmitting}
                    className="flex-1"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                  >
                    Create Todo
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
