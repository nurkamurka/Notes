import { useState } from "react"
import { nanoid } from 'nanoid'
import NoteStyle from "./Notebook.module.css"
import { Note } from "../Note/Note"

let arr

if (localStorage.getItem("Notes")) {
    arr = JSON.parse(localStorage.getItem("Notes"))
} else {
    arr = []
}

export const Notebook = () => {
    const [notes, setNotes] = useState(arr)
    const [newNoteTitle, setNewNoteTitle] = useState('')
    const [currentNoteContent, setCurrentNoteContent] = useState('')

    const handleAddNote = () => {
        if (newNoteTitle.trim() && currentNoteContent.trim()) {
            const noteObj = {
                id: nanoid(),
                title: newNoteTitle,
                content: currentNoteContent
            }
            let copy = [...notes, noteObj]
            setNotes(copy)
            setNewNoteTitle('')
            setCurrentNoteContent('')

            localStorage.setItem("Notes", JSON.stringify(copy))
        }
    }

    const handleDeleteNote = (id) => {
        let copy = (notes.filter(note => note.id !== id))
        setNotes(copy)

        localStorage.setItem("Notes", JSON.stringify(copy))
    }

    const handleUpdateNote = (id) => {
        let copy = notes.map(note =>
            note.id === id ? { ...note, content: currentNoteContent } : note
        )
        setNotes(copy)
        
        localStorage.setItem("Notes", JSON.stringify(copy))
    }

    const handleClickSelect = (id) => {
        const selectedNote = notes.find(note => note.id === id)
        if (selectedNote) {
            setNewNoteTitle(selectedNote.title)
            setCurrentNoteContent(selectedNote.content)
        }
    }

    return (
        <div className={NoteStyle.container}>
            <h1>NOTE BOOK</h1>
            <input className={NoteStyle.inputt} type="text" placeholder="Введите заголовок заметки" value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)}/>
            <textarea className={NoteStyle.textArea} placeholder="Введите содержимое заметки" value={currentNoteContent} onChange={(e) => setCurrentNoteContent(e.target.value)} 
                onBlur={() => {
                    const selectedNote = notes.find(note => note.title === newNoteTitle)
                    if (selectedNote) {
                        handleUpdateNote(selectedNote.id)
                    }
                }}
            />
            <button className={NoteStyle.btn} onClick={handleAddNote}>Добавить заметку</button>
            <div>
                {notes.map(note => (
                    <div key={note.id}>
                        <Note note={note} onDelete={handleDeleteNote} onSelect={() => handleClickSelect(note.id)}/>
                    </div>
                ))}
            </div>
        </div>
    )
}