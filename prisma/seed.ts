import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  // 1. Italian Restaurant
  const italian = await prisma.restaurant.create({
    data: {
      name: 'Luigi\'s Trattoria',
      location: '123 Olive St, Little Italy',
      imageUrl: '/images/restaurants/restaurant_italian_1763588283648.png',
      menuItems: {
        create: [
          {
            name: 'Spaghetti Carbonara',
            description: 'Classic roman pasta with guanciale, egg, and pecorino.',
            price: 18.50,
            imageUrl: '/images/menu-items/menu_pasta_1763588337488.png',
          },
          {
            name: 'Margherita Pizza',
            description: 'San Marzano tomato sauce, fresh mozzarella, basil.',
            price: 15.00,
          },
          {
            name: 'Tiramisu',
            description: 'Espresso-soaked ladyfingers with mascarpone cream.',
            price: 9.00,
          },
        ],
      },
    },
  });

  // 2. Sushi Bar
  const sushi = await prisma.restaurant.create({
    data: {
      name: 'Zen Sushi',
      location: '456 Bamboo Ln, Downtown',
      imageUrl: '/images/restaurants/restaurant_sushi_1763588291676.png',
      menuItems: {
        create: [
          {
            name: 'Omakase Platter',
            description: 'Chef\'s selection of fresh nigiri and sashimi.',
            price: 45.00,
            imageUrl: '/images/menu-items/menu_sushi_1763588347340.png',
          },
          {
            name: 'Spicy Tuna Roll',
            description: 'Fresh tuna with spicy mayo and cucumber.',
            price: 12.00,
          },
          {
            name: 'Miso Soup',
            description: 'Traditional soybean soup with tofu and seaweed.',
            price: 4.00,
          },
        ],
      },
    },
  });

  // 3. Burger Joint
  const burger = await prisma.restaurant.create({
    data: {
      name: 'Burger Forge',
      location: '789 Industrial Ave, The District',
      imageUrl: '/images/restaurants/restaurant_burger_1763588299861.png',
      menuItems: {
        create: [
          {
            name: 'The Classic Smash',
            description: 'Double patty, american cheese, lettuce, tomato, house sauce.',
            price: 14.00,
            imageUrl: '/images/menu-items/menu_burger_1763588355040.png',
          },
          {
            name: 'Truffle Fries',
            description: 'Crispy fries tossed with truffle oil and parmesan.',
            price: 8.00,
          },
          {
            name: 'Vanilla Milkshake',
            description: 'Hand-spun milkshake made with real vanilla beans.',
            price: 7.00,
          },
        ],
      },
    },
  });

  // 4. Vegan Cafe
  const vegan = await prisma.restaurant.create({
    data: {
      name: 'Green Earth Cafe',
      location: '321 Eco Way, Green Valley',
      imageUrl: '/images/restaurants/restaurant_vegan_1763588322233.png',
      menuItems: {
        create: [
          {
            name: 'Superfood Salad',
            description: 'Kale, quinoa, avocado, blueberries, walnuts, lemon dressing.',
            price: 16.00,
            imageUrl: '/images/menu-items/menu_salad_1763588391687.png',
          },
          {
            name: 'Acai Bowl',
            description: 'Frozen acai topped with granola, banana, and chia seeds.',
            price: 13.00,
          },
          {
            name: 'Avocado Toast',
            description: 'Sourdough bread, smashed avocado, radish, chili flakes.',
            price: 11.00,
          },
        ],
      },
    },
  });

  // 5. Steakhouse
  const steak = await prisma.restaurant.create({
    data: {
      name: 'Prime Cut Steakhouse',
      location: '555 Luxury Blvd, Uptown',
      imageUrl: '/images/restaurants/restaurant_steakhouse_1763588330413.png',
      menuItems: {
        create: [
          {
            name: 'Ribeye Steak',
            description: '12oz USDA Prime ribeye, grilled to perfection.',
            price: 42.00,
            imageUrl: '/images/menu-items/menu_steak_1763588398540.png',
          },
          {
            name: 'Lobster Mac & Cheese',
            description: 'Creamy mac and cheese with chunks of fresh lobster.',
            price: 22.00,
          },
          {
            name: 'Caesar Salad',
            description: 'Romaine hearts, parmesan crisp, anchovy dressing.',
            price: 14.00,
          },
        ],
      },
    },
  });

  // 6. Mexican Restaurant
  const mexican = await prisma.restaurant.create({
    data: {
      name: 'Casa de Tacos',
      location: '888 Fiesta St, Downtown',
      imageUrl: '/images/restaurants/restaurant_mexican.png',
      menuItems: {
        create: [
          {
            name: 'Beef Tacos',
            description: 'Three soft tacos with seasoned beef, cilantro, and lime.',
            price: 12.00,
          },
          {
            name: 'Chicken Burrito',
            description: 'Large burrito with grilled chicken, rice, beans, and cheese.',
            price: 14.00,
          },
          {
            name: 'Guacamole & Chips',
            description: 'Fresh guacamole with crispy tortilla chips.',
            price: 8.00,
          },
        ],
      },
    },
  });

  // 7. Thai Restaurant
  const thai = await prisma.restaurant.create({
    data: {
      name: 'Bangkok Street Food',
      location: '222 Spice Ave, Chinatown',
      imageUrl: '/images/restaurants/restaurant_thai.png',
      menuItems: {
        create: [
          {
            name: 'Pad Thai',
            description: 'Stir-fried rice noodles with shrimp, peanuts, and tamarind sauce.',
            price: 15.00,
          },
          {
            name: 'Green Curry',
            description: 'Spicy green curry with chicken, bamboo shoots, and basil.',
            price: 16.00,
          },
          {
            name: 'Mango Sticky Rice',
            description: 'Sweet sticky rice with fresh mango and coconut cream.',
            price: 7.00,
          },
        ],
      },
    },
  });

  // 8. French Bistro
  const french = await prisma.restaurant.create({
    data: {
      name: 'Le Petit Bistro',
      location: '333 Rue de Paris, Arts District',
      imageUrl: '/images/restaurants/restaurant_french.png',
      menuItems: {
        create: [
          {
            name: 'Coq au Vin',
            description: 'Braised chicken in red wine with mushrooms and pearl onions.',
            price: 24.00,
          },
          {
            name: 'French Onion Soup',
            description: 'Rich beef broth with caramelized onions and gruyere cheese.',
            price: 10.00,
          },
          {
            name: 'Crème Brûlée',
            description: 'Classic vanilla custard with caramelized sugar topping.',
            price: 9.00,
          },
        ],
      },
    },
  });

  // 9. Indian Restaurant
  const indian = await prisma.restaurant.create({
    data: {
      name: 'Spice of India',
      location: '444 Curry Lane, Little India',
      imageUrl: '/images/restaurants/restaurant_indian.png',
      menuItems: {
        create: [
          {
            name: 'Chicken Tikka Masala',
            description: 'Tender chicken in creamy tomato curry sauce.',
            price: 17.00,
          },
          {
            name: 'Vegetable Biryani',
            description: 'Fragrant basmati rice with mixed vegetables and spices.',
            price: 14.00,
          },
          {
            name: 'Naan Bread',
            description: 'Fresh-baked flatbread, plain or garlic.',
            price: 4.00,
          },
        ],
      },
    },
  });

  // 10. Greek Restaurant
  const greek = await prisma.restaurant.create({
    data: {
      name: 'Athens Taverna',
      location: '555 Olive Grove, Mediterranean Quarter',
      imageUrl: '/images/restaurants/restaurant_greek.png',
      menuItems: {
        create: [
          {
            name: 'Gyro Platter',
            description: 'Sliced lamb gyro with tzatziki, pita, and Greek salad.',
            price: 16.00,
          },
          {
            name: 'Moussaka',
            description: 'Layered eggplant, potato, and meat sauce with béchamel.',
            price: 18.00,
          },
          {
            name: 'Baklava',
            description: 'Sweet pastry with honey, nuts, and phyllo dough.',
            price: 6.00,
          },
        ],
      },
    },
  });

  // 11. Korean BBQ
  const korean = await prisma.restaurant.create({
    data: {
      name: 'Seoul BBQ House',
      location: '666 K-Town Blvd, Koreatown',
      imageUrl: '/images/restaurants/restaurant_korean.png',
      menuItems: {
        create: [
          {
            name: 'Bulgogi',
            description: 'Marinated beef grilled to perfection with vegetables.',
            price: 19.00,
          },
          {
            name: 'Bibimbap',
            description: 'Mixed rice bowl with vegetables, egg, and gochujang.',
            price: 15.00,
          },
          {
            name: 'Kimchi Pancake',
            description: 'Crispy pancake made with fermented kimchi.',
            price: 8.00,
          },
        ],
      },
    },
  });

  // 12. Mediterranean Cafe
  const mediterranean = await prisma.restaurant.create({
    data: {
      name: 'Mediterranean Breeze',
      location: '777 Coastal Way, Seaside',
      imageUrl: '/images/restaurants/restaurant_mediterranean.png',
      menuItems: {
        create: [
          {
            name: 'Falafel Wrap',
            description: 'Crispy falafel with hummus, tahini, and fresh vegetables.',
            price: 12.00,
          },
          {
            name: 'Grilled Octopus',
            description: 'Tender octopus with lemon, olive oil, and herbs.',
            price: 22.00,
          },
          {
            name: 'Tabbouleh',
            description: 'Fresh parsley salad with bulgur, tomatoes, and lemon.',
            price: 9.00,
          },
        ],
      },
    },
  });

  // 13. Chinese Restaurant
  const chinese = await prisma.restaurant.create({
    data: {
      name: 'Golden Dragon',
      location: '888 Dynasty Road, Chinatown',
      imageUrl: '/images/restaurants/restaurant_chinese.png',
      menuItems: {
        create: [
          {
            name: 'Kung Pao Chicken',
            description: 'Spicy stir-fried chicken with peanuts and vegetables.',
            price: 15.00,
          },
          {
            name: 'Peking Duck',
            description: 'Crispy roasted duck served with pancakes and hoisin sauce.',
            price: 28.00,
          },
          {
            name: 'Fried Rice',
            description: 'Classic fried rice with egg, vegetables, and choice of protein.',
            price: 11.00,
          },
        ],
      },
    },
  });

  // 14. BBQ Smokehouse
  const bbq = await prisma.restaurant.create({
    data: {
      name: 'Smokey\'s BBQ Pit',
      location: '999 Hickory Lane, South Side',
      imageUrl: '/images/restaurants/restaurant_bbq.png',
      menuItems: {
        create: [
          {
            name: 'Pulled Pork Sandwich',
            description: 'Slow-smoked pulled pork with coleslaw on a brioche bun.',
            price: 13.00,
          },
          {
            name: 'Beef Brisket Platter',
            description: '12-hour smoked brisket with two sides.',
            price: 24.00,
          },
          {
            name: 'Mac & Cheese',
            description: 'Creamy mac and cheese with a crispy breadcrumb topping.',
            price: 7.00,
          },
        ],
      },
    },
  });

  // 15. Seafood Restaurant
  const seafood = await prisma.restaurant.create({
    data: {
      name: 'Ocean\'s Catch',
      location: '1010 Harbor View, Waterfront',
      imageUrl: '/images/restaurants/restaurant_seafood.png',
      menuItems: {
        create: [
          {
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with lemon butter and asparagus.',
            price: 26.00,
          },
          {
            name: 'Seafood Paella',
            description: 'Spanish rice dish with shrimp, mussels, and clams.',
            price: 32.00,
          },
          {
            name: 'Clam Chowder',
            description: 'Creamy New England-style clam chowder.',
            price: 9.00,
          },
        ],
      },
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
