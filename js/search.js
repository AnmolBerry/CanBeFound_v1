// CanBeFound.com - Search Functionality

// Search state
let searchState = {
    query: '',
    filters: {
        status: '',
        category: '',
        location: '',
        date: ''
    },
    sort: 'newest',
    view: 'grid',
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    items: []
};

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    loadInitialData();
});

// Initialize search components
function initializeSearch() {
    // Search input and button
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Debounced search as user types
        searchInput.addEventListener('input', window.CanBeFound?.debounce(performSearch, 500));
    }
    
    // Filter toggle
    const filterToggle = document.getElementById('filterToggle');
    const filtersPanel = document.getElementById('filtersPanel');
    
    if (filterToggle && filtersPanel) {
        filterToggle.addEventListener('click', function() {
            const isActive = filtersPanel.classList.contains('active');
            
            if (isActive) {
                filtersPanel.classList.remove('active');
                filterToggle.classList.remove('active');
            } else {
                filtersPanel.classList.add('active');
                filterToggle.classList.add('active');
            }
        });
    }
    
    // Filter controls
    initializeFilters();
    
    // View toggle
    initializeViewToggle();
    
    // Sort controls
    initializeSortControls();
    
    // Load URL parameters
    loadURLParameters();
    
    console.log('Search functionality initialized');
}

// Initialize filters
function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFilters = document.getElementById('clearFilters');
    const applyFilters = document.getElementById('applyFilters');
    
    // Filter change handlers
    [statusFilter, categoryFilter, locationFilter, dateFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', updateFilters);
        }
    });
    
    // Clear filters
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            searchState.filters = {
                status: '',
                category: '',
                location: '',
                date: ''
            };
            
            // Reset filter UI
            if (statusFilter) statusFilter.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (locationFilter) locationFilter.value = '';
            if (dateFilter) dateFilter.value = '';
            
            performSearch();
        });
    }
    
    // Apply filters
    if (applyFilters) {
        applyFilters.addEventListener('click', performSearch);
    }
}

// Update filters
function updateFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    searchState.filters = {
        status: statusFilter?.value || '',
        category: categoryFilter?.value || '',
        location: locationFilter?.value || '',
        date: dateFilter?.value || ''
    };
    
    searchState.currentPage = 1; // Reset to first page
}

// Initialize view toggle
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const itemsContainer = document.getElementById('itemsContainer');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update container class
            if (itemsContainer) {
                itemsContainer.className = `items-container ${view}-view`;
            }
            
            searchState.view = view;
            
            // Announce to screen readers
            if (window.Accessibility) {
                window.Accessibility.announceToScreenReader(`Switched to ${view} view`);
            }
        });
    });
}

// Initialize sort controls
function initializeSortControls() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            searchState.sort = this.value;
            searchState.currentPage = 1; // Reset to first page
            performSearch();
        });
    }
}

// Load URL parameters
function loadURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        searchState.query = query;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
    }
}

// Load initial data
function loadInitialData() {
    // Load real data from API
    loadRealSearchData();
}

// Load real search data
async function loadRealSearchData() {
    try {
        const items = await window.API.getAllItems({ approved: true });
        searchState.items = items;
        searchState.totalItems = items.length;
        
        // Perform initial search
        performSearch();
        
    } catch (error) {
        console.error('Failed to load search data:', error);
        
        // Fallback to mock data
        generateMockData();
        performSearch();
        
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Using demo search data', 'info');
        }
    }
}

// Enhanced mock data generation
function generateMockData() {
    const mockItems = [
        {
            id: 1,
            title: 'iPhone 13 Pro',
            category: 'electronics',
            status: 'lost',
            location: 'library',
            date: '2025-01-15',
            description: 'Black iPhone 13 Pro with blue case. Has a small scratch on the back.',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
            reportedBy: 'John Doe',
            approved: true,
            contactEmail: 'john.doe@college.edu'
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
            reportedBy: 'Jane Smith',
            approved: true,
            contactEmail: 'jane.smith@college.edu'
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
            reportedBy: 'Mike Johnson',
            approved: true,
            contactEmail: 'mike.johnson@college.edu'
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
        },
        {
            id: 7,
            title: 'Wireless Mouse',
            category: 'electronics',
            status: 'found',
            location: 'library',
            date: '2025-01-09',
            description: 'Logitech wireless mouse, black color. Still has battery.',
            image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
            reportedBy: 'Alex Chen',
            approved: true,
            contactEmail: 'alex.chen@college.edu'
        },
        {
            id: 8,
            title: 'Textbook - Chemistry',
            category: 'books',
            status: 'found',
            location: 'classroom',
            date: '2025-01-08',
            description: 'Organic Chemistry textbook, 3rd edition. Has highlighting and notes.',
            image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
            reportedBy: 'Emma Wilson',
            approved: true,
            contactEmail: 'emma.wilson@college.edu'
        }
    ];
    
    searchState.items = mockItems;
    searchState.totalItems = mockItems.length;
}


// Perform search
function performSearch() {
    performRealSearch();
}

// Perform real search using API
async function performRealSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchState.query = searchInput.value.trim();
  }
  
  // Update filters
  updateFilters();
  
  // Show loading state
  showLoadingState();
  
  try {
    // Get filter values
    const filters = {
      search: searchState.query,
      category: searchState.filters.category,
      location: searchState.filters.location,
      status: searchState.filters.status,
      limit: searchState.itemsPerPage,
      offset: (searchState.currentPage - 1) * searchState.itemsPerPage,
    };
    
    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) {
        delete filters[key];
      }
    });
    
    const items = await window.API.getAllItems(filters);
    
    // Sort items locally
    const sortedItems = sortItems(items);
    
    // Display items
    displayItems(sortedItems);
    updateResultsInfo(sortedItems.length);
    
    // Update URL
    updateURL();
    
  } catch (error) {
    console.error('Search failed:', error);
    showErrorMessage('Search failed. Please try again.');
    
    // Hide loading state
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }
}

// Filter items
function filterItems() {
    let filtered = [...searchState.items];
    
    // Text search
    if (searchState.query) {
        const query = searchState.query.toLowerCase();
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }
    
    // Status filter
    if (searchState.filters.status) {
        filtered = filtered.filter(item => item.status === searchState.filters.status);
    }
    
    // Category filter
    if (searchState.filters.category) {
        filtered = filtered.filter(item => item.category === searchState.filters.category);
    }
    
    // Location filter
    if (searchState.filters.location) {
        filtered = filtered.filter(item => item.location === searchState.filters.location);
    }
    
    // Date filter
    if (searchState.filters.date) {
        const now = new Date();
        const filterDate = new Date();
        
        switch (searchState.filters.date) {
            case 'today':
                filterDate.setHours(0, 0, 0, 0);
                filtered = filtered.filter(item => new Date(item.date) >= filterDate);
                break;
            case 'week':
                filterDate.setDate(filterDate.getDate() - 7);
                filtered = filtered.filter(item => new Date(item.date) >= filterDate);
                break;
            case 'month':
                filterDate.setMonth(filterDate.getMonth() - 1);
                filtered = filtered.filter(item => new Date(item.date) >= filterDate);
                break;
        }
    }
    
    return filtered;
}

// Sort items
function sortItems(items) {
    const sorted = [...items];
    
    switch (searchState.sort) {
        case 'newest':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'status':
            sorted.sort((a, b) => a.status.localeCompare(b.status));
            break;
        case 'category':
            sorted.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    
    return sorted;
}

// Paginate items
function paginateItems(items) {
    const startIndex = (searchState.currentPage - 1) * searchState.itemsPerPage;
    const endIndex = startIndex + searchState.itemsPerPage;
    return items.slice(startIndex, endIndex);
}

// Display items
function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    // Hide loading and no results
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    
    if (items.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    // Generate HTML for items
    const itemsHTML = items.map(item => createItemHTML(item)).join('');
    container.innerHTML = itemsHTML;
    
    // Add click handlers
    items.forEach(item => {
        const itemElement = container.querySelector(`[data-item-id="${item.id}"]`);
        if (itemElement) {
            itemElement.addEventListener('click', () => openItemModal(item));
        }
    });
}

// Create item HTML
function createItemHTML(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    const actionText = item.status === 'lost' ? 'I Found This' : 'This is Mine';
    const categoryText = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const locationText = item.location.charAt(0).toUpperCase() + item.location.slice(1);
    
    return `
        <div class="item-card" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="item-status ${statusClass}">${statusText}</div>
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-category">${categoryText}</div>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                    <div class="item-location">
                        <span>📍</span>
                        <span>${locationText}</span>
                    </div>
                    <div class="item-date">
                        <span>📅</span>
                        <span>${window.CanBeFound?.formatDate(item.date) || item.date}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="claim-btn" onclick="event.stopPropagation(); claimItem(${item.id})">
                        ${actionText}
                    </button>
                    <button class="view-btn-item" onclick="event.stopPropagation(); openItemModal(${item.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Show loading state
function showLoadingState() {
    const container = document.getElementById('itemsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    
    if (container) container.innerHTML = '';
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (noResults) noResults.style.display = 'none';
}

// Update results info
function updateResultsInfo(totalResults) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const startItem = (searchState.currentPage - 1) * searchState.itemsPerPage + 1;
        const endItem = Math.min(startItem + searchState.itemsPerPage - 1, totalResults);
        
        if (totalResults === 0) {
            resultsCount.textContent = 'No items found';
        } else {
            resultsCount.textContent = `Showing ${startItem}-${endItem} of ${totalResults} items`;
        }
    }
}

// Update URL with search parameters
function updateURL() {
    const params = new URLSearchParams();
    
    if (searchState.query) {
        params.set('q', searchState.query);
    }
    
    if (searchState.filters.status) {
        params.set('status', searchState.filters.status);
    }
    
    if (searchState.filters.category) {
        params.set('category', searchState.filters.category);
    }
    
    if (searchState.filters.location) {
        params.set('location', searchState.filters.location);
    }
    
    if (searchState.filters.date) {
        params.set('date', searchState.filters.date);
    }
    
    if (searchState.sort !== 'newest') {
        params.set('sort', searchState.sort);
    }
    
    if (searchState.currentPage > 1) {
        params.set('page', searchState.currentPage);
    }
    
    const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
}

// Open item modal
function openItemModal(item) {
    if (window.ModalManager) {
        // Create modal content
        const modalBody = document.getElementById('itemModalBody');
        if (modalBody) {
            modalBody.innerHTML = createItemDetailHTML(item);
            
            // Setup claim button
            const claimBtn = modalBody.querySelector('.claim-btn');
            if (claimBtn) {
                claimBtn.addEventListener('click', () => {
                    window.ModalManager.closeModal('itemModal');
                    claimItem(item.id);
                });
            }
        }
        
        window.ModalManager.openModal('itemModal');
    }
}

// Create item detail HTML
function createItemDetailHTML(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    const actionText = item.status === 'lost' ? 'I Found This Item' : 'This Is My Item';
    const categoryText = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const locationText = item.location.charAt(0).toUpperCase() + item.location.slice(1);
    
    return `
        <div class="item-detail-header">
            <div class="item-detail-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="item-detail-info">
                <h3 class="item-detail-title">${item.title}</h3>
                <div class="item-status ${statusClass}">${statusText}</div>
                <div class="item-detail-meta">
                    <div class="meta-item">
                        <div class="meta-label">Category</div>
                        <div class="meta-value">${categoryText}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Location</div>
                        <div class="meta-value">${locationText}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Date</div>
                        <div class="meta-value">${window.CanBeFound?.formatDate(item.date) || item.date}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Reported By</div>
                        <div class="meta-value">${item.reportedBy}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="item-detail-description">
            <h4>Description</h4>
            <p>${item.description}</p>
        </div>
        
        <div class="item-detail-actions">
            <button class="btn btn-primary claim-btn">${actionText}</button>
            <button class="btn btn-secondary" onclick="window.ModalManager?.closeModal('itemModal')">Close</button>
        </div>
    `;
}

// Claim item
async function claimItem(itemId) {
    if (!window.Auth || !window.Auth.isLoggedIn()) {
        window.ModalManager?.openModal('loginModal');
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Please log in to claim an item', 'info');
        }
        return;
    }
    
    const item = searchState.items.find(i => i.id === itemId);
    if (!item) {
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Item not found', 'error');
        }
        return;
    }
    
    // Create claim modal
    createClaimModal(item);
}

// Create claim modal
function createClaimModal(item) {
    // Remove existing claim modal
    const existingModal = document.getElementById('claimModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const currentUser = window.Auth.getCurrentUser();
    const actionText = item.status === 'lost' ? 'I Found This Item' : 'This Is My Item';
    const proofText = item.status === 'lost' ? 
        'Please describe where and when you found this item:' : 
        'Please provide proof that this item belongs to you:';
    
    const modalHTML = `
        <div class="modal" id="claimModal" role="dialog" aria-labelledby="claim-title" aria-hidden="true">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="claim-title" class="modal-title">${actionText}</h2>
                    <button class="modal-close" aria-label="Close claim modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="claim-item-info">
                        <div class="claim-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="claim-item-details">
                            <h3>${item.title}</h3>
                            <p><strong>Category:</strong> ${item.category}</p>
                            <p><strong>Location:</strong> ${item.location}</p>
                            <p><strong>Date:</strong> ${window.CanBeFound?.formatDate(item.date) || item.date}</p>
                        </div>
                    </div>
                    
                    <form class="claim-form" id="claimForm">
                        <div class="form-group">
                            <label for="claimantName" class="form-label">Your Name</label>
                            <input type="text" id="claimantName" name="claimantName" class="form-input" 
                                   value="${currentUser?.name || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="claimantEmail" class="form-label">Your Email</label>
                            <input type="email" id="claimantEmail" name="claimantEmail" class="form-input" 
                                   value="${currentUser?.email || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="claimantPhone" class="form-label">Phone Number</label>
                            <input type="tel" id="claimantPhone" name="claimantPhone" class="form-input" 
                                   placeholder="(optional, for quick contact)">
                        </div>
                        
                        <div class="form-group">
                            <label for="proofOfOwnership" class="form-label">${proofText}</label>
                            <textarea id="proofOfOwnership" name="proofOfOwnership" class="form-textarea" 
                                      rows="4" required placeholder="${item.status === 'lost' ? 
                                      'Describe where and when you found it, any additional details...' : 
                                      'Provide specific details that prove ownership (serial numbers, unique features, etc.)...'}"></textarea>
                        </div>
                        
                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="verifyTruth" name="verifyTruth" required>
                                <span class="checkbox-custom"></span>
                                I verify that the information provided is truthful and accurate
                            </label>
                        </div>
                        
                        <div class="claim-actions">
                            <button type="button" class="btn btn-secondary" onclick="window.ModalManager?.closeModal('claimModal')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Submit Claim</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup the new modal
    const modal = document.getElementById('claimModal');
    if (window.ModalManager && modal) {
        window.ModalManager.setupModal(modal);
        
        // Setup form submission
        const claimForm = document.getElementById('claimForm');
        if (claimForm) {
            claimForm.addEventListener('submit', (e) => handleClaimSubmission(e, item));
        }
        
        // Open modal
        window.ModalManager.openModal('claimModal');
    }
}

// Handle claim submission
async function handleClaimSubmission(e, item) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Collect form data
    const formData = new FormData(form);
    const claimData = {};
    
    for (let [key, value] of formData.entries()) {
        claimData[key] = value;
    }
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        const result = await window.API.submitClaim(item.id, item.status, claimData);
        
        if (result.success) {
            // Close modal
            if (window.ModalManager) {
                window.ModalManager.closeModal('claimModal');
            }
            
            // Show success message
            if (window.CanBeFound) {
                window.CanBeFound.showNotification(
                    'Claim submitted successfully! You will be contacted for verification.', 
                    'success'
                );
            }
            
            // Remove modal from DOM
            setTimeout(() => {
                const modal = document.getElementById('claimModal');
                if (modal) {
                    modal.remove();
                }
            }, 500);
        }
        
    } catch (error) {
        console.error('Failed to submit claim:', error);
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Failed to submit claim. Please try again.', 'error');
        }
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Enhanced item modal
function openItemModal(item) {
    if (window.ModalManager) {
        // Create modal content
        const modalBody = document.getElementById('itemModalBody');
        if (modalBody) {
            modalBody.innerHTML = createEnhancedItemDetailHTML(item);
            
            // Setup claim button
            const claimBtn = modalBody.querySelector('.claim-btn');
            if (claimBtn) {
                claimBtn.addEventListener('click', () => {
                    window.ModalManager.closeModal('itemModal');
                    claimItem(item.id);
                });
            }
        }
        
        window.ModalManager.openModal('itemModal');
    }
}

// Create enhanced item detail HTML
function createEnhancedItemDetailHTML(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    const actionText = item.status === 'lost' ? 'I Found This Item' : 'This Is My Item';
    const categoryText = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const locationText = item.location.charAt(0).toUpperCase() + item.location.slice(1);
    
    return `
        <div class="item-detail-header">
            <div class="item-detail-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="item-detail-info">
                <h3 class="item-detail-title">${item.title}</h3>
                <div class="item-status ${statusClass}">${statusText}</div>
                <div class="item-detail-meta">
                    <div class="meta-item">
                        <div class="meta-label">Category</div>
                        <div class="meta-value">${categoryText}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Location</div>
                        <div class="meta-value">${locationText}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Date</div>
                        <div class="meta-value">${window.CanBeFound?.formatDate(item.date) || item.date}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Reported By</div>
                        <div class="meta-value">${item.reportedBy}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="item-detail-description">
            <h4>Description</h4>
            <p>${item.description}</p>
        </div>
        
        <div class="item-detail-contact">
            <h4>Contact Information</h4>
            <p style="color: var(--text-light); font-size: var(--font-size-sm);">
                Contact details will be shared after claim verification.
            </p>
        </div>
        
        <div class="item-detail-actions">
            <button class="btn btn-primary claim-btn">${actionText}</button>
            <button class="btn btn-secondary" onclick="window.ModalManager?.closeModal('itemModal')">Close</button>
        </div>
    `;
}

// Enhanced perform search to use real API
async function performRealSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchState.query = searchInput.value.trim();
  }
  
  // Update filters
  updateFilters();
  
  // Show loading state
  showLoadingState();
  
  try {
    // Get filter values
    const filters = {
      search: searchState.query,
      category: searchState.filters.category,
      location: searchState.filters.location,
      status: searchState.filters.status,
      limit: searchState.itemsPerPage,
      offset: (searchState.currentPage - 1) * searchState.itemsPerPage,
      approved: true // Only show approved items
    };
    
    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key] && key !== 'approved') {
        delete filters[key];
      }
    });
    
    const items = await window.API.getAllItems(filters);
    
    // Update search state
    searchState.items = items;
    searchState.totalItems = items.length;
    
    // Filter items locally (for additional client-side filtering)
    const filteredItems = filterItems();
    
    // Sort items locally
    const sortedItems = sortItems(filteredItems);
    
    // Display items
    displayItems(sortedItems);
    updateResultsInfo(sortedItems.length);
    
    // Update URL
    updateURL();
    
  } catch (error) {
    console.error('Search failed:', error);
    showErrorMessage('Search failed. Please try again.');
    
    // Hide loading state
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }
}

// Show error message
function showErrorMessage(message) {
    if (window.CanBeFound) {
        window.CanBeFound.showNotification(message, 'error');
    }
}

// Export search functions
window.SearchManager = {
    performSearch,
    performRealSearch,
    openItemModal,
    claimItem
};