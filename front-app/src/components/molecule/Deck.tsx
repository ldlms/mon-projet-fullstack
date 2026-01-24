import {DeckProp} from "../atoms/types/types.tsx"


const DeckCard = ({ name, format, cardCount, imageUrl }: DeckProp) => {
  return (
    <div className="
      flex flex-col md:flex-row
      bg-white rounded-lg shadow-md
      overflow-hidden
      w-full md:w-[420px]
    ">

      <div className="
        w-full h-40
        md:w-28 md:h-auto
        flex-shrink-0
      ">
        <img
          src={imageUrl}
          alt={name}
          className="
            w-full h-full
            object-cover
          "
        />
      </div>

      <div className="p-4 flex flex-col justify-center gap-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{format}</p>
        <p className="text-sm text-gray-500">{cardCount} cartes</p>
      </div>
    </div>
  );
};

export default DeckCard;