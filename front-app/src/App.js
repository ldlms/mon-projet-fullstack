import React, { useEffect, useState } from "react";
import './App.css';

function App() {

  const [responseGateway, setResponseGateway] = useState("");
  const [cardGatway, setCardGateway] = useState("");
  const [userGateway, setUserGateway] = useState("");

 useEffect(() => {
    fetch("http://localhost:5000")  
      .then(res => res.text())
      .then(data => {console.log("Réponse API Gateway :", data);
            setResponseGateway(data);})
      .catch(err => console.error("Erreur API Gateway :", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/cards")  
      .then(res => res.text())
      .then(data => {console.log("Réponse Card Gateway :", data);
            setCardGateway(data);})
      .catch(err => console.error("Erreur Card Gateway :", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/users")  
      .then(res => res.text())
      .then(data => {console.log("Réponse User Gateway :", data);
            setUserGateway(data);})
      .catch(err => console.error("Erreur User Gateway :", err));
    },[]);   

  return (
    <div>
      <h1>Test API Gateway</h1>
      <p>{responseGateway}</p>
      <p>{cardGatway}</p>
      <p>{userGateway}</p>
    </div>
  );
}

export default App;
