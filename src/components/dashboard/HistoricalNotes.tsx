'use client'

import { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { DataView } from 'primereact/dataview'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'
import { HistoricalNote } from '@/types'
import { storageUtils } from '@/utils/storage'
import { dateUtils } from '@/utils/date'

interface HistoricalNotesProps {
  notes: HistoricalNote[]
  onNotesChange: () => void
}

export const HistoricalNotes = ({
  notes,
  onNotesChange,
}: HistoricalNotesProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingNote, setEditingNote] = useState<HistoricalNote | null>(null)
  const [formData, setFormData] = useState({
    symbol: '',
    note: '',
    type: 'note' as 'buy' | 'sell' | 'hold' | 'note',
  })

  const noteTypes = [
    { label: 'Note', value: 'note' },
    { label: 'Buy Signal', value: 'buy' },
    { label: 'Sell Signal', value: 'sell' },
    { label: 'Hold', value: 'hold' },
  ]

  const handleAddNote = () => {
    if (formData.symbol.trim() && formData.note.trim()) {
      storageUtils.addHistoricalNote(
        formData.symbol,
        formData.note,
        formData.type
      )
      setFormData({ symbol: '', note: '', type: 'note' })
      setShowAddDialog(false)
      onNotesChange()
    }
  }

  const handleEditNote = () => {
    if (editingNote && formData.symbol.trim() && formData.note.trim()) {
      storageUtils.updateHistoricalNote(editingNote.id, {
        symbol: formData.symbol,
        note: formData.note,
        type: formData.type,
      })
      setFormData({ symbol: '', note: '', type: 'note' })
      setEditingNote(null)
      onNotesChange()
    }
  }

  const handleDeleteNote = (id: string) => {
    storageUtils.deleteHistoricalNote(id)
    onNotesChange()
  }

  const openEditDialog = (note: HistoricalNote) => {
    setEditingNote(note)
    setFormData({
      symbol: note.symbol,
      note: note.note,
      type: note.type,
    })
  }

  const closeEditDialog = () => {
    setEditingNote(null)
    setFormData({ symbol: '', note: '', type: 'note' })
  }

  const getTypeSeverity = (type: string) => {
    switch (type) {
      case 'buy':
        return 'success'
      case 'sell':
        return 'danger'
      case 'hold':
        return 'warning'
      default:
        return 'info'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'buy':
        return 'Buy Signal'
      case 'sell':
        return 'Sell Signal'
      case 'hold':
        return 'Hold'
      default:
        return 'Note'
    }
  }

  const itemTemplate = (note: HistoricalNote) => {
    return (
      <Card className="mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold">{note.symbol}</h4>
            <span
              className={`px-2 py-1 text-xs rounded-full bg-${getTypeSeverity(
                note.type
              )}-100 text-${getTypeSeverity(note.type)}-800`}
            >
              {getTypeLabel(note.type)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              icon="pi pi-pencil"
              className="p-button-text p-button-sm"
              onClick={() => openEditDialog(note)}
              tooltip="Edit note"
            />
            <Button
              icon="pi pi-trash"
              className="p-button-text p-button-danger p-button-sm"
              onClick={() => handleDeleteNote(note.id)}
              tooltip="Delete note"
            />
          </div>
        </div>
        <p className="text-sm mb-3 whitespace-pre-wrap">{note.note}</p>
        <div className="flex justify-between items-center text-xs">
          <span>Created: {dateUtils.formatDate(note.timestamp)}</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="pi pi-book text-xl dark-blue-glow"></i>
            <h3 className="text-lg font-bold">Historical Notes</h3>
          </div>
          <Button
            label="Add Note"
            icon="pi pi-plus"
            onClick={() => setShowAddDialog(true)}
            className="p-button-sm"
          />
        </div>

        <div className="flex-1 ">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <i className="pi pi-book text-4xl mb-4"></i>
              <h4 className="text-lg font-semibold mb-2">No Notes Yet</h4>
              <p className="text-sm mb-4">
                Start documenting your trading observations and insights.
              </p>
              <Button
                label="Add Your First Note"
                icon="pi pi-plus"
                onClick={() => setShowAddDialog(true)}
                className="p-button-primary"
              />
            </div>
          ) : (
            <DataView
              value={notes}
              itemTemplate={itemTemplate}
              layout="list"
              paginator
              rows={5}
              className="h-full"
            />
          )}
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog
        header="Add New Note"
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        style={{ width: '90vw', maxWidth: '500px' }}
        modal
      >
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium mb-2">
              Symbol
            </label>
            <InputText
              id="symbol"
              value={formData.symbol}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  symbol: e.target.value.toUpperCase(),
                })
              }
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Type
            </label>
            <Dropdown
              id="type"
              value={formData.type}
              options={noteTypes}
              onChange={(e) => setFormData({ ...formData, type: e.value })}
              placeholder="Select note type"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              Note
            </label>
            <InputTextarea
              id="note"
              value={formData.note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="Enter your trading notes..."
              rows={6}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              onClick={() => setShowAddDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Add Note"
              onClick={handleAddNote}
              disabled={!formData.symbol.trim() || !formData.note.trim()}
            />
          </div>
        </div>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog
        header="Edit Note"
        visible={!!editingNote}
        onHide={closeEditDialog}
        style={{ width: '90vw', maxWidth: '500px' }}
        modal
      >
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="edit-symbol"
              className="block text-sm font-medium mb-2"
            >
              Symbol
            </label>
            <InputText
              id="edit-symbol"
              value={formData.symbol}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  symbol: e.target.value.toUpperCase(),
                })
              }
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="edit-type"
              className="block text-sm font-medium mb-2"
            >
              Type
            </label>
            <Dropdown
              id="edit-type"
              value={formData.type}
              options={noteTypes}
              onChange={(e) => setFormData({ ...formData, type: e.value })}
              placeholder="Select note type"
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="edit-note"
              className="block text-sm font-medium mb-2"
            >
              Note
            </label>
            <InputTextarea
              id="edit-note"
              value={formData.note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="Enter your trading notes..."
              rows={6}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              onClick={closeEditDialog}
              className="p-button-text"
            />
            <Button
              label="Update Note"
              onClick={handleEditNote}
              disabled={!formData.symbol.trim() || !formData.note.trim()}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
