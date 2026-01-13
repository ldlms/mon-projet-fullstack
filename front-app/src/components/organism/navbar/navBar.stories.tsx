import NavBar from "./navBar";


export default {
    title: "Organisms/NavBar",
    Component: NavBar,
}

export const defaultNavBar = () => { 
    const items = [
        { label: "Mes Deck", href: "/" },
        { label: "Card synergy", href: "/synergy"},
    ];

    return <NavBar items={items} activeHref="/" />
}