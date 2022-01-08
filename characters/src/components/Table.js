import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('body')

function Table() {
  const [characters, setCharacters] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);

  async function openModal(e) {
    await axios.get(`http://localhost:9000/.netlify/functions/character?id=${e.target.id}`).then((res) => {
    
    let character = res.data.data.results;
    
    let gamesArray = [];
    for (let i=0; i < character.games.length; i++) {
      gamesArray.push(character.games[i].name);
    }
    let games = gamesArray.join(', ');

    let modalDetails = <section aria-label={`${character.name} details`}>
      <h2>{character.name}</h2>
      <img src={character.image.icon_url} alt={character.name}></img>
      <p>{character.deck} Appears in: {games}</p>
      <button onClick={closeModal} tabIndex="1">Close</button>
    </section>

    setModalDetails(modalDetails)

    })

    setIsOpen(true)
  }

  const handleKeypress = e => {
    if (e.code === "Enter") {
      openModal(e)
    }
  }

  function closeModal() {
    setIsOpen(false)
  }

  useEffect(() => {
    function sortAlphabeticallyByName(a, b) {
      if(a.name < b.name) {
        return -1;
      }
      if(a.name > b.name) {
        return 1
      }
      return 0
    }

    async function getCharacters() {
      await axios.get('http://localhost:9000/.netlify/functions/characters').then((res) => {
      let sorted = res.data.data.results.sort(sortAlphabeticallyByName)
      setCharacters(sorted)
      })
    }
    getCharacters()
  }, [modalIsOpen])

  if (characters) {
    let displayCharacters = characters.map((character) => {
      let gameName
      if (character.first_appeared_in_game) {
        if (character.first_appeared_in_game.name) {
          gameName = character.first_appeared_in_game.name
        } else {
          gameName = null
        }
      } else {
        gameName = null
      }

      return (
        <tr key={character.id} id={character.guid} onClick={openModal} onKeyPress={handleKeypress} tabIndex="0">
          <td id={character.guid}>{character.name}</td>
          <td id={character.guid}>{character.real_name}</td>
          <td id={character.guid}>{gameName}</td>
        </tr>
      )
    })

    return (
      <section>
        <h1>Giant Bomb Characters</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Real Name</th>
              <th>First Game</th>
            </tr>
          </thead>
          <tbody>
            {displayCharacters}
          </tbody>
        </table>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="Modal"
            aria={{
              label: "More Character Details - press escape to close"
            }}>
              {modalDetails}
            </Modal>
      </section>
    )
  } else {
    return (
      null
    )
  }
}

export default Table;