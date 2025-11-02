import arrowBack from "../assets/icons/arrow-back.png";
import arrowDown from "@/assets/icons/arrow-down.png";
import arrowRight from "@/assets/icons/arrow-right.png";
import bag from "@/assets/icons/bag.png";
import check from "@/assets/icons/check.png";
import clock from "@/assets/icons/clock.png";
import dollar from "@/assets/icons/dollar.png";
import envelope from "@/assets/icons/envelope.png";
import home from "@/assets/icons/home.png";
import location from "@/assets/icons/location.png";
import logout from "@/assets/icons/logout.png";
import minus from "@/assets/icons/minus.png";
import pencil from "@/assets/icons/pencil.png";
import person from "@/assets/icons/person.png";
import phone from "@/assets/icons/phone.png";
import plus from "@/assets/icons/plus.png";
import search from "@/assets/icons/search.png";
import star from "@/assets/icons/star.png";
import trash from "@/assets/icons/trash.png";
import user from "@/assets/icons/user.png";

import avatar from "@/assets/images/avatar.png";
import avocado from "@/assets/images/avocado.png";
import bacon from "@/assets/images/bacon.png";
import burgerOne from "@/assets/images/burger-one.png";
import burgerTwo from "@/assets/images/burger-two.png";
import buritto from "@/assets/images/buritto.png";
import cheese from "@/assets/images/cheese.png";
import coleslaw from "@/assets/images/coleslaw.png";
import cucumber from "@/assets/images/cucumber.png";
import emptyState from "@/assets/images/empty-state.png";
import fries from "@/assets/images/fries.png";
import loginGraphic from "@/assets/images/login-graphic.png";
import logo from "@/assets/images/logo.png";
import mozarellaSticks from "@/assets/images/mozarella-sticks.png";
import mushrooms from "@/assets/images/mushrooms.png";
import onionRings from "@/assets/images/onion-rings.png";
import onions from "@/assets/images/onions.png";
import pizzaOne from "@/assets/images/pizza-one.png";
import salad from "@/assets/images/salad.png";
import success from "@/assets/images/success.png";
import tomatoes from "@/assets/images/tomatoes.png";
import grilledChicken from "@/assets/images/grilled-chicken.png";
import drinks from "@/assets/images/drinks.png";

export const CATEGORIES = [
    {
        id: "1",
        name: "Tout",
    },
    {
        id: "2",
        name: "Plats Principaux",
    },
    {
        id: "3",
        name: "Grillades",
    },
    {
        id: "4",
        name: "Poissons",
    },
    {
        id: "5",
        name: "Accompagnements",
    },
    {
        id: "6",
        name: "Boissons",
    },
    {
        id: "7",
        name: "Desserts",
    },
];

export const offers = [
    {
        id: 1,
        title: "Menu du jour",
        image: burgerOne,
        color: "#E63946",
        category: "", // Affiche tout
    },
    {
        id: 2,
        title: "Grillades",
        image: grilledChicken,
        color: "#D32F2F",
        category: "grillades", // Logique spéciale dans menu.tsx
    },
    {
        id: 3,
        title: "Boissons et rafraîchissements",
        image: drinks,
        color: "#1D3557",
        category: "boissons", // Logique spéciale dans menu.tsx (jus + café)
    },
    {
        id: 4,
        title: "Plateau familiale",
        image: burgerTwo, // Changé de buritto à burgerTwo
        color: "#F77F00",
        category: "specialites", // Spécialités
    },
];

export const sides = [
    {
        name: "Frites",
        image: fries,
        price: 1500,
    },
    {
        name: "Alloco",
        image: onionRings,
        price: 2000,
    },
    {
        name: "Attiéké",
        image: mozarellaSticks,
        price: 2500,
    },
    {
        name: "Salade",
        image: salad,
        price: 1500,
    },
    {
        name: "Riz",
        image: coleslaw,
        price: 1000,
    },
];

export const toppings = [
    {
        name: "Avocat",
        image: avocado,
        price: 500,
    },
    {
        name: "Fromage",
        image: cheese,
        price: 500,
    },
    {
        name: "Concombre",
        image: cucumber,
        price: 300,
    },
    {
        name: "Champignons",
        image: mushrooms,
        price: 400,
    },
    {
        name: "Oignons",
        image: onions,
        price: 300,
    },
    {
        name: "Tomates",
        image: tomatoes,
        price: 300,
    },
];

export const images = {
    avatar,
    avocado,
    bacon,
    burgerOne,
    burgerTwo,
    buritto,
    cheese,
    coleslaw,
    cucumber,
    emptyState,
    fries,
    loginGraphic,
    logo,
    mozarellaSticks,
    mushrooms,
    onionRings,
    onions,
    pizzaOne,
    salad,
    success,
    tomatoes,
    arrowBack,
    arrowDown,
    arrowRight,
    bag,
    check,
    clock,
    dollar,
    envelope,
    home,
    location,
    logout,
    minus,
    pencil,
    person,
    phone,
    plus,
    search,
    star,
    trash,
    user,
};
