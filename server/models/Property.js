const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  purpose: {
    type: String,
    enum: ['sale', 'rent'],
    required: true
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    }
  },
  features: {
    bedrooms: {
      type: Number,
      default: 0,
      min: 0
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0
    },
    squareFeet: {
      type: Number,
      required: true,
      min: 0
    },
    yearBuilt: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear() + 5
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        'Apartment',
        'House',
        'Villa',
        'Townhouse',
        'Office Space',
        'Shop',
        'Warehouse',
        'Land',
        'Boys Quarters'
      ]
    },
    lotSize: {
      type: Number,
      default: 0,
      min: 0
    },
    furnished: {
      type: Boolean,
      default: false
    }
  },
  amenities: [{
    type: String,
    enum: [
      'Swimming Pool',
      'Security',
      'Backup Generator',
      'Air Conditioning',
      'Garage',
      'Garden',
      'Boys Quarters',
      'Staff Quarters',
      'Water Storage Tank',
      'CCTV',
      'Internet',
      'Gym',
      'Tennis Court',
      'Club House',
      'Children\'s Play Area',
      'Electric Fence',
      'Intercom',
      'Elevator',
      'Satellite TV',
      'Storage Room',
      'Covered Parking',
      'Security Post'
    ]
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending'],
    default: 'available'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentTerms: {
    type: String,
    trim: true,
    maxlength: 500
  },
  negotiable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add text index for search
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.city': 'text',
  'location.region': 'text'
});

// Pre-save middleware to validate coordinates
propertySchema.pre('save', function(next) {
  if (this.location.coordinates) {
    if (this.location.coordinates.lat < -90 || this.location.coordinates.lat > 90) {
      next(new Error('Invalid latitude. Must be between -90 and 90.'));
    }
    if (this.location.coordinates.lng < -180 || this.location.coordinates.lng > 180) {
      next(new Error('Invalid longitude. Must be between -180 and 180.'));
    }
  }
  next();
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.region}`;
});

// Method to format price
propertySchema.methods.formattedPrice = function() {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0
  }).format(this.price);
};

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
