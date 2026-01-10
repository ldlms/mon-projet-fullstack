import NavLink from "./navLink";
import "../../../index.css";
import { Component } from "react";

export default {
    title: "Atoms/navLink",
    Component: NavLink,
}

export const Active = () => <NavLink isActive>navlink active</NavLink>
export const Inactive = () => <NavLink>navlink inactive</NavLink>
export const Desactivated = () => <NavLink isDisabled>navlink desactivated</NavLink> 