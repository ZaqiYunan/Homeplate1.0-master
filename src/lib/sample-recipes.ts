// Sample recipe data for Western, Asian, and Indonesian cuisines
// This can be used for testing the recipe filtering functionality

export const sampleRecipes = {
  western: [
    {
      name: "Beef Bourguignon",
      description: "Classic French braised beef in red wine",
      ingredients: ["beef chuck", "red wine", "carrots", "onions", "mushrooms", "thyme"],
      cuisine: "Western",
      region: "French",
      cookingTime: "3 hours",
      difficulty: "Hard"
    },
    {
      name: "Chicken Parmesan",
      description: "Breaded chicken with marinara and cheese",
      ingredients: ["chicken breast", "breadcrumbs", "parmesan", "marinara sauce", "mozzarella"],
      cuisine: "Western",
      region: "Italian-American",
      cookingTime: "45 minutes",
      difficulty: "Medium"
    },
    {
      name: "Fish and Chips",
      description: "British classic with battered fish and fried potatoes",
      ingredients: ["white fish", "flour", "beer", "potatoes", "vinegar", "peas"],
      cuisine: "Western",
      region: "British",
      cookingTime: "30 minutes",
      difficulty: "Medium"
    },
    {
      name: "Caesar Salad",
      description: "Classic Roman lettuce salad with parmesan and croutons",
      ingredients: ["romaine lettuce", "parmesan", "croutons", "anchovies", "garlic", "lemon"],
      cuisine: "Western",
      region: "American",
      cookingTime: "15 minutes",
      difficulty: "Easy"
    },
    {
      name: "Apple Pie",
      description: "Traditional American dessert with spiced apples",
      ingredients: ["apples", "flour", "butter", "sugar", "cinnamon", "nutmeg"],
      cuisine: "Western",
      region: "American",
      cookingTime: "1 hour",
      difficulty: "Medium"
    }
  ],
  
  asian: [
    {
      name: "Kung Pao Chicken",
      description: "Spicy Sichuan stir-fry with peanuts",
      ingredients: ["chicken", "peanuts", "chili peppers", "soy sauce", "rice wine", "scallions"],
      cuisine: "Asian",
      region: "Chinese",
      cookingTime: "20 minutes",
      difficulty: "Medium"
    },
    {
      name: "Chicken Teriyaki",
      description: "Japanese grilled chicken with sweet glaze",
      ingredients: ["chicken thigh", "soy sauce", "mirin", "sake", "sugar", "ginger"],
      cuisine: "Asian",
      region: "Japanese",
      cookingTime: "25 minutes",
      difficulty: "Easy"
    },
    {
      name: "Pad Thai",
      description: "Thai stir-fried rice noodles with shrimp",
      ingredients: ["rice noodles", "shrimp", "fish sauce", "tamarind", "bean sprouts", "lime"],
      cuisine: "Asian",
      region: "Thai",
      cookingTime: "15 minutes",
      difficulty: "Medium"
    },
    {
      name: "Korean Bibimbap",
      description: "Mixed rice bowl with vegetables and meat",
      ingredients: ["rice", "beef", "spinach", "carrots", "mushrooms", "gochujang"],
      cuisine: "Asian",
      region: "Korean",
      cookingTime: "30 minutes",
      difficulty: "Medium"
    },
    {
      name: "Indian Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken",
      ingredients: ["chicken", "tomatoes", "cream", "garam masala", "ginger", "garlic"],
      cuisine: "Asian",
      region: "Indian",
      cookingTime: "45 minutes",
      difficulty: "Medium"
    }
  ],
  
  indonesian: [
    {
      name: "Nasi Goreng",
      description: "Indonesian fried rice with sweet soy sauce",
      ingredients: ["rice", "kecap manis", "shallots", "garlic", "chili", "egg"],
      cuisine: "Indonesian",
      region: "Java",
      cookingTime: "20 minutes",
      difficulty: "Easy"
    },
    {
      name: "Beef Rendang",
      description: "Slow-cooked spicy beef in coconut curry",
      ingredients: ["beef", "coconut milk", "lemongrass", "galangal", "chili", "shallots"],
      cuisine: "Indonesian",
      region: "Padang",
      cookingTime: "3 hours",
      difficulty: "Hard"
    },
    {
      name: "Chicken Satay",
      description: "Grilled chicken skewers with peanut sauce",
      ingredients: ["chicken", "peanuts", "coconut milk", "palm sugar", "tamarind"],
      cuisine: "Indonesian",
      region: "Java",
      cookingTime: "30 minutes",
      difficulty: "Medium"
    },
    {
      name: "Gado-Gado",
      description: "Indonesian vegetable salad with peanut dressing",
      ingredients: ["vegetables", "tofu", "tempeh", "peanut sauce", "kerupuk"],
      cuisine: "Indonesian",
      region: "Java",
      cookingTime: "25 minutes",
      difficulty: "Easy"
    },
    {
      name: "Soto Ayam",
      description: "Indonesian chicken soup with turmeric and herbs",
      ingredients: ["chicken", "turmeric", "lemongrass", "lime leaves", "bean sprouts"],
      cuisine: "Indonesian",
      region: "Java",
      cookingTime: "45 minutes",
      difficulty: "Medium"
    },
    {
      name: "Gudeg",
      description: "Sweet jackfruit stew from Yogyakarta",
      ingredients: ["young jackfruit", "coconut milk", "palm sugar", "bay leaves", "galangal"],
      cuisine: "Indonesian",
      region: "Yogyakarta",
      cookingTime: "2 hours",
      difficulty: "Hard"
    }
  ]
};

export const cuisineDescriptions = {
  "western": {
    name: "Western",
    description: "Encompasses European, American, and Mediterranean cooking traditions with emphasis on varied techniques, seasonal ingredients, and balanced flavors.",
    characteristics: [
      "Diverse cooking methods (grilling, roasting, baking)",
      "Use of dairy products and wheat-based starches",
      "Herb-focused seasoning and wine in cooking",
      "Balanced flavors with emphasis on technique",
      "Seasonal ingredient usage"
    ],
    popularIngredients: [
      "beef", "pork", "chicken", "potatoes", "tomatoes", "cheese",
      "butter", "olive oil", "garlic", "herbs", "wine", "cream"
    ]
  },
  
  "asian": {
    name: "Asian",
    description: "Diverse culinary traditions from East, Southeast, and South Asia, known for umami-rich flavors, rice as staple, and aromatic spice combinations.",
    characteristics: [
      "Rice and noodles as primary starches",
      "Wok cooking and steaming techniques", 
      "Balance of sweet, sour, salty, and umami",
      "Fresh herbs and aromatic spices",
      "Fermented ingredients for depth"
    ],
    popularIngredients: [
      "soy sauce", "rice", "noodles", "ginger", "garlic", "chili",
      "sesame oil", "fish sauce", "coconut milk", "tofu", "scallions", "lime"
    ]
  },
  
  "indonesian": {
    name: "Indonesian",
    description: "A diverse cuisine reflecting Indonesia's thousands of islands, featuring bold spices, coconut, rice, and complex flavor profiles with sweet, spicy, and umami elements.",
    characteristics: [
      "Complex spice pastes (bumbu)",
      "Coconut milk in curries and dishes",
      "Rice as the main staple",
      "Balance of sweet, spicy, and savory",
      "Fermented ingredients like tempeh and kerupuk"
    ],
    popularIngredients: [
      "rice", "coconut milk", "chili", "shallots", "garlic", "ginger",
      "lemongrass", "galangal", "tamarind", "kecap manis", "tempeh", "tofu"
    ]
  }
};
