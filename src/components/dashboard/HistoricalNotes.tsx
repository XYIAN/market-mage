'use client'

import { useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dialog } from 'primereact/dialog'
import { DataView } from 'primereact/dataview'
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
    title: '',
    content: '',
  })

  const handleAddNote = () => {
    if (formData.title.trim() && formData.content.trim()) {
      storageUtils.addHistoricalNote(
        formData.title.trim(),
        formData.content.trim()
      )
      setFormData({ title: '', content: '' })
      setShowAddDialog(false)
      onNotesChange()
    }
  }

  const handleEditNote = () => {
    if (editingNote && formData.title.trim() && formData.content.trim()) {
      storageUtils.updateHistoricalNote(
        editingNote.id,
        formData.title.trim(),
        formData.content.trim()
      )
      setFormData({ title: '', content: '' })
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
      title: note.title,
      content: note.content,
    })
  }

  const closeEditDialog = () => {
    setEditingNote(null)
    setFormData({ title: '', content: '' })
  }

  const itemTemplate = (note: HistoricalNote) => {
    return (
      <Card className="mb-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-semibold">{note.title}</h4>
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
        <p className="text-sm mb-3 whitespace-pre-wrap">{note.content}</p>
        <div className="flex justify-between items-center text-xs">
          <span>Created: {dateUtils.formatDate(note.createdAt)}</span>
          {note.updatedAt !== note.createdAt && (
            <span>Updated: {dateUtils.formatDate(note.updatedAt)}</span>
          )}
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
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <InputText
              id="title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter note title"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <InputTextarea
              id="content"
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, content: e.target.value })
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
              disabled={!formData.title.trim() || !formData.content.trim()}
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
              htmlFor="edit-title"
              className="block text-sm font-medium mb-2"
            >
              Title
            </label>
            <InputText
              id="edit-title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter note title"
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="edit-content"
              className="block text-sm font-medium mb-2"
            >
              Content
            </label>
            <InputTextarea
              id="edit-content"
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, content: e.target.value })
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
              disabled={!formData.title.trim() || !formData.content.trim()}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
