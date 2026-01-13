import { DeckHeaderProp } from "../../atoms/types/types";
import Button from "../../atoms/buttons/button";
import ManaDot from "../../atoms/manaDot/manaDot";

function DeckHeader({
    deck,
    onEdit,
    onToggleSideBoard
}:DeckHeaderProp){
    return (
        <div className="bg-gray-600 p-4 text-white shadow-md">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-gray-300 uppercase tracking-wide">Format</span>
                <Button variant="primary">Edit</Button>
            </div>

        <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold mr-3">{deck.name}</h2>
            <div className="flex">
                {deck.colors.map(((color,index) => (
                    <ManaDot key={index} color={color}/>
                )))}                
            </div>
        </div>

        <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-light">
                {deck.currentCount} / {deck.maxCount}
            </span>
        </div>

        <Button variant="secondary" onClick={onToggleSideBoard}>
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0L-7 7m7-7H3"/></svg> 
        SideBoard
        </Button>
        </div>

    )
}

export default DeckHeader;