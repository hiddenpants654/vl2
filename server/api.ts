import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // In production, use env var

// --- In-memory mock data (move to DB later) ---
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'local' | 'buyer';
  isVerified: boolean;
  subscriptionActive?: boolean;
}

let users: User[] = [
  // Example: { id: 'local1', name: 'Alice', email: 'alice@email.com', password: '$2a$10$...', role: 'local', isVerified: true, subscriptionActive: true },
];

let spots = [
  {
    id: '1', title: 'Secret Fishing Cove', description: 'A quiet spot only locals know about.', category: 'fishing-hunting', state: 'California', city: 'Riverbank', location: 'Riverbank Lane', price: 10, isUnlocked: false, listedBy: 'local1', images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'], riskReward: 4, popularity: 12, rating: 4.5, unlocks: 12,
  },
  {
    id: '2', title: 'Hidden Gem Diner', description: 'Best pancakes in town, no tourists.', category: 'places-to-eat', state: 'California', city: 'Mapleton', location: 'Maple St.', price: 8, isUnlocked: false, listedBy: 'local2', images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'], riskReward: 2, popularity: 8, rating: 4.8, unlocks: 8,
  },
  {
    id: '3', title: 'Sunset Cliff Overlook', description: 'A breathtaking view, perfect for a romantic evening.', category: 'romantic', state: 'Oregon', city: 'Seaside', location: 'Cliffside Trail', price: 12, isUnlocked: false, listedBy: 'local3', images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'], riskReward: 3, popularity: 15, rating: 4.9, unlocks: 15,
  },
  {
    id: '4', title: 'Urban Rooftop Gym', description: 'Unconventional exercise spot with city views.', category: 'exercising', state: 'New York', city: 'Hilltown', location: '5th Ave Rooftop', price: 7, isUnlocked: false, listedBy: 'local4', images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80'], riskReward: 5, popularity: 5, rating: 4.2, unlocks: 5,
  },
  {
    id: '5', title: 'Spooky Tunnel Adventure', description: 'Explore the old tunnels—enter if you dare!', category: 'adventurous', state: 'Illinois', city: 'Oldtown', location: 'Main St. Tunnels', price: 6, isUnlocked: false, listedBy: 'local5', images: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80'], riskReward: 5, popularity: 3, rating: 3.8, unlocks: 3,
  },
  {
    id: '6', title: 'Birdwatcher’s Paradise', description: 'A peaceful spot for rare bird sightings.', category: 'outdoor', state: 'Florida', city: 'Palm City', location: 'Wetlands Reserve', price: 9, isUnlocked: false, listedBy: 'local6', images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'], riskReward: 2, popularity: 10, rating: 4.7, unlocks: 10,
  },
  {
    id: '7', title: 'After Hours Jazz Bar', description: 'Live music and a secret menu after midnight.', category: 'entertainment-nightlife', state: 'Louisiana', city: 'New Orleans', location: 'Bourbon St.', price: 15, isUnlocked: false, listedBy: 'local7', images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'], riskReward: 3, popularity: 20, rating: 4.6, unlocks: 20,
  },
  {
    id: '8', title: 'Sunbather’s Cove', description: 'Secluded beach for sunbathing and relaxation.', category: 'outdoor', state: 'California', city: 'Laguna', location: 'Hidden Beach', price: 11, isUnlocked: false, listedBy: 'local8', images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'], riskReward: 2, popularity: 18, rating: 4.9, unlocks: 18,
  },
  {
    id: '9', title: 'Late Night Food Truck', description: 'Best tacos in the city, only open after 10pm.', category: 'places-to-eat', state: 'Texas', city: 'Austin', location: '6th Street', price: 5, isUnlocked: false, listedBy: 'local9', images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'], riskReward: 3, popularity: 25, rating: 4.4, unlocks: 25,
  },
  {
    id: '10', title: 'Riverside Picnic Park', description: 'Perfect for family gatherings and outdoor fun.', category: 'outdoor', state: 'Colorado', city: 'Boulder', location: 'Riverside Dr.', price: 7, isUnlocked: false, listedBy: 'local10', images: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80'], riskReward: 1, popularity: 30, rating: 4.3, unlocks: 30,
  },
];

const app = express();
app.use(cors());
app.use(express.json());

// --- USERS ENDPOINTS ---
app.get('/api/users', (req: Request, res: Response) => {
  res.json(users);
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// --- SPOTS ENDPOINTS ---
app.get('/api/spots', (req: Request, res: Response) => {
  res.json(spots);
});

app.get('/api/spots/:id', (req: Request, res: Response) => {
  const spot = spots.find(s => s.id === req.params.id);
  if (!spot) return res.status(404).json({ error: 'Spot not found' });
  res.json(spot);
});

app.post('/api/spots', (req: Request, res: Response) => {
  const spot = { ...req.body, id: (spots.length + 1).toString() };
  spots.push(spot);
  res.status(201).json(spot);
});

app.put('/api/spots/:id', (req: Request, res: Response) => {
  const idx = spots.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Spot not found' });
  spots[idx] = { ...spots[idx], ...req.body };
  res.json(spots[idx]);
});

app.delete('/api/spots/:id', (req: Request, res: Response) => {
  const idx = spots.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Spot not found' });
  const removed = spots.splice(idx, 1);
  res.json(removed[0]);
});

// --- AUTH ENDPOINTS ---
// Register (signup)
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (!['local', 'buyer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    password: hash,
    role,
    isVerified: role === 'local' ? false : true,
    subscriptionActive: role === 'local' ? false : undefined,
  };
  users.push(user);
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { ...user, password: undefined } });
});

// Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { ...user, password: undefined } });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
