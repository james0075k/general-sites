"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BsPencil, BsTrash, BsBoxSeam, BsX, BsCheck2 } from "react-icons/bs";

interface Props {
  productId: string;
  productName: string;
  currentStock: number;
  onDelete: (id: string) => void;
  onStockUpdate: (id: string, newStock: number) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function AdminProductActions({
  productId,
  productName,
  currentStock,
  onDelete,
  onStockUpdate,
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockInput, setStockInput] = useState(String(currentStock));
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [stockSuccess, setStockSuccess] = useState(false);

  const handleDelete = () => {
    // DELETE /api/products/:id
    setDeleteSuccess(true);
    setTimeout(() => {
      onDelete(productId);
      setShowDeleteConfirm(false);
    }, 700);
  };

  const handleStockSave = () => {
    const val = parseInt(stockInput, 10);
    if (isNaN(val) || val < 0) return;
    // PATCH /api/products/:id/stock
    onStockUpdate(productId, val);
    setStockSuccess(true);
    setTimeout(() => {
      setStockSuccess(false);
      setShowStockModal(false);
    }, 800);
  };

  return (
    <>
      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="Edit product"
          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-text-secondary bg-surface-low hover:bg-blue-50 hover:text-blue-600 px-2 py-1.5 rounded-lg transition-colors"
        >
          <BsPencil size={12} />
          Edit
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowStockModal(true)}
          title="Manage stock"
          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-text-secondary bg-surface-low hover:bg-emerald-50 hover:text-emerald-600 px-2 py-1.5 rounded-lg transition-colors"
        >
          <BsBoxSeam size={12} />
          Stock
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete product"
          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-text-secondary bg-surface-low hover:bg-red-50 hover:text-red-600 px-2 py-1.5 rounded-lg transition-colors"
        >
          <BsTrash size={12} />
          Delete
        </motion.button>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleteSuccess && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease }}
              className="bg-surface rounded-2xl shadow-lg border border-border p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {deleteSuccess ? (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3"
                  >
                    <BsCheck2 size={24} className="text-emerald-600" />
                  </motion.div>
                  <p className="font-semibold text-text-primary">Product deleted</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-primary">Delete Product</h3>
                    <button onClick={() => setShowDeleteConfirm(false)} className="text-text-muted hover:text-text-primary">
                      <BsX size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary mb-1">Are you sure you want to delete:</p>
                  <p className="text-sm font-semibold text-text-primary mb-5 line-clamp-2">{productName}</p>
                  <p className="text-xs text-text-muted mb-5">This action cannot be undone.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-surface-low transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleDelete}
                      className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                    >
                      Yes, Delete
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Modal */}
      <AnimatePresence>
        {showStockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => !stockSuccess && setShowStockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease }}
              className="bg-surface rounded-2xl shadow-lg border border-border p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {stockSuccess ? (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3"
                  >
                    <BsCheck2 size={24} className="text-emerald-600" />
                  </motion.div>
                  <p className="font-semibold text-text-primary">Stock updated!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-primary">Manage Stock</h3>
                    <button onClick={() => setShowStockModal(false)} className="text-text-muted hover:text-text-primary">
                      <BsX size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary mb-1 line-clamp-1">{productName}</p>
                  <p className="text-xs text-text-muted mb-4">Current stock: <strong>{currentStock}</strong></p>
                  <label className="text-sm font-medium text-text-primary block mb-2">New Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary bg-surface-low focus:outline-none focus:ring-2 focus:ring-secondary/30 mb-5"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowStockModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-surface-low transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleStockSave}
                      className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors"
                    >
                      Save Stock
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
