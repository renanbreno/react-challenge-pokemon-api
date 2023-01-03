import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';

function App() {
  const List = styled.li`
      list-style: none;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
  `;

  const Line = styled.div`
    width: 100%;
    background-color: black;
    height: 2px;
  `;

  const [pokemonsList, setPokemonsList] = useState<pokemonData[]>([]);
  const dataFetchedRef = useRef(false);

  const API_URL = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`;

  interface pokemonData {
    name: string;
    experience: number;
    url: string;
  }

  const requestData = () => {
    axios.get(API_URL)
      .then(response => {
        fetchDetails(response.data.results)
      })
      .catch(error => console.log(error))
  }

  const fetchDetails = (response: any) => {
    response.forEach((item: any, index: number) => {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${index + 1}/`)
        .then(response => {
          const { name, base_experience: experience } = response.data;
          const urlImg = response.data.sprites.front_default;

          const obj = {
            "name": name,
            "experience": experience,
            "url": urlImg
          }

          setPokemonsList(prev => [{ ...obj }, ...prev]);
        })
        .catch(error => console.log(error))
    })
  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    requestData();
  }, []);

  return (
    <div>
      <ul>
        {
          pokemonsList.sort((a, b) => {
            return a.name.localeCompare(b.name);
          }).map((item, key) => (
            <div key={key}>
              <List key={key}>
                <img src={item.url}></img>
                Personagem: {item.name}
                <span>Experiencia: {item.experience}</span>
              </List>
              <Line></Line>
            </div>
          ))
        }
      </ul>
    </div>
  )
}

export default App
