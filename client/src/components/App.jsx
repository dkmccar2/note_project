import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://wwww.note-project-mpin0rodk-devins-projects-c76af60f.vercel.app/getnotes",
        {
          withCredentials: true, // Ensures credentials like cookies are included
        }
      )
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log("Notes loaded from database: " + data);
      });
  }, []);

  const handleAddItem = async (newNote) => {
    console.log("Adding note.. " + newNote);
    let id;
    try {
      await axios
        .post(
          "https://www.note-project-mpin0rodk-devins-projects-c76af60f.vercel.app/addnote",
          {
            title: newNote.title,
            content: newNote.content,
          },
          {
            withCredentials: true, // Ensures cookies or credentials are sent with the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          // console.log(res.data);
          id = res.data;
        });
    } catch (error) {
      console.error("Error adding item:", error);
    }

    if (id) {
      console.log(id);
      setNotes((prevNotes) => {
        return [
          ...prevNotes,
          { id: id, title: newNote.title, content: newNote.content },
        ];
      });
    }
  };

  const handleDeleteItem = (id) => {
    console.log("Deleting note with id: " + id);

    try {
      axios
        .delete(
          `https://www.note-project-mpin0rodk-devins-projects-c76af60f.vercel.app/deletenote/${id}`,
          {
            withCredentials: true, // Ensures credentials like cookies are sent
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          console.log(res.data);
        });
    } catch (error) {}
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return noteItem.id !== id;
      });
    });
  };
  // function addNote(newNote) {
  //   // console.log(newNote);
  //   try {
  //     const response = async () => {
  //       await fetch("http://localhost:4000/addnote", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newNote),
  //       });
  //     };
  //     //console.log(response);
  //   } catch (error) {
  //     console.error("Error adding item:", error);
  //   }
  //   setNotes((prevNotes) => {
  //     return [...prevNotes, newNote];
  //   });
  // }

  // function deleteNote(id) {
  //   setNotes((prevNotes) => {
  //     return prevNotes.filter((noteItem, index) => {
  //       return index !== id;
  //     });
  //   });
  // }

  return (
    <div>
      <Header />
      <CreateArea onAdd={handleAddItem} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={handleDeleteItem}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
