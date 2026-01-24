import { ManaDotProp } from "../types/props";

function ManaDot({
    color,
}:ManaDotProp){
    return(
        <div className={`w-4 h-4 rounded-full ${color} mx-1 shadow-sm`}></div>
    );

}

export default ManaDot;