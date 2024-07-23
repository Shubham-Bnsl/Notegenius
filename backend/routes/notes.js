const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
var Note = require("../models/Note");
// const {Schema} = mongoose;
const { body, validationResult } = require("express-validator");

// Route 1:Get All the notes using :GET "/api/notes/getuser". Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Some error");
  }
});

// Route 2:Add a new Note using :Post "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //   if there are errors, return Bad request and the error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await notes.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Some error");
    }
  }
);

// Route 3:Update an existing Note using :Put "/api/notes/updatenote". Login required
router.put(
  "/updatenote/:id", fetchuser, async (req, res) => {
      const{title, description, tag} = req.body;

      try {
        
        // Create new object
        const newNote = {}
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}
        
        // Find the note to be updated
        let note = await Note.findById(req.params.id)
        if(!note){
          res.status(404).send("Not Found")
        }
        
        if(note.user.toString() !== req.user.id){
          return res.status(401).send("Not Allowed")
        }
        
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note})
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Some error");
      }
        
  }),

// Route 4:Deleting a  existing Note using :Delete "/api/notes/deletenote". Login required
router.delete(
  "/deletenote/:id", fetchuser, async (req, res) => {
      const{title, description, tag} = req.body;
      try {
        
        
        // Create new object
        
        // Find the note to be delted and deleted
        let note = await Note.findById(req.params.id)
        if(!note){
          res.status(404).send("Not Found")
        }
        
        // allow deletion only if user owns this Note
        if(note.user.toString() !== req.user.id){
          return res.status(401).send("Not Allowed")
        }
        
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted", note: note})
        
      } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal Some error");
      }


      }),

  (module.exports = router);
