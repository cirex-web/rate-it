"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import ReactStars from "react-rating-stars-component";

import {
  Auth,
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  Database,
  child,
  get,
  getDatabase,
  onValue,
  query,
  ref,
  remove,
  set,
} from "firebase/database";
import { Modal } from "./Modal";
import { ReviewModal } from "./modals/ReviewModal";
import { AllLocations, LocationData } from "./types";
import { AllReviewModal } from "./modals/AllReviewsModal";
import { findAggregate } from "./util/reviews";
const firebaseConfig = {
  apiKey: "AIzaSyBoaquyqq5IWRHT_crGIVyFYDw31wapcX0",
  authDomain: "rate-it-ea47c.firebaseapp.com",
  projectId: "rate-it-ea47c",
  storageBucket: "rate-it-ea47c.appspot.com",
  messagingSenderId: "702734536915",
  appId: "1:702734536915:web:3ff1584b4a5ca1ddfcc426",
};

const locationsRaw = [
  {
    conceptId: 113,
    name: "AU BON PAIN AT SKIBO CAFÉ",
    shortDescription:
      "Coffee/tea, espresso, soup, sandwiches/salads, grab-n-go, yogurt parfaits, fruit, snacks",
    description:
      "At Au Bon Pain café bakery, each signature recipe is uniquely crafted. You can enjoy delicious hot or iced coffee and teas, espresso drinks, a variety of cold beverages, soup, a customized made-to-order breakfast or lunch sandwich or salad, or you can grab a pre-made salad, sandwich, wrap, yogurt parfait, fresh fruit or snack. There is always something new to try ... healthy choices, comfort food, indulgent treats … try them all!  Nutritional information can be found at aubonpain.com/nutrition. To order Au Bon Pain catering, please contact 1-800-765-4227 or visit aubonpain.com/catering. For on-campus assistance, call 412-621-1934.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/113",
    location: "Cohon Center, Second floor",
    coordinates: {
      lat: 40.444107,
      lng: -79.942206,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 0,
          hour: 9,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 7,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 9,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 22,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 175,
    name: "BUILD PIZZA - ROHR COMMONS",
    shortDescription:
      "Stromboli and flatbread style pizza baked in our brick oven",
    description:
      "Brick oven-baked flatbread pizza and strombolis take the stage at BUILD. Every day, choose from two classically-flavored flatbread pizzas – pepperoni and cheese – a chef’s special creation (think anything from Cheeseburger to a Cuban-style pie), and housemade strombolis.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/175",
    location: "Tepper Building, 2nd Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/175/W 3&4 (1).pdf",
    coordinates: {
      lat: 40.445352,
      lng: -79.945278,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 0,
        },
      },
    ],
    todaysSpecials: [
      {
        title: "Greek RollSouthwest Chicken Flatbread",
        description:
          "Greek Roll\n                                \n                                Olive tapenade, feta cheese, artichokes, tomatoes, and herb garlic oil\n                            Southwest Chicken Flatbread\n                                \n                                Pulled chicken, bell peppers, onions, and Mexican spices",
      },
    ],
  },
  {
    conceptId: 177,
    name: "BURGER 412  - ROHR COMMONS",
    shortDescription:
      "Freshly made specialty burgers, fries and house-made chips",
    description:
      "Every week features a hot grab-n-go basket containing a chef-inspired burger or sandwich paired with a French fry or house-made chip. Varieties include The Nacho Burger with Fried Tortilla Chips or Spicy Gochujang Turkey Burger with a fried egg and Sweet Potato Waffle Fries. We also offer Beyond burgers, a vegan alternative, cooked to order or grass-fed, all-natural Halal-certified beef burgers from local farm partner Jubilee Hilltop Ranch, a mere 100 miles east of campus!",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/177",
    location: "Tepper Building, 2nd Floor",
    coordinates: {
      lat: 40.445352,
      lng: -79.945278,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 0,
        },
      },
    ],
    todaysSpecials: [
      {
        title: "California Turkey Burger",
        description:
          "Turkey Burger topped with lettuce, bacon, tomato, onion, provolone cheese, and avocado",
      },
    ],
  },
  {
    conceptId: 179,
    name: "CAPITAL GRAINS - ROHR COMMONS",
    shortDescription: "Student-run grain and salad bowl concept",
    description:
      "Capital Grains is a unique grain-and-salad bowl concept with a menu of whole grains, fresh vegetables, and vegetarian protein options. This first-of-its-kind student-run restaurant opens on the weekends and is committed to ensuring the highest quality food possible.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/179",
    location: "Tepper Building, 2nd Floor, Rohr Commons Eatery",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/179/[M & B] Menu - V5 F23.pdf",
    coordinates: {
      lat: 40.4449525806329,
      lng: -79.94546729610397,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 12,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 15,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 12,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 15,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 184,
    name: "CIAO BELLA",
    shortDescription: "Customizable pasta plates",
    description:
      "Ciao Bella takes a globally inspired approach to pasta. Discover a menu of traditional dishes and customizable pasta bowls featuring international flavors. Find penne and tortellini on the menu every day!?",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/184",
    location: "Cohon Center, 2nd Floor Marketplace",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/184/Ciao Bella Static (3).pdf",
    coordinates: {
      lat: 40.44296,
      lng: -79.941815,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 0,
          hour: 17,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 17,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 0,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 144,
    name: "CUCINA ITALIAN CHICKEN",
    shortDescription: "Italian-style, Halal-certified chicken, made your way",
    description:
      "Italian-style, Halal-certified chicken is the star of Cucina. Build your own creation, choosing from a list of fresh marinades and styles – think delicious sandwiches, wraps made with Lavash, a thin, delicious flatbread, bowls, and crispy-fresh salads – or pick one of our chef-inspired features.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/144",
    location: "Cohon Center, 2nd Floor, Marketplace",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/144/CUCINA Static (6).pdf",
    coordinates: {
      lat: 40.44296,
      lng: -79.941815,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 95,
    name: "DE FER COFFEE & TEA AT MAGGIE MURPH CAFÉ",
    shortDescription:
      "Locally-roasted specialty coffee, tea, and scratch-made food",
    description:
      "De Fer Coffee & Tea serves locally-roasted specialty coffee, tea, and scratch-made food in the Maggie Murph Café in Hunt Library. Locally owned and operated by CMU alum, Atelier de Fer has been roasting coffee at its flagship store in Pittsburgh’s Strip District since 2017. In addition to a full coffee/tea menu, the café will serve house-made scones, muffins, cookies, paninis, smoothies and parfaits.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/95",
    location: "Hunt Library, Rothberg's Roasters",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/95/CMU-EntranceSign_fall-v3-2023.pdf",
    coordinates: {
      lat: 40.441111,
      lng: -79.94374,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 8,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 2,
          hour: 8,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 3,
          hour: 8,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 6,
          hour: 10,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 17,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 178,
    name: "THE EDGE CAFE & MARKET",
    shortDescription: "Vaad-certified kosher bagels, pizza, bourekas & more!",
    description:
      "The Edge is a Vaad-certified kosher cafe & market, serving freshly-baked bagels, bagel sandwiches, Turkish bourekas, wraps, salads, pasta, and artisan pizzas baked in our hearthstone oven. The Edge is located in Tartans Pavilion, overlooking Gesling stadium.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/178",
    location: "Resnik House",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/178/STUAFF-24-064 TheEdge_Menu_28x24_04.pdf",
    coordinates: {
      lat: 40.4426740207827,
      lng: -79.94023230189542,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 0,
          hour: 17,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 23,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 23,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 23,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 23,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 23,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 14,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 88,
    name: "EGG SHOPPE - GRUBHUB ONLY",
    shortDescription:
      "Breakfast available only on Grubhub for pickup in Schatz.",
    description:
      "Need breakfast on the go? Available only on Grubhub for pickup in Schatz, Egg Shoppe has you covered, serving up a delicious menu of breakfast sandwiches and burritos. Create your own or try an Egg Shoppe signature, from the French Toast-based, hash brown-topped Breakfast Bomber, to the trusty, stuffed Ole’ Breakfast Burrito.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/88",
    location: "Cohon Center, Schatz Dining Room",
    coordinates: {
      lat: 40.44296,
      lng: -79.941815,
    },
    acceptsOnlineOrders: true,
    times: [],
  },
  {
    conceptId: 103,
    name: "ENTROPY+",
    shortDescription:
      "On-campus convenience store, serving snacks, grab-and-go meals, coffee, & more",
    description:
      "Entropy+ is the on-campus go-to spot for grocery items, health and beauty aids, bottled beverages, snacks, sweets, and local foods. In addition to their convenience products, Entropy+ carries a variety of grab-and-go meals: find hot and cold from our allergen-friendly kitchen Nourish, fresh-made sandwiches, salads, sushi, fresh fruits and veggies, and more.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/103",
    location: "Cohon Center, Ground Floor",
    coordinates: {
      lat: 40.442923,
      lng: -79.942103,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 1,
          hour: 7,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 7,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 7,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 7,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 7,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 23,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 12,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 20,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 92,
    name: "THE EXCHANGE",
    shortDescription:
      "Deli and breakfast sandwiches, salads and daily hot entrées",
    description:
      "The Exchange offers custom deli sandwiches, soups, and hot entrées, as well as fresh baked goods, fruit, yogurt parfaits, nutritional bars, and other grab-and-go items. The designated coffee bar includes hot brewed La Prima coffee, specialty and organic teas, cold beverages and bottled juices.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/92",
    location: "Posner Hall, 1st Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/92/exchange_23-24 menus_v2-min.pdf",
    coordinates: {
      lat: 40.441499,
      lng: -79.941951,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 1,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 19,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 19,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 19,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 19,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 10,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 14,
          minute: 30,
        },
      },
    ],
  },
  {
    conceptId: 189,
    name: "FLAVOR OF PUERTO RICO AT URBAN REVOLUTION - GRUBHUB ONLY",
    shortDescription:
      "Authentic Puerto Rican Cuisine. Available only on Grubhub for pickup in Resnik Food Hall",
    description:
      "Looking for a Latin inspired meal for lunch? Urban Revolution has been taken over by Flavor of Puerto Rico, a locally owned restaurant that serves authentic Puerto Rican dishes. Come try our best selling Pernil (slow roasted pork) with Arroz con Gandules (rice and pigeon peas). You're going to love our empanadas! Place your order through Grubhub for pick-up in Resnik Food Hall.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/189",
    location: "Resnik House, Resnik Food Hall",
    coordinates: {
      lat: 40.442521,
      lng: -79.940028,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 14,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 173,
    name: "FORBES AVENUE SUBS - ROHR COMMONS",
    shortDescription:
      "Made-to-order deli-style subs and wraps. Vegan options available.",
    description:
      "Classic deli-style subs and wraps made with fresh sliced deli meat and cheeses. We offer hummus and our signature Egg-style Tofu Salad every day for our plant-forward guests. Toppings include jalapeno, banana peppers, chef-inspired spreads, bacon, avocado, lettuce, tomato and red onion. The NEW Forbes Ave Express line consists of three pre-made sandwiches every day ready to be served toasted or not in minutes.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/173",
    location: "Tepper Building, 2nd Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/173/Forbes W3&4.pdf",
    coordinates: {
      lat: 40.44496374074576,
      lng: -79.9454977063049,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 0,
        },
      },
    ],
    todaysSpecials: [
      {
        title: "Forbes ItalianItalian BeefPortabella Caprese",
        description:
          "Forbes Italian\n                                \n                                Pepperoni, ham, bacon, salami, and provolone\n                            Italian Beef\n                                \n                                Shredded beef, giardiniera, provolone cheese\n                            Portabella Caprese\n                                \n                                Grilled portabella, fresh mozzarella, basil, tomato, balsamic dressing",
      },
    ],
  },
  {
    conceptId: 91,
    name: "EL GALLO DE ORO",
    shortDescription:
      "Mexican cuisine, burritos and burrito bowls, tacos, quesadillas, salads",
    description:
      "El Gallo offers authentic Mexican cuisine – burritos and burrito bowls, tacos, quesadillas, and salads – made with fresh healthful ingredients. Dishes are prepared over the grill to maximize flavor and feature spices like cumin, cilantro, and chipotle.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/91",
    location: "Cohon Center, Ground Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/91/el-gallo-menu-23-24_v1-min.pdf",
    coordinates: {
      lat: 40.443152,
      lng: -79.942049,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 12,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 16,
          minute: 30,
        },
      },
      {
        start: {
          day: 6,
          hour: 12,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 20,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 139,
    name: "GRANO PIZZA",
    shortDescription:
      "Hand-stretched, personal-sized pizzas on a New York or focaccia-style crust",
    description:
      "Grano offers two crust choices for their hand-stretched, personal-size pizza: thinner, crispy New York-style or fluffy, chewy focaccia-style crust. Top your crust with toppings of your choice, or pick one of our chef-driven specialties! And, don’t forget dessert - Grano has a new, fresh-baked, house-made dessert every day. Make it a plant-based pizza with vegan focaccia and Daiya vegan cheese.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/139",
    location: "Cohon Center, Second Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/139/Grano Menus.pdf",
    coordinates: {
      lat: 40.44296,
      lng: -79.941815,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 30,
        },
      },
    ],
    todaysSpecials: [
      {
        title: "Chef's SpecialDessert of the WeekPizza of the Week",
        description:
          "Chef's Special\n                                \n                                Hot Honey Fried Chicken Hoagie\n                            Dessert of the Week\n                                \n                                Warm Chocolate Chip Cookie Pie\n                            Pizza of the Week\n                                \n                                Margherita",
      },
    ],
  },
  {
    conceptId: 110,
    name: "HUNAN EXPRESS",
    shortDescription: "Asian cuisine, rice bowls, boba/bubble tea, smoothies",
    description:
      "Authentic Chinese cuisine, featuring sauces made with bone broth, choose your base of noodles or rice and build your own meal with General Tso’s chicken, stir fry tofu, seasonal vegetables and pork ribs in black bean sauce. Braised fish, spring rolls, pork dumplings, red bean rice cakes are available daily. Enjoy fruit smoothies and build-your-own milk or fruit boba tea, with bubble toppings like tapioca, rainbow jelly, lychee jelly and popping boba.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/110",
    location: "Newell-Simon Atrium",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/110/Hunan (2).pdf",
    coordinates: {
      lat: 40.443486,
      lng: -79.945528,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 16,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 12,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 20,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 115,
    name: "ROHR CAFÉ  - LA PRIMA",
    shortDescription:
      "La Prima's second location on campus serving Italian-style coffee and food",
    description:
      "La Prima Espresso Company's second campus dining location is now open! La Prima Espresso Company is a Pittsburgh-based certified organic roaster offering exceptional Italian-style coffee and espresso. Additionally, La Prima at CMU serves cold brew, nitro, chai and matcha green tea lattes, frizz coffee, and more. Made-daily pastries are available from Mediterra Bakehouse, as well as grab-and-go sandwiches and vegetarian meals from Common Plea Catering and Community Kitchen. Hot sandwiches are available for breakfast and lunch. Fair-trade, organic whole bean coffee is also available for purchase.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/115",
    location: "Gates Hillman Centers, Third floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/115/Gates hall Menu Dashboard.pdf",
    coordinates: {
      lat: 40.443551,
      lng: -79.944798,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 10,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 15,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 10,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 15,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 136,
    name: "MILLIE'S COFFEE 'N' CREAMERY - ROHR COMMONS",
    shortDescription:
      "NOW OPEN! Sustainably sourced coffee, ice cream, and vegan gelato.",
    description:
      "Pittsburgh-based Millie's Homemade Ice Cream is now scooping at CMU! Millie's first-ever Coffee 'n' Creamery serves chef-inspired ice creams, vegan gelatos, KLVN coffee and espresso drinks, Goodlander draft tea, and artisan pastries. Perfect for breakfast-on-the-go or an after-dinner sweet treat and everything in between. FLEX dollars, DineXtra, credit/debit and cash accepted!",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/136",
    location: "Tepper Building, Second floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/136/CMU-Digital-Menu 23-24-v2.pdf",
    coordinates: {
      lat: 40.44487,
      lng: -79.945319,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 22,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 22,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 22,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 22,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 9,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 15,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 18,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 127,
    name: "NOURISH",
    shortDescription:
      "Allergen-friendly kitchen, food made without gluten and the 9 major allergen ingredients",
    description:
      "Nourish is an allergen-friendly kitchen with a menu prepared without gluten, wheat, milk, egg, soy, fish, shellfish, peanuts, and most tree nuts (except coconut). In addition to offering a diverse and delicious menu designed with everyone in mind, Nourish serves safe foods for our guests with dietary restrictions. Menu items include salads, sandwiches, hot entrees, and several vegan offerings. All food is prepared and sealed in a dedicated kitchen by food service staff trained and highly knowledgeable about food allergens and cross-contact prevention. Students, faculty, and staff can use Grubhub to place orders by downloading the app. All orders will be available for pick-up during operating hours at Nourish, located on the second floor of the Cohon Center near Rangos Ballroom. Grab-and-go items from Nourish are available at the following locations: Entropy+, Rothberg’s Roasters II, and Tepper Eatery. Items can be purchased individually or as a block meal for students using their meal plan. Orders for four or more people will take additional time to prepare when placed through Grubhub. We request that orders for larger groups (four or more) be placed 24 hours in advance through our catering department by emailing catering@andrew.cmu.edu or by phone at 412-268-2129.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/127",
    location: "Cohon Center, Second floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/127/Updated Nourish menu fall 2023.pdf",
    coordinates: {
      lat: 40.4438318,
      lng: -79.9422587,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 18,
          minute: 30,
        },
      },
      {
        start: {
          day: 2,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 18,
          minute: 30,
        },
      },
      {
        start: {
          day: 3,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 18,
          minute: 30,
        },
      },
      {
        start: {
          day: 4,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 18,
          minute: 30,
        },
      },
      {
        start: {
          day: 5,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 18,
          minute: 30,
        },
      },
    ],
  },
  {
    conceptId: 94,
    name: "LA PRIMA ESPRESSO",
    shortDescription:
      "Italian-style coffee, pastries, grab-and-go sandwiches, salads, and sides",
    description:
      "La Prima Espresso Company is a Pittsburgh-based certified organic roaster offering exceptional Italian-style coffee and espresso. Additionally, La Prima at CMU serves cold brew, nitro, chai and matcha green tea lattes, frizz coffee, and more. Made-daily pastries are available from Mediterra Bakehouse, as well as grab-and-go sandwiches and vegetarian meals from Common Plea Catering and Community Kitchen. Organic whole bean coffee is also available for purchase.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/94",
    location: "Wean Hall, 5th Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/94/laprima-wean_23-34-v1-min.pdf",
    coordinates: {
      lat: 40.442611,
      lng: -79.945857,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 1,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 18,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 186,
    name: "REDHAWK COFFEE",
    shortDescription:
      "Local coffee roaster serving specialty coffee, tea, baked goods, and grab-and-go food.",
    description:
      "Redhawk Coffee is a local, family-owned coffee roasting company dedicated to serving the best specialty coffee on the market. With an approachable roast style and various drink options, Redhawk has an option for everyone. Try one of our fresh baked pastries from Driftwood Oven or even a matcha latte made with ceremonial grade matcha tea. Other popular options include mochas with Brunton’s chocolate milk and our signature honey-cinnamon latte.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/186",
    location: "Scaife Hall, First Floor",
    coordinates: {
      lat: 40.441808,
      lng: -79.947261,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 1,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 17,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 17,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 17,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 17,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 17,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 174,
    name: "REVOLUTION NOODLE",
    shortDescription:
      "Customizable Malatang Noodle bowls, from the owners of Hunan Express",
    description:
      "From the creators of Hunan Express comes one of Carnegie Mellon’s most beloved concepts, Revolution Noodle. Build your perfect Malatang noodle bowl with house-made broths, fresh noodles, seasonal vegetables, and various proteins. Don’t forget to add a savory bao bun, bubble tea, or fruit smoothie.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/174",
    location: "Cohon Center, 2nd Floor, Marketplace",
    coordinates: {
      lat: 40.4429602,
      lng: -79.9418151,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 12,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 108,
    name: "SCHATZ DINING ROOM",
    shortDescription: "All-you-care-to-eat residential dining hall",
    description:
      "Schatz Dining Room is piloting all-you-care-to-eat lunchtime service for all community members, including undergraduate students.Schatz Dining Room offers campus's only all-you-care-to-eat residential dining room. Schatz serves breakfast, lunch and dinner, Monday - Friday, and brunch and dinner on the weekends. Breakfast and brunch offerings include cereal, fruit, egg dishes, breakfast meats, hot griddled items like pancakes and french toast, make-your-own waffles, and an avoiding gluten breakfast station and avoiding gluten options for lunch and dinner. Lunch and dinner include five stations serving a rotating menu of hot entrees, vegan and vegetarian options, soup and salad, made-to-order sandwiches, beverages and desserts. To make a reservation, please email schatzreservations@andrew.cmu.edu",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/108",
    location: "Cohon Center, Second floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/108/Schatz Menus - Spring 24 - Week 3 (6).pdf",
    coordinates: {
      lat: 40.44318,
      lng: -79.942498,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 0,
          hour: 14,
          minute: 30,
        },
      },
      {
        start: {
          day: 1,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 10,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 2,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 10,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 3,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 10,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 4,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 10,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 5,
          hour: 7,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 10,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 14,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 6,
          hour: 10,
          minute: 30,
        },
        end: {
          day: 6,
          hour: 14,
          minute: 30,
        },
      },
    ],
  },
  {
    conceptId: 180,
    name: "SCOTTY'S MARKET BY SALEM'S",
    shortDescription:
      "International and conventional groceries, savory grilled meats and hot meals.",
    description:
      "Scotty’s Market is CMU’s first campus grocery store! Operated by locally-owned Salem’s Market and Grill, who started their business 40 years ago in the heart of Oakland, Scotty’s Market is stocked with fresh produce, drinks, snacks, and international and conventional grocery items.The Grill at Scotty’s Market offers a wide selection of savory Mediterranean fare, including beef and lamb gyros, chicken shawarma, falafel, curries, rice dishes, salads, wraps, sides, and a hot breakfast.  FLEX dollars, DineXtra, and credit and debit cards are accepted for grocery and grill items, and meal blocks can be used at the grill. Visit Salem's Grill at Scotty's Market for menus, specials and hours of operation. Scotty's Market is closed from 1 pm - 2 pm every Friday. Learn more about Salem's Market and Grill.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/180",
    location: "Forbes Beeler Apartments, Forbes and Beeler",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/180/salems-menu-fall23-v1.pdf",
    coordinates: {
      lat: 40.4441273,
      lng: -79.939591,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 9,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 9,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 13,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 14,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 9,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 21,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 188,
    name: "STACK'D UNDERGROUND",
    shortDescription:
      "Due to maintenance, Stack'd will exclusively offer grab-and-go options until resolved",
    description:
      "Due to a maintenance issue, Stack'd will exclusively offer grab-and-go options (not hot/cooked foods) until the issue is resolved.Stack'd Underground is the newest restaurant concept from the Mero Restaurant Group. Combining signature dishes from the group's popular restaurants in Oakland. The menu includes smash’d burgers from Stack’d, Nashville chicken from CHiKN and gourmet grilled cheese from Melt’d. In addition to these best sellers the location will offer a selection of wraps, salads as well as a variety of vegetarian and halal options.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/188",
    location: "Morewood Gardens, Lower level",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/188/stackdmenu-23-v2.pdf",
    coordinates: {
      lat: 40.445272,
      lng: -79.943384,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 0,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 148,
    name: "STEPHANIE'S - MARKET C",
    shortDescription:
      "Fresh sandwiches, wraps and salads, snacks, sweets, gourmet coffee and cold beverages",
    description:
      "Stephanie's - Market C provides fresh sandwiches, wraps, fruits, vegetables and salads so you can conveniently grab your lunch and go. Coupled with endless choices of snacks, ice cream, cold beverages and innovative coffee choices, this micro market has everything you're craving!Credit cards or Market C account cards are acceptable forms of payment. Dining plans, Flexible Dollars, DineXtra, and cash are not accepted at this location.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/148",
    location: "Mellon Institute, Fourth Floor, Room 401",
    coordinates: {
      lat: 40.4461,
      lng: -79.951,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 0,
          hour: 0,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 23,
          minute: 59,
        },
      },
      {
        start: {
          day: 1,
          hour: 0,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 23,
          minute: 59,
        },
      },
      {
        start: {
          day: 2,
          hour: 0,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 23,
          minute: 59,
        },
      },
      {
        start: {
          day: 3,
          hour: 0,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 23,
          minute: 59,
        },
      },
      {
        start: {
          day: 4,
          hour: 0,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 23,
          minute: 59,
        },
      },
      {
        start: {
          day: 5,
          hour: 0,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 23,
          minute: 59,
        },
      },
      {
        start: {
          day: 6,
          hour: 0,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 23,
          minute: 59,
        },
      },
    ],
  },
  {
    conceptId: 82,
    name: "TAHINI",
    shortDescription: "Fresh Mediterranean, Certified Kosher Cuisine",
    description:
      "Tahini by Elegant Edge serves fresh, authentic Mediterranean cuisine, certified kosher by the Vaad Harabonim of Greater Pittsburgh. The menu features shawarma, vegan eggplant “shawarma” and falafel pita sandwiches, couscous and hummus bowls, and freshly prepared sides including grape leaves, Israeli chopped salad and zahtar pita fries. Offerings include a variety of plant-based and vegan options. Save time and order in advance for pick-up using Grubhub!",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/82",
    location: "Resnik House, Tartans Pavilion",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/82/STUAFF-24-063-Menus-32x24_02_MECH (3).pdf",
    coordinates: {
      lat: 40.44258976615644,
      lng: -79.93993708177102,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 0,
          hour: 17,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 1,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 1,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 168,
    name: "TARTAN EXPRESS FOOD TRUCK",
    shortDescription: "Featuring your local favorite food trucks",
    description: "Coming soon...",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/168",
    location: "Legacy Plaza, Legacy Plaza",
    coordinates: {
      lat: 40.44,
      lng: -79.94,
    },
    acceptsOnlineOrders: false,
    times: [],
  },
  {
    conceptId: 114,
    name: "TASTE OF INDIA",
    shortDescription: "Taste of India provide a vibrant tastes of India.",
    description:
      "An Taste of  India restaurant typically offers a diverse menu featuring a variety of flavorful dishes from various regions of India. Expect aromatic spices, rich curries, tandoori specialties, and a range of vegetarian and non-vegetarian options. Whether you're a fan of  samosas, chicken curry, tandori chicken or butter chicken, Taste of India provide a vibrant tastes of India.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/114",
    location: "Resnik House, Resnik Servery",
    coordinates: {
      lat: 40.44257994858966,
      lng: -79.94024963683377,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 0,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 0,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 15,
          minute: 30,
        },
      },
      {
        start: {
          day: 1,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 15,
          minute: 30,
        },
      },
      {
        start: {
          day: 2,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 15,
          minute: 30,
        },
      },
      {
        start: {
          day: 3,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 15,
          minute: 30,
        },
      },
      {
        start: {
          day: 4,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 15,
          minute: 30,
        },
      },
      {
        start: {
          day: 5,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 21,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 6,
          hour: 21,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 185,
    name: "TEPPER TAQUERIA",
    shortDescription:
      "Mexican-style street tacos, burritos, quesadillas, bowls, and nachos",
    description:
      "Traditional, street-style tacos take the stage at Tepper Taqueria. Diners get to choose their style – taco, burrito, bowl, quesadilla, or nachos – from the make-your-own menu, filling their choice with house-marinated meats (including a vegetarian, plant-based beef), rice and beans, and a smattering of delicious, classic toppings.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/185",
    location: "Tepper Building, Second Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/185/Tepper Taqueria SP24.pdf",
    coordinates: {
      lat: 40.4446575,
      lng: -79.9452506,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 138,
    name: "TRUE BURGER",
    shortDescription:
      "Unique, hand-crafted signature sandwiches and smash burgers",
    description:
      "True Burger features a menu of Angus beef, vegan Beyond, turkey and bison burgers, crispy fish sandwiches, and loaded savory fries. Halal burgers, gluten-free buns, and vegan Daiya cheese are available upon request. The best part of this innovation isn't its menu; it’s the giveback: 5% of every purchase from True Burger goes toward food insecurity initiatives on campus.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/138",
    location: "Cohon Center, Second Floor",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/138/TB - W 3&4.pdf",
    coordinates: {
      lat: 40.4429602,
      lng: -79.9418151,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 0,
          hour: 17,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 6,
          hour: 0,
          minute: 0,
        },
      },
      {
        start: {
          day: 6,
          hour: 17,
          minute: 0,
        },
        end: {
          day: 0,
          hour: 0,
          minute: 0,
        },
      },
    ],
    todaysSpecials: [
      {
        title: "Fries of the Week",
        description: "Pulled Pork Loaded Fries",
      },
    ],
  },
  {
    conceptId: 98,
    name: "URBAN REVOLUTION - GRUBHUB ONLY",
    shortDescription: "Grubhub-only, featuring fresh-carved rotisserie options",
    description:
      "Urban Revolution is campus’s premiere restaurant-style ghost kitchen available only on Grubhub. Open for dinner only, Urban Revolution features a menu of distinctive entrees like shrimp scampi, veal marsala, freshly carved rotisserie meats. Discover new dishes and flavors with the daily menu of chef-driven specials! Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/98",
    location: "Resnik House, Resnik Food Hall",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/98/Copy of UR Menus (14 x 20 in) (22 x 28 in) (1).pdf",
    coordinates: {
      lat: 40.442521,
      lng: -79.940028,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 0,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 0,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 1,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 1,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 2,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 2,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 3,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 3,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 4,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 4,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 5,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 5,
          hour: 20,
          minute: 30,
        },
      },
      {
        start: {
          day: 6,
          hour: 16,
          minute: 30,
        },
        end: {
          day: 6,
          hour: 20,
          minute: 30,
        },
      },
    ],
  },
  {
    conceptId: 155,
    name: "WILD BLUE SUSHI - RUGE ATRIUM",
    shortDescription:
      "Fresh prepared sushi, hot rice bowls, bubble tea and coffee",
    description:
      "At Wild Blue, we craft fresh sushi daily using sustainably sourced seafood, made-to-order rice bowls and bubble teas. You can select from a wide variety of grab-and-options or request custom sushi, prepared on the spot. From rainbow rolls to poke bowls, Wild Blue has something for all sushi lovers. Choose from made-to-order orange chicken, teriyaki chicken or tofu rice bowls. We craft our menus with great respect for tradition, but our quality and sustainability standards keep us moving forward. We believe changing the world starts with us, and we're on a roll already. Our prepared foods may contain one, or a combination of, raw tuna, salmon, yellowtail, squid, octopus, fish roe, and/or other seafood. Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness especially if you have certain medical conditions. Our prepared foods may have come into contact with one, or a combination of, the following known allergens: eggs, milk, fish, shellfish, peanuts, tree nuts, wheat, soybeans, or sesame.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/155",
    location: "Scott Hall, Lower level",
    menu: "https://apps.studentaffairs.cmu.edu/dining/dashboard_images/Production/menus/155/Spring 23 Visix.pdf.pdf",
    coordinates: {
      lat: 40.442986,
      lng: -79.946761,
    },
    acceptsOnlineOrders: true,
    times: [
      {
        start: {
          day: 1,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 18,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 11,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 18,
          minute: 0,
        },
      },
    ],
  },
  {
    conceptId: 84,
    name: "ZEBRA LOUNGE",
    shortDescription:
      "Free trade organic tea and coffee, sandwiches, soup, pastries",
    description:
      "Nestled within the Great Hall of the College of Fine Arts, our trendy coffeehouse, Zebra Lounge, offers a diverse selection of treats. Discover locally roasted Mechanic Coffee, freshly baked pastries prepared on-site, a variety of Vaad-certified Manna sandwiches, sushi, salads, and an array of snacks. Zebra Lounge is ideal for starting your day with a delightful breakfast, enjoying a satisfying lunch, delving into an afternoon of focused study, or showcasing your artistic abilities, whether through song, music, or theater.",
    url: "https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/84",
    location: "College of Fine Arts, First Floor",
    coordinates: {
      lat: 40.441633,
      lng: -79.943015,
    },
    acceptsOnlineOrders: false,
    times: [
      {
        start: {
          day: 1,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 1,
          hour: 16,
          minute: 0,
        },
      },
      {
        start: {
          day: 2,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 2,
          hour: 16,
          minute: 0,
        },
      },
      {
        start: {
          day: 3,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 3,
          hour: 16,
          minute: 0,
        },
      },
      {
        start: {
          day: 4,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 4,
          hour: 16,
          minute: 0,
        },
      },
      {
        start: {
          day: 5,
          hour: 8,
          minute: 0,
        },
        end: {
          day: 5,
          hour: 16,
          minute: 0,
        },
      },
    ],
  },
];

const LocationTile = ({
  data,
  addReview,
  addReviewCalled,
  seeReviewsCalled,
  hasExistingReview,
}: {
  data: LocationData;
  addReview: boolean;
  hasExistingReview: boolean;
  addReviewCalled: () => unknown;
  seeReviewsCalled: () => unknown;
}) => {
  return (
    <div className={styles.card}>
      <h2>{data.name}</h2>
      {/* <Stars originalStars={2.5} size={}/> */}
      <div style={{ height: "34px" }}>
        <ReactStars
          count={5}
          size={24}
          activeColor="#2c2936"
          color="#d1d5db"
          value={findAggregate(Object.values(data.ratings ?? {}))}
          isHalf
          edit={false}
          key={findAggregate(Object.values(data.ratings ?? {}))}
        />
      </div>

      <p>{data.description}</p>
      <div style={{ marginTop: "auto" }}>
        <button
          style={{ marginRight: "10px" }}
          disabled={!addReview}
          onClick={() => addReviewCalled()}
        >
          {hasExistingReview ? "Update Review" : "Add review"}
        </button>
        <button onClick={seeReviewsCalled}>See Reviews</button>
      </div>
    </div>
  );
};

export default function Home() {
  const [provider, setProvider] = useState<GoogleAuthProvider>();
  const [auth, setAuth] = useState<Auth>();
  const [user, setUser] = useState<User | null>();
  const [db, setDb] = useState<Database>();
  const [locations, setLocations] = useState<AllLocations>();
  const [currentLocation, setCurrentLocation] = useState<string>();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [allReviewModalOpen, setAllReviewModalOpen] = useState(false);
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    setProvider(provider);
    setAuth(auth);
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const db = getDatabase();
    setDb(db);
    onValue(ref(db, "locations"), (snapshot) => {
      if (snapshot.exists()) {
        setLocations(snapshot.val());
      }
    });

    // locationsRaw.map((val) =>
    //   set(ref(db, "locations/" + val.conceptId), {
    //     name: val.name
    //       .trim()
    //       .split(" ")
    //       .map(
    //         (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    //       )
    //       .join(" "),
    //     description: val.shortDescription,
    //     reviews: {},
    //   })
    // );
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.heading}>
        <h1>
          Rate it!{" "}
          <span style={{ fontSize: "20px" }}>
            (Log in with your andrew account to add a review)
          </span>
        </h1>
        {user && <h3>Signed in as {user.email}</h3>}
        <button
          onClick={() => {
            if (
              provider !== undefined &&
              auth !== undefined &&
              user !== undefined
            ) {
              if (user === null) {
                signInWithPopup(auth, provider).catch();
              } else {
                signOut(auth);
              }
            }
          }}
          className={styles.large}
        >
          {user === undefined
            ? "Loading..."
            : user === null
            ? "Log in / Sign up"
            : "Log out"}
        </button>
      </div>
      {locations && currentLocation && user && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          locationId={currentLocation}
          locationName={locations[currentLocation].name}
          writeReview={async (review) => {
            if (!db || user === undefined) return;
            await set(
              ref(db, `locations/${review.locationId}/ratings/${user.uid}`),
              {
                title: review.title,
                text: review.review,
                time: +new Date(),
                stars: review.stars,
                seniority: review.seniority,
                reputation: review.reputation,
                name: user.displayName,
              }
            );
          }}
          deleteReview={async (locationId: string) => {
            if (!db || user === undefined) return;

            await remove(
              ref(db, `locations/${locationId}/ratings/${user.uid}`)
            );
          }}
          originalReview={locations[currentLocation].ratings?.[user.uid]}
          key={currentLocation} //probably the jankiest thing in existence
        />
      )}
      {locations && currentLocation && (
        <AllReviewModal
          open={allReviewModalOpen}
          onClose={() => setAllReviewModalOpen(false)}
          data={locations[currentLocation]}
          key={+new Date()} //probably the jankiest thing in existence
        />
      )}
      {locations && user !== undefined ? (
        <div className={styles.grid}>
          {(Object.entries(locations) as [string, LocationData][])
            .sort(
              ([_1, a], [_2, b]) =>
                findAggregate(Object.values(b.ratings ?? [])) -
                findAggregate(Object.values(a.ratings ?? []))
            )
            .map(([id, val]) => {
              const existingReview = user && val.ratings?.[user.uid];
              return (
                <LocationTile
                  key={id}
                  data={val}
                  addReview={
                    user !== null &&
                    user.email !== null &&
                    user.email.endsWith("cmu.edu")
                  }
                  addReviewCalled={() => {
                    setReviewModalOpen(true);
                    setCurrentLocation(id);
                  }}
                  seeReviewsCalled={() => {
                    setAllReviewModalOpen(true);
                    setCurrentLocation(id);
                  }}
                  hasExistingReview={!!existingReview}
                />
              );
            })}
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </main>
  );
}
