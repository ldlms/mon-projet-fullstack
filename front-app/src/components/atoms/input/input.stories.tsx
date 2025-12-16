import Input from "./input";
import "../../../index.css";

export default {
    title: "Atoms/Input",
    component: Input,
}

export const passwordInput = () => <Input label="Password" value="" onChange={() => {}} placeholder="Enter your password" />;
export const emailInput = () => <Input label="Email" value="" onChange={() => {}} placeholder="Enter your email" />;
export const usernameInput = () => <Input label="Username" value="" onChange={() => {}} placeholder="Enter your username" />;
export const inputEmail = () => <Input label="Email" value="" onChange={() => {}} placeholder="Enter your email" />;
