// CanBeFound.com - Auctions Page Functionality

// Auction state
let auctionState = {
    auctions: [],
    filteredAuctions: [],
    filters: {
        category: '',
        status: '',
        priceRange: ''
    },
    sort: 'ending-soon',
    currentPage: 1,
    itemsPerPage: 12
};

// Initialize auctions page
document.addEventListener('DOMContentLoaded', function() {
    initializeAuctionsPage();
    loadAuctionData();
});

// Initialize auctions page functionality
function initializeAuctionsPage() {
    // Initialize filters
    initializeAuctionFilters();
    
    // Initialize sorting
    initializeAuctionSorting();
    
    // Initialize bid modal
    initializeBidModal();
    
    // Initialize auction detail modal
    initializeAuctionDetailModal();
    
    console.log('Auctions page initialized');
}

// Initialize auction filters
function initializeAuctionFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priceFilter = document.getElementById('priceFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    [categoryFilter, statusFilter, priceFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', updateAuctionFilters);
        }
    });
    
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAuctionFilters);
    }
}

// Update auction filters
function updateAuctionFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    auctionState.filters = {
        category: categoryFilter?.value || '',
        status: statusFilter?.value || '',
        priceRange: priceFilter?.value || ''
    };
    
    filterAndDisplayAuctions();
}

// Clear auction filters
function clearAuctionFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    
    auctionState.filters = {
        category: '',
        status: '',
        priceRange: ''
    };
    
    filterAndDisplayAuctions();
}

// Initialize auction sorting
function initializeAuctionSorting() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            auctionState.sort = this.value;
            filterAndDisplayAuctions();
        });
    }
}

// Load auction data
async function loadAuctionData() {
    try {
        const auctions = await window.API.getAuctions();
        
        // Transform API data to match expected format
        auctionState.auctions = auctions.map(auction => ({
            id: auction.id,
            title: auction.title,
            category: auction.category,
            description: auction.description,
            image: auction.image,
            startingPrice: auction.startingPrice,
            currentBid: auction.currentBid,
            bidCount: auction.bidCount,
            endTime: new Date(auction.endTime),
            status: getAuctionStatus(auction),
            location: auction.location,
            bids: auction.bids || []
        }));
        
        // Display auctions
        filterAndDisplayAuctions();
        
    } catch (error) {
        console.error('Failed to load auction data:', error);
        
        // Fallback to mock data
        generateMockAuctions();
        filterAndDisplayAuctions();
        
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Using demo auction data', 'info');
        }
    }
}

// Get auction status based on end time
function getAuctionStatus(auction) {
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const timeLeft = endTime - now;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (timeLeft <= 0) {
        return 'ended';
    } else if (timeLeft <= twentyFourHours) {
        return 'ending-soon';
    } else {
        return 'active';
    }
}

// Generate mock auctions (fallback)
function generateMockAuctions() {
    auctionState.auctions = [
        {
            id: 1,
            title: 'Bluetooth Headphones',
            category: 'electronics',
            description: 'Sony WH-1000XM4 wireless headphones. Excellent condition.',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
            startingPrice: 25.00,
            currentBid: 45.00,
            bidCount: 8,
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            status: 'active',
            location: 'Library'
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
            endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            status: 'ending-soon',
            location: 'Cafeteria'
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
            endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            status: 'active',
            location: 'Math Building'
        }
    ];
}

// Filter and display auctions
function filterAndDisplayAuctions() {
    let filtered = [...auctionState.auctions];
    
    // Apply filters
    if (auctionState.filters.category) {
        filtered = filtered.filter(auction => auction.category === auctionState.filters.category);
    }
    
    if (auctionState.filters.status) {
        if (auctionState.filters.status === 'ending-soon') {
            filtered = filtered.filter(auction => auction.status === 'ending-soon');
        } else {
            filtered = filtered.filter(auction => auction.status === auctionState.filters.status);
        }
    }
    
    if (auctionState.filters.priceRange) {
        const [min, max] = auctionState.filters.priceRange.split('-').map(p => 
            p === '100+' ? Infinity : parseInt(p)
        );
        filtered = filtered.filter(auction => {
            const price = auction.currentBid;
            return price >= min && (max === undefined || price <= max);
        });
    }
    
    // Sort auctions
    filtered = sortAuctions(filtered);
    
    // Display auctions
    displayAuctions(filtered);
    
    auctionState.filteredAuctions = filtered;
}

// Sort auctions
function sortAuctions(auctions) {
    const sorted = [...auctions];
    
    switch (auctionState.sort) {
        case 'ending-soon':
            sorted.sort((a, b) => a.endTime - b.endTime);
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.currentBid - b.currentBid);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.currentBid - a.currentBid);
            break;
        case 'popular':
            sorted.sort((a, b) => b.bidCount - a.bidCount);
            break;
    }
    
    return sorted;
}

// Display auctions
function displayAuctions(auctions) {
    const container = document.getElementById('auctionsGrid');
    if (!container) return;
    
    if (auctions.length === 0) {
        container.innerHTML = `
            <div class="no-auctions" style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-3xl);">
                <div style="font-size: var(--font-size-3xl); margin-bottom: var(--spacing-lg); opacity: 0.5;">🏷️</div>
                <h3>No auctions found</h3>
                <p style="color: var(--text-light);">Try adjusting your filters or check back later.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = auctions.map(auction => createAuctionCard(auction)).join('');
    
    // Add event listeners
    auctions.forEach(auction => {
        const card = container.querySelector(`[data-auction-id="${auction.id}"]`);
        if (card) {
            const bidBtn = card.querySelector('.bid-btn');
            const viewBtn = card.querySelector('.view-details-btn');
            
            if (bidBtn) {
                bidBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openBidModal(auction);
                });
            }
            
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openAuctionDetailModal(auction);
                });
            }
            
            // Card click to view details
            card.addEventListener('click', () => {
                openAuctionDetailModal(auction);
            });
        }
    });
}

// Create auction card HTML
function createAuctionCard(auction) {
    const timeLeft = getTimeLeft(auction.endTime);
    const statusClass = auction.status;
    const statusText = auction.status === 'ending-soon' ? 'Ending Soon' : 
                     auction.status === 'ended' ? 'Ended' : 'Active';
    
    return `
        <div class="auction-card" data-auction-id="${auction.id}">
            <div class="auction-image">
                <img src="${auction.image}" alt="${auction.title}" loading="lazy">
                <div class="auction-status ${statusClass}">${statusText}</div>
                <div class="auction-timer">${timeLeft}</div>
            </div>
            <div class="auction-content">
                <h3 class="auction-title">${auction.title}</h3>
                <div class="auction-category">${auction.category}</div>
                <p class="auction-description">${auction.description}</p>
                
                <div class="auction-pricing">
                    <div class="price-info starting-price">
                        <div class="price-label">Starting Price</div>
                        <div class="price-value">$${auction.startingPrice.toFixed(2)}</div>
                    </div>
                    <div class="price-info current-bid">
                        <div class="price-label">Current Bid</div>
                        <div class="price-value">$${auction.currentBid.toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="auction-meta">
                    <div class="bid-count">
                        <span>👥</span>
                        <span>${auction.bidCount} bid${auction.bidCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="time-left">
                        <span>⏰</span>
                        <span>${timeLeft}</span>
                    </div>
                </div>
                
                <div class="auction-actions">
                    <button class="bid-btn" ${auction.status === 'ended' ? 'disabled' : ''}>
                        ${auction.status === 'ended' ? 'Auction Ended' : 'Place Bid'}
                    </button>
                    <button class="view-details-btn">View Details</button>
                </div>
            </div>
        </div>
    `;
}

// Get time left for auction
function getTimeLeft(endTime) {
    const now = new Date();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
        return 'Ended';
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Initialize bid modal
function initializeBidModal() {
    const bidForm = document.getElementById('bidForm');
    
    if (bidForm) {
        bidForm.addEventListener('submit', handleBidSubmission);
    }
}

// Open bid modal
function openBidModal(auction) {
    if (!window.Auth || !window.Auth.isLoggedIn()) {
        if (window.ModalManager) {
            window.ModalManager.openModal('loginModal');
        }
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Please log in to place a bid', 'info');
        }
        return;
    }
    
    const modal = document.getElementById('bidModal');
    const bidItemInfo = document.getElementById('bidItemInfo');
    const currentBidAmount = document.getElementById('currentBidAmount');
    const minBidAmount = document.getElementById('minBidAmount');
    const bidAmountInput = document.getElementById('bidAmount');
    
    if (!modal || !bidItemInfo) return;
    
    // Update modal content
    bidItemInfo.innerHTML = `
        <div class="bid-item-image">
            <img src="${auction.image}" alt="${auction.title}">
        </div>
        <div class="bid-item-details">
            <h3 class="bid-item-title">${auction.title}</h3>
            <div class="bid-item-category">${auction.category}</div>
        </div>
    `;
    
    // Update bid amounts
    if (currentBidAmount) {
        currentBidAmount.textContent = `$${auction.currentBid.toFixed(2)}`;
    }
    
    const minBid = auction.currentBid + 1;
    if (minBidAmount) {
        minBidAmount.textContent = minBid.toFixed(2);
    }
    
    if (bidAmountInput) {
        bidAmountInput.min = minBid;
        bidAmountInput.value = minBid;
    }
    
    // Store auction data for form submission
    modal.setAttribute('data-auction-id', auction.id);
    
    // Open modal
    if (window.ModalManager) {
        window.ModalManager.openModal('bidModal');
    }
}

// Handle bid submission
async function handleBidSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const modal = document.getElementById('bidModal');
    const auctionId = parseInt(modal.getAttribute('data-auction-id'));
    const bidAmountInput = document.getElementById('bidAmount');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (!bidAmountInput || !auctionId) return;
    
    const bidAmount = parseFloat(bidAmountInput.value);
    const auction = auctionState.auctions.find(a => a.id === auctionId);
    
    if (!auction) {
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Auction not found', 'error');
        }
        return;
    }
    
    // Validate bid amount
    if (bidAmount <= auction.currentBid) {
        showBidError(`Bid must be higher than $${auction.currentBid.toFixed(2)}`);
        return;
    }
    
    // Clear previous errors
    clearBidError();
    
    // Show loading state
    submitBtn.textContent = 'Placing Bid...';
    submitBtn.disabled = true;
    
    try {
        const currentUser = window.Auth.getCurrentUser();
        const bidderName = currentUser ? currentUser.name : 'Anonymous Bidder';
        
        const result = await window.API.placeBid(auctionId, bidAmount, bidderName);
        
        if (result.success) {
            // Update local auction data
            auction.currentBid = bidAmount;
            auction.bidCount++;
            
            // Close modal
            if (window.ModalManager) {
                window.ModalManager.closeModal('bidModal');
            }
            
            // Show success message
            if (window.CanBeFound) {
                window.CanBeFound.showNotification(
                    `Bid of $${bidAmount.toFixed(2)} placed successfully!`, 
                    'success'
                );
            }
            
            // Refresh display
            filterAndDisplayAuctions();
            
            // Reset form
            form.reset();
        }
        
    } catch (error) {
        console.error('Failed to place bid:', error);
        showBidError(error.message || 'Failed to place bid. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show bid error
function showBidError(message) {
    const errorElement = document.getElementById('bidAmountError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear bid error
function clearBidError() {
    const errorElement = document.getElementById('bidAmountError');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Close bid modal
function closeBidModal() {
    if (window.ModalManager) {
        window.ModalManager.closeModal('bidModal');
    }
}

// Initialize auction detail modal
function initializeAuctionDetailModal() {
    // Modal is initialized by modal manager
}

// Open auction detail modal
function openAuctionDetailModal(auction) {
    const modal = document.getElementById('auctionDetailModal');
    const modalBody = document.getElementById('auctionDetailBody');
    
    if (!modal || !modalBody) return;
    
    const timeLeft = getTimeLeft(auction.endTime);
    const statusClass = auction.status;
    const statusText = auction.status === 'ending-soon' ? 'Ending Soon' : 
                     auction.status === 'ended' ? 'Ended' : 'Active';
    
    modalBody.innerHTML = `
        <div class="auction-detail-header">
            <div class="auction-detail-image">
                <img src="${auction.image}" alt="${auction.title}" loading="lazy">
            </div>
            <div class="auction-detail-info">
                <h3 class="auction-detail-title">${auction.title}</h3>
                <div class="auction-status ${statusClass}">${statusText}</div>
                <div class="auction-detail-meta">
                    <div class="meta-item">
                        <div class="meta-label">Category</div>
                        <div class="meta-value">${auction.category}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Location Found</div>
                        <div class="meta-value">${auction.location}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Starting Price</div>
                        <div class="meta-value">$${auction.startingPrice.toFixed(2)}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Current Bid</div>
                        <div class="meta-value">$${auction.currentBid.toFixed(2)}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Total Bids</div>
                        <div class="meta-value">${auction.bidCount}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Time Left</div>
                        <div class="meta-value">${timeLeft}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="auction-detail-description">
            <h4>Description</h4>
            <p>${auction.description}</p>
        </div>
        
        <div class="auction-detail-actions">
            <button class="btn btn-primary" onclick="openBidModal(${JSON.stringify(auction).replace(/"/g, '&quot;')})" 
                    ${auction.status === 'ended' ? 'disabled' : ''}>
                ${auction.status === 'ended' ? 'Auction Ended' : 'Place Bid'}
            </button>
            <button class="btn btn-secondary" onclick="window.ModalManager?.closeModal('auctionDetailModal')">Close</button>
        </div>
    `;
    
    // Open modal
    if (window.ModalManager) {
        window.ModalManager.openModal('auctionDetailModal');
    }
}

// Load more auctions
function loadMoreAuctions() {
    // In a real app, this would load more data from the server
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('All auctions loaded', 'info');
    }
}

// Initialize load more button
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreAuctions);
    }
});

// Export auction functions
window.AuctionManager = {
    openBidModal,
    closeBidModal,
    openAuctionDetailModal,
    loadAuctionData,
    filterAndDisplayAuctions
};