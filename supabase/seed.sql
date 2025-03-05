-- Insert sample profiles
INSERT INTO public.profiles (id, first_name, last_name, phone_number, role, bio)
VALUES
  ('d7bed472-7fd6-4a78-929c-f12d31864df6', 'John', 'Smith', '+233201234567', 'agent', 'Experienced real estate agent with 10 years in the industry'),
  ('e9b9f3c1-6654-4cd9-a4cd-8f93f6ae6896', 'Sarah', 'Johnson', '+233207654321', 'agent', 'Specializing in luxury properties and international clients'),
  ('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Michael', 'Brown', '+233209876543', 'user', 'Looking for my dream home');

-- Insert sample properties
INSERT INTO public.properties (
  title, description, price, property_type, status, bedrooms, bathrooms, 
  size, location, address, features, images, agent_id
)
VALUES
  (
    'Luxury Villa in East Legon',
    'Beautiful 5-bedroom villa with modern amenities and stunning views',
    850000.00,
    'house',
    'available',
    5,
    6,
    450.75,
    '{"lat": 5.6363, "lng": -0.1525}',
    'East Legon, Greater Accra',
    ARRAY['Swimming Pool', 'Garden', 'Security System', 'Garage'],
    ARRAY['villa1.jpg', 'villa2.jpg', 'villa3.jpg'],
    'd7bed472-7fd6-4a78-929c-f12d31864df6'
  ),
  (
    'Modern Apartment in Airport Residential',
    'Spacious 3-bedroom apartment with high-end finishes',
    350000.00,
    'apartment',
    'available',
    3,
    3,
    200.50,
    '{"lat": 5.6028, "lng": -0.1858}',
    'Airport Residential, Accra',
    ARRAY['Air Conditioning', 'Gym', 'Security', 'Parking'],
    ARRAY['apt1.jpg', 'apt2.jpg'],
    'e9b9f3c1-6654-4cd9-a4cd-8f93f6ae6896'
  );

-- Insert sample reviews
INSERT INTO public.reviews (
  property_id, user_id, rating, title, content
)
VALUES
  (
    (SELECT id FROM public.properties WHERE title LIKE 'Luxury Villa%'),
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    5,
    'Amazing Property!',
    'This villa exceeded all my expectations. The location is perfect and the amenities are top-notch.'
  );

-- Insert sample messages
INSERT INTO public.messages (
  sender_id, receiver_id, property_id, content
)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'd7bed472-7fd6-4a78-929c-f12d31864df6',
    (SELECT id FROM public.properties WHERE title LIKE 'Luxury Villa%'),
    'Hi, I''m interested in viewing the villa. When would be a good time?'
  );

-- Insert sample saved properties
INSERT INTO public.saved_properties (
  user_id, property_id
)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    (SELECT id FROM public.properties WHERE title LIKE 'Modern Apartment%')
  );
