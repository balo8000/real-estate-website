const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const { handleUpload, cloudinary } = require('../middleware/upload');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    // Increment views
    property.views += 1;
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create property
router.post('/', auth, async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user.id
    });
    const newProperty = await property.save();
    await newProperty.populate('owner', 'name email');
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update property
router.patch('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.keys(req.body).forEach(key => {
      property[key] = req.body[key];
    });

    const updatedProperty = await property.save();
    await updatedProperty.populate('owner', 'name email');
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete images from Cloudinary
    if (property.images && property.images.length > 0) {
      const deletePromises = property.images.map(image => {
        const publicId = image.url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises);
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search properties
router.get('/search', async (req, res) => {
  try {
    const {
      purpose,
      region,
      city,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
      furnished,
      amenities,
      featured
    } = req.query;

    const query = {};

    if (purpose) query.purpose = purpose;
    if (region) query['location.region'] = region;
    if (city) query['location.city'] = city;
    if (propertyType) query['features.propertyType'] = propertyType;
    if (bedrooms) query['features.bedrooms'] = { $gte: parseInt(bedrooms) };
    if (bathrooms) query['features.bathrooms'] = { $gte: parseInt(bathrooms) };
    if (furnished) query['features.furnished'] = furnished === 'true';
    if (featured) query.featured = featured === 'true';
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $all: amenitiesList };
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .sort({ featured: -1, createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload property images
router.post('/upload', auth, handleUpload, async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const imageUrls = req.files.images.map(file => ({
      url: file.path,
      caption: file.originalname
    }));

    res.json(imageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
