import Button from "./button";
import "../../../index.css";

export default {
  title: "Atoms/Button",
  component: Button,
};

export const Primary = () => <Button variant="primary">Primary</Button>;
export const Secondary = () => <Button variant="secondary">Secondary</Button>;
export const Danger = () => <Button variant="danger">Danger</Button>;
export const Disabled = () => (<Button variant="primary" disabled>Disabled</Button>
);