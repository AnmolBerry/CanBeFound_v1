// CanBeFound.com - API Client for Frontend Integration

class CanBeFoundAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.restEndpoint = `${baseURL}/api/rest`;
    this.graphqlEndpoint = `${baseURL}/api/graphql`;
    this.useDummyData = true; // Use dummy database for demo
  }

  // Helper method for REST requests
  async restRequest(endpoint, options = {}) {
    // Use dummy database if enabled
    if (this.useDummyData) {
      return this.handleDummyRequest(endpoint, options);
    }
    
    try {
      const response = await fetch(`${this.restEndpoint}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Request failed');
      }

      return result;
    } catch (error) {
      console.error('REST request failed:', error);
      throw error;
    }
  }

  // Handle dummy database requests
  async handleDummyRequest(endpoint, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;
    
    try {
      switch (endpoint) {
        case '/auth/login':
          return this.handleDummyLogin(body);
        case '/auth/signup':
          return this.handleDummySignup(body);
        case '/items':
          return this.handleDummyGetItems(new URLSearchParams(endpoint.split('?')[1] || ''));
        case '/auctions':
          return this.handleDummyGetAuctions(new URLSearchParams(endpoint.split('?')[1] || ''));
        case '/stats':
          return this.handleDummyGetStats();
        case '/lost-items':
          return this.handleDummyCreateItem(body, 'lost');
        case '/found-items':
          return this.handleDummyCreateItem(body, 'found');
        case '/contact':
          return this.handleDummyContact(body);
        default:
          if (endpoint.includes('/bid')) {
            return this.handleDummyBid(endpoint, body);
          }
          if (endpoint.includes('/claim')) {
            return this.handleDummyClaim(body);
          }
          return { success: true, message: 'Mock operation completed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  handleDummyLogin(credentials) {
    const { email, password } = credentials;
    const user = window.DummyDatabase.authenticateUser(email, password);
    
    if (user) {
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          collegeId: user.collegeId,
          role: user.role,
          isVerified: user.isVerified
        },
        token: `dummy-token-${user.id}-${Date.now()}`
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }
  
  handleDummySignup(userData) {
    const { name, email, collegeId, password } = userData;
    
    // Check if user already exists
    if (window.DummyDatabase.findUserByEmail(email)) {
      throw new Error('Email already registered');
    }
    
    if (window.DummyDatabase.findUserByCollegeId(collegeId)) {
      throw new Error('College ID already registered');
    }
    
    const newUser = window.DummyDatabase.createUser({
      name,
      email,
      collegeId,
      password
    });
    
    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        collegeId: newUser.collegeId,
        role: newUser.role,
        isVerified: newUser.isVerified
      },
      token: `dummy-token-${newUser.id}-${Date.now()}`
    };
  }
  
  handleDummyGetItems(params) {
    const filters = {};
    for (let [key, value] of params.entries()) {
      filters[key] = value;
    }
    
    const items = window.DummyDatabase.getAllItems(filters);
    return { success: true, items };
  }
  
  handleDummyGetAuctions(params) {
    const filters = {};
    for (let [key, value] of params.entries()) {
      filters[key] = value;
    }
    
    const auctions = window.DummyDatabase.getAllAuctions(filters);
    return { success: true, auctions };
  }
  
  handleDummyGetStats() {
    const stats = window.DummyDatabase.getStats();
    return { success: true, stats };
  }
  
  handleDummyCreateItem(itemData, type) {
    const newItem = window.DummyDatabase.createItem({
      ...itemData,
      status: type,
      date: new Date().toISOString().split('T')[0]
    });
    
    return {
      success: true,
      item: newItem,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item report submitted successfully`
    };
  }
  
  handleDummyContact(contactData) {
    console.log('Contact message received:', contactData);
    return {
      success: true,
      message: 'Message sent successfully'
    };
  }
  
  handleDummyBid(endpoint, bidData) {
    // Extract auction ID from endpoint
    const auctionId = parseInt(endpoint.split('/')[2]);
    const { amount, bidderName } = bidData;
    
    try {
      const bid = window.DummyDatabase.placeBid(auctionId, bidderName, amount);
      return {
        success: true,
        bid,
        message: 'Bid placed successfully'
      };
    } catch (error) {
      throw error;
    }
  }
  
  handleDummyClaim(claimData) {
    const claim = window.DummyDatabase.createClaim(claimData);
    return {
      success: true,
      claim,
      message: 'Claim submitted successfully'
    };
  }

  // Helper method for GraphQL requests
  async graphqlRequest(query, variables = {}) {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return await this.restRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name, email, collegeId, password) {
    return await this.restRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, collegeId, password }),
    });
  }

  async logout() {
    const query = `
      mutation {
        endSession
      }
    `;

    return await this.graphqlRequest(query);
  }

  async getCurrentUser() {
    const query = `
      query {
        authenticatedItem {
          ... on User {
            id
            name
            email
            collegeId
            role
            isVerified
            phone
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query);
    return data.authenticatedItem;
  }

  // Items
  async getAllItems(filters = {}) {
    const params = new URLSearchParams(filters);
    const result = await this.restRequest(`/items?${params}`);
    return result.items;
  }

  async getRecentItems(limit = 8) {
    const result = await this.restRequest(`/items?limit=${limit}`);
    return result.items.slice(0, limit);
  }

  async getPlatformStats() {
    const result = await this.restRequest('/stats');
    return result.stats;
  }

  // Submit lost item report
  async submitLostItem(formData) {
    return await this.restRequest('/lost-items', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Submit found item report
  async submitFoundItem(formData) {
    return await this.restRequest('/found-items', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Submit contact message
  async submitContactMessage(formData) {
    return await this.restRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Get auctions
  async getAuctions(filters = {}) {
    const params = new URLSearchParams(filters);
    const result = await this.restRequest(`/auctions?${params.toString()}`);
    return result.auctions;
  }

  // Place bid
  async placeBid(auctionId, amount, bidderName = 'Current User') {
    return await this.restRequest(`/auctions/${auctionId}/bid`, {
      method: 'POST',
      body: JSON.stringify({ amount, bidderName }),
    });
  }

  // Submit claim
  async submitClaim(itemId, itemType, claimData) {
    return await this.restRequest('/claims', {
      method: 'POST',
      body: JSON.stringify({
        itemId,
        itemType,
        ...claimData
      }),
    });
  }
  
  // Get single item
  async getItem(itemId) {
    const result = await this.restRequest(`/items/${itemId}`);
    return result.item;
  }
  
  // Get single auction
  async getAuction(auctionId) {
    const result = await this.restRequest(`/auctions/${auctionId}`);
    return result.auction;
  }

  // Get user's items
  async getUserItems(userId) {
    const query = `
      query GetUserItems($userId: ID!) {
        user(where: { id: $userId }) {
          lostItems {
            id
            itemName
            category
            status
            lostDate
            location
            photo {
              url
            }
          }
          foundItems {
            id
            itemName
            category
            status
            foundDate
            location
            photo {
              url
            }
          }
          claims {
            id
            status
            createdAt
            lostItem {
              itemName
            }
            foundItem {
              itemName
            }
          }
          bids {
            id
            amount
            bidTime
            isWinning
            auction {
              title
              status
              endTime
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { userId });
    return data.user;
  }

  // Get approved items only
  async getApprovedItems(filters = {}) {
    try {
      const allItems = await this.getAllItems(filters);
      // Filter for approved items only
      return allItems.filter(item => item.approved !== false);
    } catch (error) {
      console.error('Failed to get approved items:', error);
      throw error;
    }
  }

  // Admin functions
  async approveItem(itemId, itemType) {
    try {
      const endpoint = itemType === 'lost' ? '/lost-items' : '/found-items';
      return await this.restRequest(`${endpoint}/${itemId}/approve`, {
        method: 'PATCH',
      });
    } catch (error) {
      // Mock approval for demo
      console.log('Mock item approved:', { itemId, itemType });
      return { success: true, message: 'Item approved successfully' };
    }
  }

  async deleteItem(itemId, itemType) {
    try {
      const endpoint = itemType === 'lost' ? '/lost-items' : '/found-items';
      return await this.restRequest(`${endpoint}/${itemId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      // Mock deletion for demo
      console.log('Mock item deleted:', { itemId, itemType });
      return { success: true, message: 'Item deleted successfully' };
    }
  }
}

// Override the dummy request handler to handle query parameters properly
CanBeFoundAPI.prototype.restRequest = async function(endpoint, options = {}) {
  if (this.useDummyData) {
    return this.handleDummyRequest(endpoint, options);
  }
  
  try {
    const response = await fetch(`${this.restEndpoint}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Request failed');
    }

    return result;
  } catch (error) {
    console.error('REST request failed:', error);
    throw error;
  }
};

// Enhanced dummy request handler
CanBeFoundAPI.prototype.handleDummyRequest = async function(endpoint, options = {}) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;
  
  // Parse endpoint and query parameters
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');
  
  try {
    switch (true) {
      case path === '/auth/login':
        return this.handleDummyLogin(body);
      case path === '/auth/signup':
        return this.handleDummySignup(body);
      case path === '/items':
        return this.handleDummyGetItems(params);
      case path === '/auctions':
        return this.handleDummyGetAuctions(params);
      case path === '/stats':
        return this.handleDummyGetStats();
      case path === '/lost-items':
        return this.handleDummyCreateItem(body, 'lost');
      case path === '/found-items':
        return this.handleDummyCreateItem(body, 'found');
      case path === '/contact':
        return this.handleDummyContact(body);
      case path === '/claims':
        return this.handleDummyClaim(body);
      case path.includes('/bid'):
        return this.handleDummyBid(path, body);
      case path.startsWith('/items/'):
        const itemId = path.split('/')[2];
        const item = window.DummyDatabase.getItemById(itemId);
        return { success: true, item };
      case path.startsWith('/auctions/'):
        const auctionId = path.split('/')[2];
        const auction = window.DummyDatabase.getAuctionById(auctionId);
        return { success: true, auction };
      default:
        return { success: true, message: 'Mock operation completed' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add the dummy handler methods
CanBeFoundAPI.prototype.handleDummyLogin = function(credentials) {
  const { email, password } = credentials;
  const user = window.DummyDatabase.authenticateUser(email, password);
  
  if (user) {
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        collegeId: user.collegeId,
        role: user.role,
        isVerified: user.isVerified
      },
      token: `dummy-token-${user.id}-${Date.now()}`
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

CanBeFoundAPI.prototype.handleDummySignup = function(userData) {
  const { name, email, collegeId, password } = userData;
  
  // Check if user already exists
  if (window.DummyDatabase.findUserByEmail(email)) {
    throw new Error('Email already registered');
  }
  
  if (window.DummyDatabase.findUserByCollegeId(collegeId)) {
    throw new Error('College ID already registered');
  }
  
  const newUser = window.DummyDatabase.createUser({
    name,
    email,
    collegeId,
    password
  });
  
  return {
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      collegeId: newUser.collegeId,
      role: newUser.role,
      isVerified: newUser.isVerified
    },
    token: `dummy-token-${newUser.id}-${Date.now()}`
  };
};

CanBeFoundAPI.prototype.handleDummyGetItems = function(params) {
  const filters = {};
  for (let [key, value] of params.entries()) {
    filters[key] = value;
  }
  
  const items = window.DummyDatabase.getAllItems(filters);
  return { success: true, items };
};

CanBeFoundAPI.prototype.handleDummyGetAuctions = function(params) {
  const filters = {};
  for (let [key, value] of params.entries()) {
    filters[key] = value;
  }
  
  const auctions = window.DummyDatabase.getAllAuctions(filters);
  return { success: true, auctions };
};

CanBeFoundAPI.prototype.handleDummyGetStats = function() {
  const stats = window.DummyDatabase.getStats();
  return { success: true, stats };
};

CanBeFoundAPI.prototype.handleDummyCreateItem = function(itemData, type) {
  const newItem = window.DummyDatabase.createItem({
    ...itemData,
    status: type,
    date: new Date().toISOString().split('T')[0],
    approved: true // Auto-approve for demo
  });
  
  return {
    success: true,
    item: newItem,
    message: `${type === 'lost' ? 'Lost' : 'Found'} item report submitted successfully`
  };
};

CanBeFoundAPI.prototype.handleDummyContact = function(contactData) {
  console.log('Contact message received:', contactData);
  return {
    success: true,
    message: 'Message sent successfully'
  };
};

CanBeFoundAPI.prototype.handleDummyBid = function(endpoint, bidData) {
  // Extract auction ID from endpoint
  const auctionId = parseInt(endpoint.split('/')[2]);
  const { amount, bidderName } = bidData;
  
  try {
    const bid = window.DummyDatabase.placeBid(auctionId, bidderName, amount);
    return {
      success: true,
      bid,
      message: 'Bid placed successfully'
    };
  } catch (error) {
    throw error;
  }
};

CanBeFoundAPI.prototype.handleDummyClaim = function(claimData) {
  const claim = window.DummyDatabase.createClaim(claimData);
  return {
    success: true,
    claim,
    message: 'Claim submitted successfully'
  };
};

// Update existing methods to work with dummy data
CanBeFoundAPI.prototype.getAllItems = async function(filters = {}) {
  if (this.useDummyData) {
    const params = new URLSearchParams(filters);
    const result = await this.restRequest(`/items?${params.toString()}`);
    return result.items;
  }
  
  const params = new URLSearchParams(filters);
  const result = await this.restRequest(`/items?${params}`);
  return result.items;
};

CanBeFoundAPI.prototype.getAuctions = async function(filters = {}) {
  if (this.useDummyData) {
    const params = new URLSearchParams(filters);
    const result = await this.restRequest(`/auctions?${params.toString()}`);
    return result.auctions;
  }
  
  const params = new URLSearchParams(filters);
  const result = await this.restRequest(`/auctions?${params}`);
  return result.auctions;
};

CanBeFoundAPI.prototype.getPlatformStats = async function() {
  const result = await this.restRequest('/stats');
  return result.stats;
};

CanBeFoundAPI.prototype.getRecentItems = async function(limit = 8) {
  const result = await this.restRequest(`/items?limit=${limit}&approved=true`);
  return result.items.slice(0, limit);
};

// Place bid method update
CanBeFoundAPI.prototype.placeBid = async function(auctionId, amount, bidderName = 'Current User') {
  return await this.restRequest(`/auctions/${auctionId}/bid`, {
    method: 'POST',
    body: JSON.stringify({ amount, bidderName }),
  });
};

// Submit claim method update  
CanBeFoundAPI.prototype.submitClaim = async function(itemId, itemType, claimData) {
  return await this.restRequest('/claims', {
    method: 'POST',
    body: JSON.stringify({
      itemId,
      itemType,
      ...claimData
    }),
  });
};

// Create global API instance
window.API = new CanBeFoundAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanBeFoundAPI;
}