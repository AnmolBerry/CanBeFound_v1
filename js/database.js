// CanBeFound.com - Dummy Database System

// Dummy database storage
let database = {
  users: [
    {
      id: 1,
      name: 'Om Pingale',
      email: 'omp@college.edu',
      collegeId: 'STU001',
      password: 'password123',
      role: 'student',
      isVerified: true,
      phone: '+1234567890'
    },
    {
      id: 2,
      name: 'Anmol Berry',
      email: 'anmolb@college.edu',
      collegeId: 'STU002',
      password: 'password123',
      role: 'student',
      isVerified: true,
      phone: '+1234567891'
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@college.edu',
      collegeId: 'ADM001',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      phone: '+1234567892'
    }
  ],
  
  items: [
    {
      id: 1,
      title: 'iPhone 13 Pro',
      category: 'electronics',
      status: 'lost',
      location: 'library',
      date: '2025-01-15',
      description: 'Black iPhone 13 Pro with blue case. Has a small scratch on the back.',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'Om Pingale',
      approved: true,
      contactEmail: 'omp@college.edu'
    },
    {
      id: 2,
      title: 'Black Backpack',
      category: 'bags',
      status: 'found',
      location: 'cafeteria',
      date: '2025-01-14',
      description: 'Large black backpack with laptop compartment. Contains some books.',
      image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'Anmol Berry',
      approved: true,
      contactEmail: 'anmolb@college.edu'
    },
    {
      id: 3,
      title: 'Silver Watch',
      category: 'jewelry',
      status: 'found',
      location: 'gym',
      date: '2025-01-13',
      description: 'Silver digital watch with black strap. Waterproof.',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'Gaurav',
      approved: true,
      contactEmail: 'Gaurav@college.edu'
    },
    {
      id: 4,
      title: 'Blue Notebook',
      category: 'books',
      status: 'lost',
      location: 'classroom',
      date: '2025-01-12',
      description: 'Blue spiral notebook with physics notes. Has name "Sarah" on cover.',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'Sarah Wilson',
      approved: true,
      contactEmail: 'sarah.wilson@college.edu'
    },
    {
      id: 5,
      title: 'Red Jacket',
      category: 'clothing',
      status: 'found',
      location: 'auditorium',
      date: '2025-01-11',
      description: 'Red winter jacket, size medium. Has university logo.',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'Tom Brown',
      approved: true,
      contactEmail: 'tom.brown@college.edu'
    },
    {
      id: 6,
      title: 'Car Keys',
      category: 'keys',
      status: 'lost',
      location: 'parking',
      date: '2025-01-10',
      description: 'Toyota car keys with blue keychain. Has house keys attached.',
      image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400',
      reportedBy: 'Lisa Davis',
      approved: true,
      contactEmail: 'lisa.davis@college.edu'
    }
  ],
  
  auctions: [
    {
      id: 1,
      title: 'Bluetooth Headphones',
      category: 'electronics',
      description: 'Sony WH-1000XM4 wireless headphones. Excellent condition.',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      startingPrice: 25.00,
      currentBid: 45.00,
      bidCount: 8,
      endTime: new Date('2025-01-25T18:00:00'),
      status: 'active',
      location: 'Library',
      bids: [
        { bidder: 'John Doe', amount: 45.00, time: '2025-01-16T10:30:00' },
        { bidder: 'Jane Smith', amount: 40.00, time: '2025-01-16T09:15:00' }
      ]
    },
    {
      id: 2,
      title: 'Designer Backpack',
      category: 'bags',
      description: 'High-quality leather backpack with multiple compartments.',
      image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
      startingPrice: 20.00,
      currentBid: 32.00,
      bidCount: 12,
      endTime: new Date('2025-01-22T15:00:00'),
      status: 'active',
      location: 'Cafeteria',
      bids: [
        { bidder: 'Mike Johnson', amount: 32.00, time: '2025-01-16T11:45:00' },
        { bidder: 'Sarah Wilson', amount: 28.00, time: '2025-01-16T08:20:00' }
      ]
    },
    {
      id: 3,
      title: 'Scientific Calculator',
      category: 'electronics',
      description: 'TI-84 Plus graphing calculator. Perfect for math and science courses.',
      image: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=400',
      startingPrice: 15.00,
      currentBid: 28.00,
      bidCount: 6,
      endTime: new Date('2025-01-24T12:00:00'),
      status: 'active',
      location: 'Math Building',
      bids: [
        { bidder: 'Tom Brown', amount: 28.00, time: '2025-01-16T14:10:00' }
      ]
    },
    {
      id: 4,
      title: 'Winter Coat',
      category: 'clothing',
      description: 'Warm winter coat, size large. Navy blue color.',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      startingPrice: 30.00,
      currentBid: 35.00,
      bidCount: 4,
      endTime: new Date('2025-01-23T16:30:00'),
      status: 'ending-soon',
      location: 'Student Center',
      bids: [
        { bidder: 'Lisa Davis', amount: 35.00, time: '2025-01-16T13:25:00' }
      ]
    }
  ],
  
  bids: [],
  claims: []
};

// Database operations
class DummyDatabase {
  // User operations
  static findUserByEmail(email) {
    return database.users.find(user => user.email === email);
  }
  
  static findUserByCollegeId(collegeId) {
    return database.users.find(user => user.collegeId === collegeId);
  }
  
  static createUser(userData) {
    const newUser = {
      id: database.users.length + 1,
      ...userData,
      isVerified: true,
      role: 'student'
    };
    database.users.push(newUser);
    return newUser;
  }
  
  static authenticateUser(identifier, password) {
    const user = database.users.find(u => 
      (u.email === identifier || u.collegeId === identifier) && u.password === password
    );
    return user || null;
  }
  
  // Item operations
  static getAllItems(filters = {}) {
    let items = [...database.items];
    
    // Apply filters
    if (filters.search) {
      const query = filters.search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    if (filters.category) {
      items = items.filter(item => item.category === filters.category);
    }
    
    if (filters.status) {
      items = items.filter(item => item.status === filters.status);
    }
    
    if (filters.location) {
      items = items.filter(item => item.location === filters.location);
    }
    
    if (filters.approved !== undefined) {
      items = items.filter(item => item.approved === filters.approved);
    }
    
    return items;
  }
  
  static getItemById(id) {
    return database.items.find(item => item.id === parseInt(id));
  }
  
  static createItem(itemData) {
    const newItem = {
      id: database.items.length + 1,
      ...itemData,
      approved: false
    };
    database.items.push(newItem);
    return newItem;
  }
  
  // Auction operations
  static getAllAuctions(filters = {}) {
    let auctions = [...database.auctions];
    
    if (filters.category) {
      auctions = auctions.filter(auction => auction.category === filters.category);
    }
    
    if (filters.status) {
      if (filters.status === 'ending-soon') {
        const now = new Date();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        auctions = auctions.filter(auction => 
          auction.endTime - now <= twentyFourHours && auction.status === 'active'
        );
      } else {
        auctions = auctions.filter(auction => auction.status === filters.status);
      }
    }
    
    return auctions;
  }
  
  static getAuctionById(id) {
    return database.auctions.find(auction => auction.id === parseInt(id));
  }
  
  static placeBid(auctionId, bidderName, amount) {
    const auction = this.getAuctionById(auctionId);
    if (!auction) return null;
    
    if (amount <= auction.currentBid) {
      throw new Error('Bid must be higher than current bid');
    }
    
    const bid = {
      id: database.bids.length + 1,
      auctionId: auctionId,
      bidder: bidderName,
      amount: amount,
      time: new Date().toISOString()
    };
    
    database.bids.push(bid);
    auction.bids.push(bid);
    auction.currentBid = amount;
    auction.bidCount++;
    
    return bid;
  }
  
  // Claim operations
  static createClaim(claimData) {
    const newClaim = {
      id: database.claims.length + 1,
      ...claimData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    database.claims.push(newClaim);
    return newClaim;
  }
  
  // Stats operations
  static getStats() {
    return {
      totalActiveItems: database.items.filter(item => item.approved).length,
      successfullyReturned: 247,
      activeLostReports: database.items.filter(item => item.status === 'lost' && item.approved).length,
      foundItemsAwaiting: database.items.filter(item => item.status === 'found' && item.approved).length,
      itemsInAuction: database.auctions.filter(auction => auction.status === 'active').length
    };
  }
}

// Export for global use
window.DummyDatabase = DummyDatabase;
