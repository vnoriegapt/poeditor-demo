import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LANGUAGES = [ "en", "es" ];
const initialState = { t: { en: null, es: null }, lang: "en" };

const App = () => {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const getProjectList = () => 
      axios.get('http://localhost:8080/api/v2/projects/list');
    const getTerms = async (lang) => {
      const response = await getProjectList();
      const { projects} = response.data.result;
      const project = projects.find(project => project.name === "Sample");
      return axios({
        method: 'GET',
        url: encodeURI(`http://localhost:8080/api/v2/projects/export/${project.id}/${lang}`)
      });
    };
    LANGUAGES.map(async lang => {
      const response = await getTerms(lang);
      const { data } = response.data;
      setState((prevState) => ({
        ...prevState, 
        t: { ...prevState.t, [lang]: data }
      }));
    });
  }, []);
  const onChangeHandler = (value) => {
    setState((prevState) => ({ ...prevState, lang: value }));
  };
  const { t, lang } = state;
  return (
    <div>
      <div>
        <label htmlFor="">Select language</label>{' '}
        <select name="lang" defaultValue="en" onChange={(e) => onChangeHandler(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      {t && t[lang] && t[lang].page && (
        <div>
          <div>{t[lang].page.home}</div>
          <div>{t[lang].page.about}</div>
        </div>
      )}
    </div>
  );
}

export default App;