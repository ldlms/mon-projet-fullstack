import { useEffect, useState } from "react";
import Header from "../../Layout/header/Header.tsx";
import DeckSidebar from "../../Layout/sideBar/DeckSideBar.tsx";

function HomePage() {


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

        <div className="h-screen flex flex-col">
      
      
      <Header />

      
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        
        
        <main className="flex-1 overflow-y-auto p-4">
          <p>{responseGateway}</p>
          <p>{cardGatway}</p>
          <p>{userGateway}</p>
        </main>

        
        <DeckSidebar />

      </div>
    </div>
    );
}

export default HomePage;