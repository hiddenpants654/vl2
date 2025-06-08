import axios from 'axios';

// Types and mock data for local spots
export type SpotCategory =
  | 'places-to-eat'
  | 'outdoor'
  | 'exercising'
  | 'fishing-hunting'
  | 'entertainment-nightlife'
  | 'adventurous'
  | 'romantic'
  | 'hidden-gem';

export interface LocalSpot {
  id: string;
  title: string;
  description: string;
  category: SpotCategory;
  state: string;
  city: string;
  location: string;
  price: number;
  isUnlocked: boolean;
  listedBy: string; // user id
  images: string[];
  riskReward: number; // 1-5
  popularity: number; // unlock count
  rating?: number; // average rating
  unlocks: number;
}

// API base URL
const API_URL = 'http://localhost:4000/api';

// Example mock data
export const mockSpots: LocalSpot[] = [
  {
    id: '1',
    title: 'Secret Fishing Cove',
    description: 'A quiet spot only locals know about.',
    category: 'fishing-hunting',
    state: 'California',
    city: 'Riverbank',
    location: 'Riverbank Lane',
    price: 10,
    isUnlocked: false,
    listedBy: 'local1',
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'],
    riskReward: 4,
    popularity: 12,
    rating: 4.5,
    unlocks: 12,
  },
  {
    id: '2',
    title: 'Hidden Gem Diner',
    description: 'Best pancakes in town, no tourists.',
    category: 'places-to-eat',
    state: 'California',
    city: 'Mapleton',
    location: 'Maple St.',
    price: 8,
    isUnlocked: false,
    listedBy: 'local2',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'],
    riskReward: 2,
    popularity: 8,
    rating: 4.8,
    unlocks: 8,
  },
  {
    id: '3',
    title: 'Sunset Cliff Overlook',
    description: 'A breathtaking view, perfect for a romantic evening.',
    category: 'romantic',
    state: 'Oregon',
    city: 'Seaside',
    location: 'Cliffside Trail',
    price: 12,
    isUnlocked: false,
    listedBy: 'local3',
    images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'],
    riskReward: 3,
    popularity: 15,
    rating: 4.9,
    unlocks: 15,
  },
  {
    id: '4',
    title: 'Urban Rooftop Gym',
    description: 'Unconventional exercise spot with city views.',
    category: 'exercising',
    state: 'New York',
    city: 'Hilltown',
    location: '5th Ave Rooftop',
    price: 7,
    isUnlocked: false,
    listedBy: 'local4',
    images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80'],
    riskReward: 5,
    popularity: 5,
    rating: 4.2,
    unlocks: 5,
  },
  {
    id: '5',
    title: 'Spooky Tunnel Adventure',
    description: 'Explore the old tunnels—enter if you dare!',
    category: 'adventurous',
    state: 'Illinois',
    city: 'Oldtown',
    location: 'Main St. Tunnels',
    price: 6,
    isUnlocked: false,
    listedBy: 'local5',
    images: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80'],
    riskReward: 5,
    popularity: 3,
    rating: 3.8,
    unlocks: 3,
  },
  {
    id: '6',
    title: 'Birdwatcher’s Paradise',
    description: 'A peaceful spot for rare bird sightings.',
    category: 'outdoor',
    state: 'Florida',
    city: 'Palm City',
    location: 'Wetlands Reserve',
    price: 9,
    isUnlocked: false,
    listedBy: 'local6',
    images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
    riskReward: 2,
    popularity: 10,
    rating: 4.7,
    unlocks: 10,
  },
  {
    id: '7',
    title: 'After Hours Jazz Bar',
    description: 'Live music and a secret menu after midnight.',
    category: 'entertainment-nightlife',
    state: 'Louisiana',
    city: 'New Orleans',
    location: 'Bourbon St.',
    price: 15,
    isUnlocked: false,
    listedBy: 'local7',
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'],
    riskReward: 3,
    popularity: 20,
    rating: 4.6,
    unlocks: 20,
  },
  {
    id: '8',
    title: 'Sunbather’s Cove',
    description: 'Secluded beach for sunbathing and relaxation.',
    category: 'outdoor',
    state: 'California',
    city: 'Laguna',
    location: 'Hidden Beach',
    price: 11,
    isUnlocked: false,
    listedBy: 'local8',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'],
    riskReward: 2,
    popularity: 18,
    rating: 4.9,
    unlocks: 18,
  },
  {
    id: '9',
    title: 'Late Night Food Truck',
    description: 'Best tacos in the city, only open after 10pm.',
    category: 'places-to-eat',
    state: 'Texas',
    city: 'Austin',
    location: '6th Street',
    price: 5,
    isUnlocked: false,
    listedBy: 'local9',
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'],
    riskReward: 3,
    popularity: 25,
    rating: 4.4,
    unlocks: 25,
  },
  {
    id: '10',
    title: 'Riverside Picnic Park',
    description: 'Perfect for family gatherings and outdoor fun.',
    category: 'outdoor',
    state: 'Colorado',
    city: 'Boulder',
    location: 'Riverside Dr.',
    price: 7,
    isUnlocked: false,
    listedBy: 'local10',
    images: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80'],
    riskReward: 1,
    popularity: 30,
    rating: 4.3,
    unlocks: 30,
  },
];

// Example: fetch spots from backend
export async function fetchSpots() {
  const res = await axios.get(`${API_URL}/spots`);
  return res.data;
}

export async function fetchUsers() {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
}
