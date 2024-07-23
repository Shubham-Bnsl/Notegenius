import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const noteInitial =[]

  const [notes, setNotes] = useState(noteInitial)

  // Get All Notes
  const getNotes = async() => {
    // API CALL
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });

    const json = await response.json()
    console.log(json)
    setNotes(json)
  }

  // ADD a note
  const addNote = async(title, description, tag) => {
    // TODO API CALL
    // API CALL
    const response = await fetch(`${host}/api/notes/addnote`, {
      
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },

      body: JSON.stringify({title, description, tag}),
    });
    const note = await response.json();
    setNotes(notes.concat(note))

  
    // console.log("Adding a new note")
    // const note = json.
  }

  
  // DELTE A NOTE
  const deleteNote = async (id) => {
    // API CALL
    const response = await fetch(`${host}/api/notes/deleteNote/${id}`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json();
    console.log(json)

    // console.log("deleting note with id" + id)
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)

  }
  // EDIT A NOTE
  const editNote = async (id, title, description, tag) => {
    // API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}),
    });
    const json = await response.json();
    console.log(json)
  

    let newNotes = JSON.parse(JSON.stringify(notes))
  // FETCH API
  for (let index = 0; index < newNotes.length; index++) {
    const element = newNotes[index];
    if (element._id === id){

      newNotes[index].title = title;
      newNotes[index].description = description;
      newNotes[index].tag = tag;
      break;
    }
  }

  setNotes(newNotes)

}
return (
  <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes}}>
    {props.children}
  </NoteContext.Provider>
)
}

export default NoteState;