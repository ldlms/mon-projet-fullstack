import { CardItemProps} from "../../components/atoms/types/componentProps";


const CardItem = ({ onClick,imageUri }: CardItemProps) => {
  return (
    <div 
      onClick={onClick}  
      className="
        w-36
        aspect-[63/88]
        rounded-lg
        overflow-hidden
        shadow-md
        bg-black
        hover:scale-105 transition-transform duration-200 cursor-pointer
      " 
    >
      <img
        src={imageUri}
        alt="Magic card"
        className="
          w-full h-full
          object-cover
        "
      />
    </div>
  );
};

export default CardItem;